/* firebase-messaging-sw.js */

importScripts('https://www.gstatic.com/firebasejs/10.8.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.8.1/firebase-messaging-compat.js');

/* ------------------------------
 * 🧩 生命周期：install / activate
 * ------------------------------ */
self.addEventListener('install', (event) => {
  // 立即进入 waiting -> activate
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    // 让新 SW 立即接管页面
    await self.clients.claim();

    // 🔥 关键：activate 预热（强制读取 IDB + 初始化 Firebase）
    try {
      await ensureFirebaseReady();
    } catch (e) {
      // 不要 throw，activate 仍然要完成；后续 push 还能重试
    }
  })());
});

/* ------------------------------
 * 🧭 事件映射表
 * ------------------------------ */
const eventNameMap = {
  notification_receive: 'NOTIFICATION_RECEIVE',
  notification_display: 'NOTIFICATION_DISPLAY',
  notification_click: 'NOTIFICATION_CLICK',
  notification_dismiss: 'NOTIFICATION_DISMISS',
  notification_open: 'NOTIFICATION_OPEN',
  notification_engagement: 'NOTIFICATION_ENGAGEMENT',
};

/* ------------------------------
 * 🔌 Firebase 初始化单例
 * ------------------------------ */
let messaging = null;
let isFirebaseInitialized = false;
let firebaseConfigCache = null;
let firebaseInitPromise = null;

// 去重缓存：避免 push 兜底 + firebase onBackgroundMessage 双弹
const seen = new Map(); // id -> timestamp
function isDuplicate(id, ttlMs = 60_000) {
  if (!id) return false;
  const now = Date.now();
  for (const [k, t] of seen) {
    if (now - t > ttlMs) seen.delete(k);
  }
  if (seen.has(id)) return true;
  seen.set(id, now);
  return false;
}

async function ensureFirebaseReady() {
  if (isFirebaseInitialized) return true;

  if (!firebaseInitPromise) {
    firebaseInitPromise = (async () => {
      await initFirebase(); // 失败必须 throw
      return true;
    })().catch((e) => {
      // 失败允许重试
      firebaseInitPromise = null;
      throw e;
    });
  }
  return firebaseInitPromise;
}

/* ------------------------------
 * 🗄️ IndexedDB 读取 Firebase Config
 * ------------------------------ */
async function getFBFromIndexedDB() {
  // 你当前的配置
  const DB_NAME = '_astorage';
  const DB_VERSION = 2;
  const STORE_NAME = 'renkv';
  const KEY = 'firebaseConfig';

  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' });
      }
    };

    request.onsuccess = (event) => {
      const db = event.target.result;

      db.onversionchange = () => {
        db.close();
      };

      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.close();
        return reject(new Error(`[IndexedDB] object store "${STORE_NAME}" not found`));
      }

      // ✅ 只读事务
      const tx = db.transaction([STORE_NAME], 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const getReq = store.get(KEY);

      getReq.onsuccess = () => {
        try {
          const raw = getReq.result;
          // 兼容两种常见存法：
          // 1) 直接存 config 对象/字符串
          // 2) 存 { id: 'firebaseConfig', value: '...' / {...} }
          const val = raw?.value ?? raw;
          const cfg = val
            ? (typeof val === 'string' ? JSON.parse(val) : val)
            : null;

          resolve(cfg);
        } catch (e) {
          reject(e);
        } finally {
          db.close();
        }
      };

      getReq.onerror = () => {
        const err = getReq.error || new Error('[IndexedDB] get failed');
        db.close();
        reject(err);
      };

      tx.onerror = (e) => {
        db.close();
        reject(e?.target?.error || e);
      };
    };

    request.onerror = (event) => {
      reject(event?.target?.error || new Error('[IndexedDB] open failed'));
    };
  });
}

/* ------------------------------
 * 🚀 Firebase 初始化
 * ------------------------------ */
async function initFirebase() {
  if (isFirebaseInitialized) return;

  let config = firebaseConfigCache;
  if (!config) {
    // 1) 优先全局注入（如构建时替换）
    if (typeof _FIREBASE_CONFIG_ !== 'undefined' && _FIREBASE_CONFIG_) {
      config = _FIREBASE_CONFIG_;
    } else {
      // 2) 再从 IndexedDB 读
      config = await getFBFromIndexedDB();
    }
  }

  if (!config || !config.messagingSenderId) {
    throw new Error('[SW] Firebase config missing or invalid');
  }

  // ✅ 避免重复 initializeApp
  if (!firebase.apps || !firebase.apps.length) {
    firebase.initializeApp(config);
  }

  firebaseConfigCache = config;

  messaging = firebase.messaging();
  // ✅ 绑定后台回调（FCM 会在合适时机触发）
  messaging.onBackgroundMessage(async (payload) => {
    try {
      await receiveBackgroundMessage(payload);
    } catch (e) {
    }
  });

  isFirebaseInitialized = true;
}

