class TimeSynchronizer {
	private serviceTime:number|null = null; // 记录服务端返回的标准时间
	private lastSyncTime:number; // 记录上次同步的标准时间
	constructor() {
		this.serviceTime = null; // 记录服务端返回的标准时间
		this.lastSyncTime = 0; // 记录上次同步的标准时间
	}

	/**
	 * 获取当前标准时间（基于本地时间和上次同步的时间）
	 * @returns {number} 校准后的标准时间（时间戳）
	 */
	getCurrentTime() {
		if (this.serviceTime === null  || this.lastSyncTime === 0) {
			// 如果没有足够的数据进行校准，直接返回当前本地时间
			return Date.now();
		}
		// 获取当前本地时间
		const currentLocalTime = Date.now();

		// 计算校准后的标准时间
		const timeDifference = currentLocalTime - this.lastSyncTime;
		return  this.serviceTime + timeDifference;
	}

	/**
	 * 更新标准时间和本地时间
	 * @param {number} serviceTime 服务端返回的标准时间
	 */
	syncTime(serviceTime:number) {
		// 如果第一次同步，直接设置服务端返回的时间
		this.serviceTime=serviceTime;
		this.lastSyncTime=Date.now();
	}
}

export const synchronizer = new TimeSynchronizer();

