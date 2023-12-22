import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database"; // 导入 getDatabase
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAzbiWNnNgXUmKOXtx0Zu0ntTqj0Gs681k",
  authDomain: "superman-4eb28.firebaseapp.com",
  databaseURL:
    "https://superman-4eb28-default-rtdb.asia-southeast1.firebasedatabase.app", // 添加您的 Realtime Database URL
  projectId: "superman-4eb28",
  storageBucket: "superman-4eb28.appspot.com",
  messagingSenderId: "66413123858",
  appId: "1:66413123858:web:7aafa75d79b49a2089fbcb",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const database = getDatabase(app); // 初始化 Realtime Database
const storage = getStorage(app);

export { auth, database, db, storage }; 

// 請求通知權限並獲取令牌
// function requestPermission() {
//   console.log("Requesting permission...");
//   Notification.requestPermission().then((permission) => {
//     if (permission === "granted") {
//       console.log("Notification permission granted.");
//       // 獲取令牌c
//       const messaging = getMessaging();
//       getToken(messaging, {
//         vapidKey:
//           "BBhsTBgNYE93liO54Xp_mGeR-8YrnzOg-RtJtzoCOu8jrH5ULT0rUBnfYtrXBGUOLBjzOEj_a6669L4_8-Tx9PM",
//       })
//         .then((currentToken) => {
//           if (currentToken) {
//             console.log("FCM Token:", currentToken);
//             // 將令牌發送到您的伺服器以進行訂閱
//           } else {
//             console.log(
//               "No registration token available. Request permission to generate one.",
//             );
//           }
//         })
//         .catch((err) => {
//           console.log("An error occurred while retrieving token. ", err);
//         });
//     } else {
//       console.log("Unable to get permission to notify.");
//     }
//   });
// }

// // 調用此函數以開始流程
// requestPermission();
// const messaging = getMessaging(app);
// getToken(messaging, {
//   vapidKey:
//     "BBhsTBgNYE93liO54Xp_mGeR-8YrnzOg-RtJtzoCOu8jrH5ULT0rUBnfYtrXBGUOLBjzOEj_a6669L4_8-Tx9PM",
// });
