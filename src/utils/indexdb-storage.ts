/**
 * IndexedDB key-value 封装（`_arstorage:_ionickv` 数据库）。
 *
 * 从旧 `utils/pwa.ts` 原样搬出，**行为零变化**：
 *   - `setKeyToDb(id, value)`   单键写
 *   - `getKeyFromDb(id, ...)`   单键读（resolve/reject 回调式，给 useStore 用）
 *   - `useStore(['a', 'b'])`    批量读，返回 `{ a, b }`（命名跟 Pinia 撞名，新代码请用 readKeysFromDb 别名）
 *
 * 跟 `hooks/useIndexDB.ts` 的 `_astorage:renkv` 是**不同的库**，存的是不同业务数据，
 * 不能合并。本文件给 Login 系列的 'apkInfo' 键等历史业务 key 用。
 * （'appLock' 键属于已删除的 AppLock 功能，IndexedDB 残留数据无主动清理）
 */

// 打开 IndexedDB
async function openDb() {
	return new Promise((resolve, reject) => {
		const request = indexedDB.open('_arstorage', 2)
		request.onerror = (event) => {
			const error = event.target && 'error' in event.target ? (event.target as IDBRequest).error : undefined
			reject(error)
		}
		request.onsuccess = (event) => {
			if (!event.target) {
				reject(new Error('IndexedDB onsuccess event.target is null'))
				return
			}
			const db = (event.target as IDBOpenDBRequest).result
			const transaction = db.transaction(['_ionickv'], 'readwrite')
			const store = transaction.objectStore('_ionickv')
			resolve(store)
		}
		request.onupgradeneeded = (event) => {
			if (!event.target) {
				throw new Error('IndexedDB onupgradeneeded event.target is null')
			}
			const db = (event.target as IDBOpenDBRequest).result
			if (!db.objectStoreNames.contains('_ionickv')) {
				db.createObjectStore('_ionickv')
			}
		}
	})
}

// 单键读（回调式；useStore 内部用）
async function getKeyFromDb(
	id: any,
	resolve: { (value: unknown): void; (arg0: any[]): any },
	reject: { (reason?: any): void; (arg0: any): any },
) {
	const store = await openDb()
	const getRequest = (store as IDBObjectStore).get(id)
	getRequest.onsuccess = () => resolve([[id], getRequest.result])
	getRequest.onerror = (e: { target: { error: any } }) => reject(e.target.error)
}

/**
 * 批量按 key 读 IndexedDB。返回 `{ [key]: value }`。
 *
 * 注意命名：`useStore` 跟 Pinia 的 `useStore` 严重撞名 —— 调用方需要意识到这是 IndexedDB 操作，
 * 不是 Pinia store。未来新代码请用 `readKeysFromDb` 别名（行为相同）。
 */
export async function useStore(list: string[]) {
	const res = await Promise.all(
		list.map(id => new Promise((resolve, reject) => getKeyFromDb(id, resolve, reject))),
	)
	try {
		return Object.fromEntries(res as Array<[string, unknown]>)
	} catch (e) {
		// fallback：上古浏览器没有 Object.fromEntries
		const obj: Record<string, unknown> = {}
		res.forEach(([key, value]: any) => {
			obj[key] = value
		})
		return obj
	}
}

/** `useStore` 的语义化别名，新代码请用这个。 */
export const readKeysFromDb = useStore

/** 单键写。 */
export async function setKeyToDb(id: any, value: any) {
	return new Promise((resolve, reject) => {
		openDb().then((store) => {
			const objectStore = store as IDBObjectStore
			const putRequest = objectStore.put(value, id)
			putRequest.onsuccess = () => resolve(true)
			putRequest.onerror = (event) => {
				if (event.target) {
					reject((event.target as IDBRequest).error)
				} else {
					reject(new Error('putRequest.onerror: event.target is null'))
				}
			}
		})
	})
}
