import { useToast } from "../../hooks/useToast.hook";

export type BridgeInfoType = {
  invitationCode?: string;
  [key: string]: any;
};

export type ColorType =
  | `#${number}`
  | `rgb(${number}, ${number}, ${number})`
  | `rgba(${number}, ${number}, ${number}, ${number})`;


export const SCHEME = 'arappscheme://open';        // 你的自定义 scheme（无下划线）
const MAGIC = '#arapp#';                   // 自定义“标记”前缀，便于 App 定位
const log = console.log;


const { text } = useToast();

let bridgeInfo: BridgeInfoType = {};
export function getDataFromBridge() {
  if ((window as any)?.NativeBridge?.getInfoString) {
    bridgeInfo = JSON.parse(
      (window as any)?.NativeBridge.getInfoString() || "{}"
    );
  }
  return bridgeInfo;
}
/**
 * 获取埋点信息
 * @returns {Array} 埋点信息
 */
export function getEventList(): Array<any> {
  return (
    JSON.parse(bridgeInfo?.eventList || getDataFromBridge()?.eventList || '[]') || []
  );
}
/**
 * 获取邀请码
 * @returns {string} 邀请码
 */
export function getInvitationCode(): string {
  return (
    bridgeInfo?.invitationCode || getDataFromBridge()?.invitationCode || ""
  );
}
/**
 * 获取包名
 * @returns {string} 包名
 */
export function getPackId(): string {
  return (
    bridgeInfo?.appId || getDataFromBridge()?.appId || ""
  );
}

/**
 * 获取设备ID
 * @returns {string} 设备ID
 */
export function getDeviceId(): string {
  return (
    bridgeInfo?.deviceId || getDataFromBridge()?.deviceId || ""
  );
}
/**
 * 获取tenanId(租户ID)
 * @returns {string} 租户ID
 */
export function getTenantId(): string {
  return (
    bridgeInfo?.tenantId || getDataFromBridge()?.tenantId || ""
  );
}

/**
 * 获取tenanId(域名地址)
 * @returns {string} 域名地址
 */
export function getDomainUrl(): string {
  return (
    bridgeInfo?.domainUrl || getDataFromBridge()?.domainUrl || ""
  );
}

export function getVersions(): string {
  return (
    bridgeInfo?.versionName || getDataFromBridge()?.versionName || ""
  );
}


/**
 * 原生是否配置了启动图
 * @returns {boolean} 是否配置了启动图
 */
export function isLauncher(): boolean {
  return !!(
    bridgeInfo?.launcher || getDataFromBridge()?.launcher || ""
  );
}

/**
 * 判断是否为安卓设备的套壳、原生包
 * @returns {boolean} 是否为安卓设备
 */
export function isAndroid(): boolean {
  return (
    (bridgeInfo?.type || getDataFromBridge()?.type) === 'android' || false
  );
}


/**
 * 是否为native完整版apk
 * @returns {boolean} 是否为native完整版apk
 */
export function isFullapk(): boolean {
  const apkType = bridgeInfo?.apkType || getDataFromBridge()?.apkType || "";
  if (!apkType) return false;
  return apkType === "full_apk"
}

/**
 * 是否为native套壳版apk
 * @returns {boolean} 是否为native套壳版apk
 */
export function isEmbeddedApk(): boolean {
  const apkType = bridgeInfo?.apkType || getDataFromBridge()?.apkType || "";
  if (!apkType) return false;
  return apkType === "quick_apk"
}

/**
 * 使用套壳包打开新的页面
 * @param params {Object} 打开页面所需参数
 * @param params.url {string} 页面URL
 * @param params.backgroundColor {ColorType} 背景色
 * @param params.fontColor {ColorType} 字体色
 * @param params.title {string} 页面标题
 * @param params.returnType {1 | 2} 返回类型
 */
