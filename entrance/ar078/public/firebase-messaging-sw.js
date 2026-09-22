// public/firebase-messaging-sw.js

importScripts('https://www.gstatic.com/firebasejs/10.8.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.8.1/firebase-messaging-compat.js');

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});
// 初始化 Firebase（确保和主项目配置一致）
firebase.initializeApp({
	apiKey: "",
	authDomain: "",
	projectId: "",
	storageBucket: "",
	messagingSenderId: "",
	appId: "",
	measurementId: ""
});

// 获取 messaging 实例
const messaging = firebase.messaging();

// 监听后台推送通知
messaging.onBackgroundMessage(function(payload) {
	console.log('[firebase-messaging-sw.js] 收到后台消息: ', payload);
	const { title, body, image } = payload.notification;

	self.registration.showNotification(title, {
		body,
		icon: image || '/logo.png', // 可替换为你的图标
	});
});

// 接收前台发来的消息展示通知
self.addEventListener('message', (event) => {
	if (event.data?.type === 'SHOW_NOTIFICATION') {
		const { title, body, image } = event.data.payload
		self.registration.showNotification(title, {
			body,
			image,
			icon: '/logo.png', // 可自定义图标
		})
	}
})