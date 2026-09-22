// indexedDB-worker.js  (可直接 importScripts 引入)

class IDBHelper {
    constructor(dbName, version, storeName) {
        this.dbName = dbName;
        this.version = version;
        this.storeName = storeName;
        this.dbPromise = null;
    }

    // 打开 DB（返回 db 实例，不返回事务）
    openDb() {
        if (this.dbPromise) return this.dbPromise;

        this.dbPromise = new Promise((resolve, reject) => {
            const request = indexedDB.open(this.dbName, this.version);

            request.onerror = (event) => reject(event.target.error);

            request.onupgradeneeded = (event) => {
                const db = event.target.result;
                if (!db.objectStoreNames.contains(this.storeName)) {
                    db.createObjectStore(this.storeName);
                }
            };

            request.onsuccess = (event) => resolve(event.target.result);
        });

        return this.dbPromise;
    }

    // 通用执行器：自动创建事务、进行操作
    async run(mode, callback) {
        const db = await this.openDb();

        return new Promise((resolve, reject) => {
            const tx = db.transaction([this.storeName], mode);
            const store = tx.objectStore(this.storeName);

            const request = callback(store);

            request.onsuccess = () => resolve(request.result);
            request.onerror = (e) => reject(e.target.error);

            // 事务错误
            tx.onabort = (e) => reject(tx.error || e.target.error);
        });
    }

    // 设置
    set(key, value) {
        return this.run("readwrite", (store) => store.put(value, key));
    }

    // 获取一个 key
    get(key) {
        return this.run("readonly", (store) => store.get(key));
    }

    // 删除
    delete(key) {
        return this.run("readwrite", (store) => store.delete(key));
    }

    // 清空表
    clear() {
        return this.run("readwrite", (store) => store.clear());
    }

    // 获取全部 key-value
    getAll() {
        return this.run("readonly", (store) => store.getAll());
    }
}

// 导出到 worker 全局
self.IDBHelper = IDBHelper;
self.dbHelper = new IDBHelper('ar-sw-db', 1, 'keyval-store');