export function openExternalPage(params: {
  url: string;
  backgroundColor?: ColorType;
  fontColor?: ColorType;
  title?: string;
  returnType: 1 | 2;
}) {
  if ((window as any)?.NativeBridge?.openExternalPage) {
    if (!params) {
      text("Please provide valid parameters.");
      return;
    }
    if (!params.url) {
      text("Please provide a valid URL.");
      return;
    }
    if (!params.returnType) {
      text("Please provide a valid return type.");
      return;
    }

    (window as any)?.NativeBridge.openExternalPage(
      typeof params === "string" ? params : JSON.stringify(params)
    );
  }
}

/**
 * 使用套壳包打开外部链接
 * @param params {string} 页面URL
 */

export function openExternalUrl(params: string) {
  if ((window as any)?.NativeBridge?.openExternalUrl) {
    if (!params || !/^[a-zA-Z]+:\/\//.test(params)) {
      text("Please provide a valid URL.");
      return;
    }

    (window as any)?.NativeBridge.openExternalUrl(params);
  } else {
    window.open(params, "_blank");
  }
}

export function launchApp() {
  window.location.href = SCHEME
}

export async function copyForApp(data: any) {
  // 统一转成紧凑的、可逆的字符串（Base64 + 前缀）
  const payload = {
    type: 'myapp_share',
    ts: Date.now(),
    data, // 这里塞你要分享的对象/字符串
  };
  const json = JSON.stringify(payload);
  const b64 = btoa(unescape(encodeURIComponent(json))); // UTF-8→Base64
  const text = MAGIC + b64;
  try {
    await navigator.clipboard.writeText(text);
  } catch (e) {
    const ta = document.createElement('textarea');
    ta.value = text;
    document.body.appendChild(ta);
    ta.select();
    document.execCommand('copy');
    document.body.removeChild(ta);
  }
  log('Copied to clipboard:' + text);
  return true;
}

/**
 * 读取剪贴板内容
 * @returns {Object} 剪贴板内容
 * @returns {boolean} ok 是否读取成功
 * @returns {string} reason 失败原因
 * @returns {any} data 读取到的内容
 */

type ClipboardPayload = {
  ok: boolean;
  reason?: string;
  data?: any;
};

export function readClipboardPayload(): ClipboardPayload {
  if ((window as any)?.NativeBridge?.readClipboardPayload) {
    let payload = (window as any)?.NativeBridge.readClipboardPayload();
    try {
      payload = JSON.parse(payload);
      localStorage.setItem('relateUser', payload.data?.data);
      log('Parsed clipboard payload:', payload);
      return payload;
    } catch (error) {
      log("Failed to parse clipboard payload:", error);
      return { "ok": false, "reason": "Maybe JSON parse error" }
    }
  }

  return { "ok": false, "reason": "NativeBridge not found" }
}

/**
 * 拉起app消息通知授权
 * @function requestNotifyPermission
 * @returns {void}
 */

export function requestNotifyPermission(): void {
  if ((window as any)?.TomNativeBridge?.requestPostNotificationPermissionIfNeeded) {
    (window as any)?.TomNativeBridge.requestPostNotificationPermissionIfNeeded();
  }
}



export function hasPermi(): boolean {
  if ((window as any)?.TomNativeBridge?.hasNotificationPermission) {
    return (window as any)?.TomNativeBridge.hasNotificationPermission();
  }
  return false;
}





/**
 * 读取剪贴板内容，不加密解密 
 * @function readClipboardPayloadNoEncode
 * @returns {Object} 剪贴板内容
 * @returns {boolean} ok 是否读取成功
 * @returns {string} reason 失败原因
 * @returns {any} data 读取到的内容
 */

export function readClipboardPayloadNoEncode(): ClipboardPayload {
  if ((window as any)?.NativeBridge?.readClipboardPayloadNoEncode) {
    let payload = (window as any)?.NativeBridge.readClipboardPayloadNoEncode();
    try {
      payload = JSON.parse(payload);
      localStorage.setItem('relateUser', payload.data?.data);
      log('Parsed clipboard payload:', payload);
      return payload;
    } catch (error) {
      log("Failed to parse clipboard payload:", error);
      return { "ok": false, "reason": "Maybe JSON parse error" }
    }
  }

  return { "ok": false, "reason": "NativeBridge not found" }
}