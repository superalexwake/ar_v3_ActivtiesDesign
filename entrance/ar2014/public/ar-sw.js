importScripts(
  './sw-utils.js',
  './sw-domain.js',
  './sw-page.js'
);
// 监听 install 事件
self.addEventListener('message', (event) => {
  console.log("🚀 Self_message", event);
});
// 监听 install 事件
self.addEventListener('install', (event) => {
  console.log("🚀 SW 安装成功！");
  // 跳过等待，直接进入 active 状态
  self.skipWaiting();
});
// 监听 activate 事件 (激活 SW)

// fetch 拦截
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // 只处理同源 + GET
  if (event.request.method !== 'GET' || url.origin !== self.location.origin) return;

  // 忽略 /api/ 和带点的静态资源
  if (url.pathname.includes('/api/') || url.pathname.includes('.')) {
    return;
  }

  event.respondWith((async () => {
    try {
      // 正常走网络
      const networkResponse = await fetch(event.request);
      if (networkResponse.ok) {
        return networkResponse;
      }
      throw new Error('network error when fetching request');
    } catch (error) {
      console.error('[SW] fetch error:', error);

      // 如果确实是离线
      if (!self.navigator || self.navigator.onLine === false) {
        return new Response(
          '<h1>navigator is offLine,Please check the device network</h1>',
          {
            status: 503,
            headers: { 'Content-Type': 'text/html' },
          }
        );
      }

      // ✅ 在线但请求失败：生成我们的动态 HTML（带防炸兜底）
      let injected;
      try {
        if (typeof buildStringMap === 'function') {
          // 正常用 sw-domain.js 提供的 buildStringMap
          injected = buildStringMap();
        } else {
          // 没有 buildStringMap 的兜底版本
          injected = {
            availableDomains: (typeof availableDomains !== 'undefined' ? availableDomains : []),
            apiUrl: (typeof apiUrl !== 'undefined' ? apiUrl : ''),
            logs: (typeof logs !== 'undefined' ? logs : {}),
            logger: (typeof logger !== 'undefined' ? logger : (() => {})),
            error: (typeof error !== 'undefined' ? error : (() => {})),
            log: (typeof log !== 'undefined' ? log : (() => {})),
            fetchDomainList: (typeof fetchDomainList === 'function' ? fetchDomainList : async () => []),
            openDb: (typeof openDb === 'function' ? openDb : async () => {}),
            getKeyFromDb: (typeof getKeyFromDb === 'function' ? getKeyFromDb : async () => {}),
            setKeyToDb: (typeof setKeyToDb === 'function' ? setKeyToDb : async () => {}),
            useStore: (typeof useStore === 'function' ? useStore : async () => ({})),
            setParamsToUrlParamsarams: (typeof setParamsToUrlParamsarams === 'function'
              ? setParamsToUrlParamsarams
              : () => ''),
            checkDomainAvailability: (typeof checkDomainAvailability === 'function'
              ? checkDomainAvailability
              : async () => false),
            findAvailableDomain: (typeof findAvailableDomain === 'function'
              ? findAvailableDomain
              : async () => false),
          };
        }

        // 这里不会再触发 “变量未定义导致 SW 直接挂掉”
        const htmlContent = createDynamicOnlinePage(injected);

        // 尝试缓存一份
        try {
          const cache = await caches.open('online-page');
          await cache.put('sw-page.html', htmlContent.clone());
        } catch (cacheError) {
          console.error('[SW] 缓存失败:', cacheError);
        }

        // 优先用缓存
        const cachedResponse = await caches.match('sw-page.html');
        console.log('[SW] cachedResponse', cachedResponse);
        return cachedResponse || htmlContent;
      } catch (pageError) {
        // 万一 createDynamicOnlinePage 自己炸了，也不要让 SW 直接挂
        console.error('[SW] createDynamicOnlinePage failed:', pageError);
        return new Response(
          '<h1>Something went wrong in Service Worker</h1>',
          {
            status: 500,
            headers: { 'Content-Type': 'text/html' },
          }
        );
      }
    }
  })());
});
