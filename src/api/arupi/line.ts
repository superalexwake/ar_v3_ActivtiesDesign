/**
 * arupi 收银台 API 线路管理:测速选优 + 故障切换 + 兜底(单例)。
 * - 主站 GetHomeSettings 后 measure() 记录候选并选优;
 * - 进入充值页 remeasure() 预热重测(带冷却);
 * - arupi axios 读 active / rotate() 切换,共享同一队列。
 */
import { useStorage } from '@/hooks'

const { localStore } = useStorage()

class ArbApiLine {
	private readonly KEY = 'arb_api_queue' // 当前可用队列(按 RTT 升序,rotate 消耗)
	private readonly SRC = 'arb_api_src' // 原始候选全集(rotate 不影响,供重测)
	private readonly TS = 'arb_api_ts' // 上次测速时间戳
	private readonly COOLDOWN = 30_000 // 重测冷却:30s 内不重复探测
	private readonly PROBE_TIMEOUT = 3000
	private readonly fallback = import.meta.env.VITE_BAST_URL

	private get queue(): string[] {
		return localStore.get<string[]>(this.KEY) || []
	}
	private set queue(list: string[]) {
		localStore.set(this.KEY, list)
	}

	/** 当前应使用的 baseURL:队首 → 兜底固定地址。永远有值。 */
	get active(): string {
		return this.queue[0] || this.fallback
	}

	/** 首次测速:记录候选全集并选优(主站 GetHomeSettings 后调用)。 */
	async measure(raw: unknown): Promise<void> {
		const list = this.normalize(raw)
		if (!list.length) return
		localStore.set(this.SRC, list)
		await this.run(list)
	}

	/** 重新测速:对已记录的候选全集重选优(进入充值页预热);冷却期内跳过。 */
	async remeasure(): Promise<void> {
		const last = localStore.get<number>(this.TS) || 0
		if (Date.now() - last < this.COOLDOWN) return
		const list = localStore.get<string[]>(this.SRC) || []
		if (list.length) await this.run(list)
	}

	/** 故障切换:丢弃失败的队首,切下一个;无备选返回 false。 */
	rotate(): boolean {
		const q = this.queue
		if (!q.length) return false
		q.shift()
		this.queue = q
		return q.length > 0
	}

	// 并发测速 → 按 RTT 升序重建队列;全部失败则保留原队列(留兜底)
	private async run(list: string[]): Promise<void> {
		localStore.set(this.TS, Date.now()) // 先占时间戳,挡住测速进行中的重复触发
		const settled = await Promise.allSettled(list.map((u) => this.probe(u)))
		const ok = settled
			.filter((r): r is PromiseFulfilledResult<{ url: string; rtt: number }> => r.status === 'fulfilled')
			.map((r) => r.value)
			.sort((a, b) => a.rtt - b.rtt)
			.map((x) => x.url)
		if (ok.length) this.queue = ok
	}

	// 兼容后端返回 string[] 或 [{url,...}]
	private normalize(raw: unknown): string[] {
		return (Array.isArray(raw) ? raw : [])
			.map((x) => (typeof x === 'string' ? x : (x as any)?.url))
			.filter((x): x is string => typeof x === 'string' && x.length > 0)
	}

	// no-cors 连通性探测:只测 RTT,不校验业务成功(测速时 ar_p_t 尚未就绪)
	private probe(url: string): Promise<{ url: string; rtt: number }> {
		return new Promise((resolve, reject) => {
			const start = performance.now()
			const ctrl = new AbortController()
			const timer = setTimeout(() => {
				ctrl.abort()
				reject(new Error('timeout'))
			}, this.PROBE_TIMEOUT)
			// 打根路径;若后端有专用 /ping,改这一行即可
			fetch(url, { mode: 'no-cors', cache: 'no-store', signal: ctrl.signal })
				.then(() => {
					clearTimeout(timer)
					resolve({ url, rtt: performance.now() - start })
				})
				.catch((e) => {
					clearTimeout(timer)
					reject(e)
				})
		})
	}
}

/** 全局唯一线路管理器 */
export const arbApiLine = new ArbApiLine()
