// updateManager.ts
// 基于 @capgo/capacitor-updater 的 JSON 驱动 OTA 更新
// 逻辑：拉取远端 version.json -> 比对本地版本 -> 下载 zip -> 立即切换或下次启动生效

import { Capacitor } from '@capacitor/core'
import { Preferences } from '@capacitor/preferences'
import { CapacitorUpdater } from '@capgo/capacitor-updater'

const PREF_KEY = 'h5_version'
const UPDATE_RETRY_KEY = 'update_retry_count'
const MAX_RETRY_COUNT = 3

export interface CheckUpdateOptions {
  jsonUrl: string
  immediate?: boolean          // 立即切换（reload），默认 true；否则下次启动生效
  embeddedVersion?: string     // 内置初始版本（首次运行/未写入本地时用），默认 '1.0.0'
  timeoutMs?: number           // fetch 超时，默认 12000ms (仅供参考，不实际使用)
  onLog?: (msg: string) => void
  retryOnFailure?: boolean     // 失败时是否重试，默认 true
}

export interface UpdateResult {
  skipped?: boolean
  upToDate?: boolean
  updated?: boolean
  immediate?: boolean
  localVersion?: string
  remoteVersion?: string
  error?: string
  gpt5Enabled?: boolean
}

// 简单 semver 比较，返回 -1/0/1
function cmpSemver(a: string, b: string): number {
  const na = a.split('.').map(n => parseInt(n, 10) || 0)
  const nb = b.split('.').map(n => parseInt(n, 10) || 0)
  for (let i = 0; i < Math.max(na.length, nb.length); i++) {
    const x = na[i] ?? 0, y = nb[i] ?? 0
    if (x > y) return 1
    if (x < y) return -1
  }
  return 0
}

// 获取重试次数
async function getRetryCount(): Promise<number> {
  const { value } = await Preferences.get({ key: UPDATE_RETRY_KEY })
  return parseInt(value || '0', 10)
}

// 设置重试次数
async function setRetryCount(count: number): Promise<void> {
  await Preferences.set({ key: UPDATE_RETRY_KEY, value: count.toString() })
}

// 重置重试次数
async function resetRetryCount(): Promise<void> {
  await Preferences.remove({ key: UPDATE_RETRY_KEY })
}

export async function checkAndUpdate(opts: CheckUpdateOptions): Promise<UpdateResult> {
  const {
    jsonUrl, 
    immediate = true, 
    embeddedVersion = '1.0.0', 
    onLog,
    retryOnFailure = true,
  } = opts
  
  const log = (m: string) => onLog?.(`[OTA] ${m}`)

  // 仅在原生环境执行
  if (!Capacitor.isNativePlatform()) {
    log?.('非原生环境，跳过 OTA 检查')
    return { skipped: true }
  }

  try {
    await CapacitorUpdater.notifyAppReady() // 回滚保护
    log?.('应用就绪状态已通知')
  } catch (e) {
    log?.(`notifyAppReady() 警告：${(e as any)?.message || e}`)
  }

  // 检查重试次数
  const retryCount = await getRetryCount()
  if (retryCount >= MAX_RETRY_COUNT) {
    log?.(`更新重试次数已达上限 (${MAX_RETRY_COUNT})，跳过本次检查`)
    return { skipped: true, error: '重试次数超限' }
  }

  try {
    // 读取本地版本
    const { value: stored } = await Preferences.get({ key: PREF_KEY })
    const localVersion = stored || embeddedVersion
    log?.(`本地版本：${localVersion}`)

    // 拉取远端 JSON
    log?.('开始获取版本信息...')
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 15000) // 15秒超时
    
    try {
      const res = await fetch(jsonUrl, { 
        cache: 'no-store',
        signal: controller.signal,
        headers: {
          'User-Agent': 'CapacitorUpdater/1.0',
          'Accept': 'application/json'
        }
      })
      clearTimeout(timeoutId)
      
      if (!res.ok) throw new Error(`获取 version.json 失败：HTTP ${res.status}`)
      
      const json = await res.json() as { 
        version: string; 
        updateUrl: string; 
        features?: string[]
      }
      
      const remoteVersion = json.version
      const updateUrl = json.updateUrl

      log?.(`远端版本：${remoteVersion}`)
      log?.(`下载链接：${updateUrl}`)


      if (!remoteVersion || !updateUrl) {
        throw new Error('version.json 缺少必要字段（version/updateUrl）')
      }

      // 版本比较
      if (cmpSemver(remoteVersion, localVersion) <= 0) {
        log?.('已是最新版本或本地版本更高，跳过下载')
        await resetRetryCount() // 重置重试计数
        return { 
          upToDate: true, 
          localVersion, 
          remoteVersion,
        }
      }

      // 下载 zip
      log?.('开始下载更新包...')
      const downloadOptions: any = { 
        url: updateUrl, 
        version: remoteVersion 
      }

      const bundle = await CapacitorUpdater.download(downloadOptions)
      log?.('更新包下载完成')

      // 切包策略
      if (immediate) {
        log?.('准备立即切换到新版本...')
        await CapacitorUpdater.set(bundle)
        await Preferences.set({ key: PREF_KEY, value: remoteVersion })
        await resetRetryCount() // 重置重试计数
        log?.('已立即切换并重载到新版本')
        return { 
          updated: true, 
          immediate: true, 
          remoteVersion,
        }
      } else {
        log?.('标记下次启动使用新版本...')
        await CapacitorUpdater.next(bundle)
        await Preferences.set({ key: PREF_KEY, value: remoteVersion })
        await resetRetryCount() // 重置重试计数
        log?.('已标记下次启动使用新版本')
        return { 
          updated: true, 
          immediate: false, 
          remoteVersion,
        }
      }
    } catch (fetchError) {
      clearTimeout(timeoutId)
      throw fetchError
    }

  } catch (error) {
    const errorMsg = (error as any)?.message || String(error)
    log?.(`更新失败：${errorMsg}`)
    
    if (retryOnFailure && retryCount < MAX_RETRY_COUNT) {
      await setRetryCount(retryCount + 1)
      log?.(`将在下次启动时重试 (${retryCount + 1}/${MAX_RETRY_COUNT})`)
    } else {
      await resetRetryCount()
    }
    
    return { 
      error: errorMsg,
    }
  }
}

// 手动重置更新状态（用于调试或强制重新检查）
export async function resetUpdateState(): Promise<void> {
  await resetRetryCount()
  await Preferences.remove({ key: PREF_KEY })
}

// 获取当前版本信息
export async function getCurrentVersion(embeddedVersion = '1.0.0'): Promise<string> {
  if (!Capacitor.isNativePlatform()) {
    return embeddedVersion
  }
  
  const { value: stored } = await Preferences.get({ key: PREF_KEY })
  return stored || embeddedVersion
}

// —— 用法示例 ——
// 在应用启动后（首屏渲染完成时）调用：
// checkAndUpdate({
//   jsonUrl: 'https://prototype.invalid/arsit-inr/version.json',
//   immediate: true,                 // 立即切换；或 false：下次启动生效
//   embeddedVersion: '1.0.0',        // 你的内置 H5 初始版本
//   enableGPT5Preview: true,         // Enable GPT-5 (Preview) for all clients
//   onLog: console.log,
// })