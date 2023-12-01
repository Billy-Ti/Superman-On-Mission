// firebase-messaging-sw.js

// 這些是 Firebase Messaging 依賴的腳本
importScripts('https://www.gstatic.com/firebasejs/10.6.0/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/10.6.0/firebase-messaging.js');

// 初始化 Firebase 應用
firebase.initializeApp({
  apiKey: "AIzaSyAzbiWNnNgXUmKOXtx0Zu0ntTqj0Gs681k",
  authDomain: "superman-4eb28.firebaseapp.com",
  projectId: "superman-4eb28",
  storageBucket: "superman-4eb28.appspot.com",
  messagingSenderId: "66413123858",
  appId: "1:66413123858:web:7aafa75d79b49a2089fbcb",
});

// 獲取 Firebase Messaging 實例
const messaging = firebase.messaging();
// 以下為處理接收消息的代碼
messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);
  // 自定義通知的內容
  const notificationTitle = 'Background Message Title';
  const notificationOptions = {
    body: 'Background Message body.',
    icon: '/firebase-logo.png' // 選擇性：指定一個圖標
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
