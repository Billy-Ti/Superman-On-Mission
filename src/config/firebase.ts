// // Import the functions you need from the SDKs you need
// import { initializeApp } from "firebase/app";
// import { getAuth } from "firebase/auth";
// import { getFirestore } from 'firebase/firestore';
// import { getStorage } from 'firebase/storage';
// // TODO: Add SDKs for Firebase products that you want to use
// // https://firebase.google.com/docs/web/setup#available-libraries

// // Your web app's Firebase configuration
// const firebaseConfig = {
//   apiKey: "AIzaSyAzbiWNnNgXUmKOXtx0Zu0ntTqj0Gs681k",
//   authDomain: "superman-4eb28.firebaseapp.com",
//   projectId: "superman-4eb28",
//   storageBucket: "superman-4eb28.appspot.com",
//   messagingSenderId: "66413123858",
//   appId: "1:66413123858:web:7aafa75d79b49a2089fbcb",
// };

// export { auth, db, storage };
// // Initialize Firebase
// export const app = initializeApp(firebaseConfig);
// const auth = getAuth(app);
// const db = getFirestore(app);
// const storage = getStorage(app);

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

export { auth, database, db, storage, }; // 导出所有服务
