const DBName = "_astorage"
const tableName = "renkv"

// 打开 IndexedDB 数据库
async function openDb() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(DBName, 2);
        request.onerror = (event) => {
            const error = event.target && 'error' in event.target ? (event.target as IDBRequest).error : undefined;
            reject(error);
        };
        request.onsuccess = (event) => {
            if (!event.target) {
                reject(new Error("IndexedDB onsuccess event.target is null"));
                return;
            }
            const db = (event.target as IDBOpenDBRequest).result;
            const transaction = db.transaction([tableName], "readwrite");
            const store = transaction.objectStore(tableName);
            resolve(store);
        };
        request.onupgradeneeded = (event) => {
            if (!event.target) {
                throw new Error("IndexedDB onupgradeneeded event.target is null");
            }
            const db = (event.target as IDBOpenDBRequest).result;
            if (!db.objectStoreNames.contains(tableName)) {
                db.createObjectStore(tableName);
            }
        };
    });
}

// 批量存储数据到 indexedDB
async function setKeyToDb(id: any, value: any) {
    return new Promise((resolve, reject) => {
        openDb().then((store) => {
            const objectStore = store as IDBObjectStore;
            const putRequest = objectStore.put(value, id);
            putRequest.onsuccess = () => resolve(true);
            putRequest.onerror = (event) => {
                if (event.target) {
                    reject((event.target as IDBRequest).error);
                } else {
                    reject(new Error("putRequest.onerror: event.target is null"));
                }
            };
        });
    });
}

// 从 indexedDB 中获取数据
async function getKeyFromDb(id: any, resolve: { (value: unknown): void; (arg0: any[]): any; }, reject: { (reason?: any): void; (arg0: any): any; }) {
    const store = await openDb();
    const objectStore = store as IDBObjectStore;
    const getRequest = objectStore.get(id);
    getRequest.onsuccess = () => resolve([[id], getRequest.result]);
    getRequest.onerror = (ev: Event) => {
        const error = (ev.target && 'error' in ev.target) ? (ev.target as IDBRequest).error : undefined;
        reject(error);
    };
}

async function clearKeyToDb(id: any) {
    return new Promise((resolve, reject) => {
        openDb().then((store) => {
            const objectStore = store as IDBObjectStore;
            const deleteRequest = objectStore.delete(id);
            deleteRequest.onsuccess = () => resolve(true);
            deleteRequest.onerror = (event) => {
                if (event.target) {
                    reject((event.target as IDBRequest).error);
                } else {
                    reject(new Error("deleteRequest.onerror: event.target is null"));
                }
            };
        }).catch(reject);
    });
}

export const indexdb = {
    openDb,
    setKeyToDb,
    getKeyFromDb,
    clearKeyToDb
}