/* ------------------------------
 * 🧷 与页面通信
 * ------------------------------ */
async function sendToClients(type, data, options = {}) {
  const {
    sameOriginOnly = true,
  } = options;

  try {
    const clients = await self.clients.matchAll({ type: 'window', includeUncontrolled: true });
    for (const client of clients) {
      if (sameOriginOnly && !client.url.includes(self.location.origin)) continue;
      client.postMessage({ type, data });
    }
  } catch (e) {
  }
  return true;
}

/* ------------------------------
 * 📨 统一的通知展示逻辑
 * ------------------------------ */
async function receiveBackgroundMessage(payload) {
  // 兼容 payload 结构：notification / data
  const data = payload?.data || payload?.notification?.data || {};
  const notification = payload?.notification || payload?.data || {};

  const title = notification.title || data.title || 'Notify';
  const body = notification.body || data.body || '';
  const image = notification.image || data.image || '/logo.png';

  const messageId = data.messageId || payload?.messageId || data?.mid;
  if (isDuplicate(messageId)) {
    return;
  }

  // 1) 接收埋点
  await sendToClients(eventNameMap.notification_receive, data);

  // 2) 展示通知
  await self.registration.showNotification(title, {
    body,
    image,
    icon: image,
    data,
    tag: messageId || Date.now().toString(),
  });

  // 3) 展示埋点
  await sendToClients(eventNameMap.notification_display, data);
}

/* ------------------------------
 * 🔥 push 事件兜底（冷启动保险）
 * ------------------------------ */
self.addEventListener('push', (event) => {
  event.waitUntil((async () => {
    try {
      await ensureFirebaseReady();

      // 兜底：某些情况下 Firebase handler 不触发（或 payload 不是标准 FCM 格式）
      // 尝试解析 event.data 并触发统一通知逻辑
      if (event.data) {
        let payload = null;
        try {
          payload = event.data.json();
        } catch {
          const text = event.data.text();
          payload = { data: { body: text } };
        }
        // 只在 payload 看起来像通知时兜底显示，避免无意义弹窗
        const looksLikeNotification =
          payload?.notification ||
          payload?.data?.title ||
          payload?.data?.body ||
          payload?.data?.messageId;

        if (looksLikeNotification) {
          await receiveBackgroundMessage(payload);
        }
      }
    } catch (e) {
      // 不 throw，避免浏览器将其视为未处理
    }
  })());
});

/* ------------------------------
 * 📤 前台请求展示通知（页面 postMessage）
 * ------------------------------ */
self.addEventListener('message', (event) => {
  if (event.data?.type !== 'SHOW_NOTIFICATION') return;

  event.waitUntil((async () => {
    try {
      const payload = event.data.payload || {};
      await receiveBackgroundMessage({ data: payload, notification: payload });
    } catch (e) {
    }
  })());
});

/* ------------------------------
 * ❌ 通知关闭
 * ------------------------------ */
self.addEventListener('notificationclose', (event) => {
  event.waitUntil(sendToClients(eventNameMap.notification_dismiss, event.notification?.data));
});

/* ------------------------------
 * ✅ 通知点击：聚焦或打开窗口 + 埋点
 * ------------------------------ */
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const messageData = event.notification?.data || {};

  event.waitUntil((async () => {
    // click 埋点
    await sendToClients(eventNameMap.notification_click, messageData);

    const clients = await self.clients.matchAll({ type: 'window', includeUncontrolled: true });

    // 优先聚焦已有页面（同源）
    for (const client of clients) {
      if (!client.url.includes(self.location.origin)) continue;
      if ('focus' in client) {
        await client.focus();
        // 通知页面 open 事件
        await sendToClients(eventNameMap.notification_open, messageData);
        return;
      }
    }

    // 没有页面则新开
    if (self.clients.openWindow) {
      const url = new URL(self.location.origin);
      if (messageData && typeof messageData === 'object') {
        Object.entries(messageData).forEach(([k, v]) => {
          if (v !== undefined && v !== null) url.searchParams.set(k, String(v));
        });
      }
      url.searchParams.set('fromNotification', 'true');
      await self.clients.openWindow(url.toString());
    }

    await sendToClients(eventNameMap.notification_open, messageData);
  })());
});