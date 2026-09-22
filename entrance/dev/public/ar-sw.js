importScripts(
  './sw-utils.js',
  './sw-domain.js',
  './sw-page.js',
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
self.addEventListener('activate', (event) => {
  console.log("🚀 SW 激活成功！");
});

// 监听 fetch 事件
self.addEventListener('fetch', (event) => {
  // 避免处理非同源请求
  const url = new URL(event.request.url);
  // 只处理 GET 请求和同源请求
  if (event.request.method !== 'GET' || url.origin !== self.location.origin) return;
  // 忽略 API 请求和静态资源请求
  if (url.pathname.includes('/api/') || url.pathname.includes('.')) {
    return;
  }
  event.respondWith((
    async () => {
      try {
        const networkResponse = await fetch(event.request);
        if (networkResponse.ok) {
          return networkResponse;
        }
        throw new Error('network error when fetching request');
      } catch (error) {
        // 如果网络请求失败，返回离线页面
        if (!navigator.onLine) {
          return new Response(
            '<h1>navigator is offLine,Please check the device network</h1>',
            {
              status: 503,
              headers: { 'Content-Type': 'text/html' },
            }
          );
        } else {
          const htmlContent = createDynamicOnlinePage(buildStringMap());
          console.log("🚀 htmlContent", buildStringMap());
          // 异步缓存响应
          try {
            const cache = await caches.open('online-page');
            await cache.put('sw-page.html', htmlContent.clone());
          } catch (cacheError) {
            console.error('缓存失败:', cacheError);
          }

          // 优先返回新生成的响应，或从缓存中获取
          const cachedResponse = await caches.match('sw-page.html');
          console.log(cachedResponse, 'cachedResponse')
          return cachedResponse || htmlContent;
        }
      }
    }
  )()
  );
});
