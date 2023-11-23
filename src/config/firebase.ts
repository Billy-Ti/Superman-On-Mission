// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAzbiWNnNgXUmKOXtx0Zu0ntTqj0Gs681k",
  authDomain: "superman-4eb28.firebaseapp.com",
  projectId: "superman-4eb28",
  storageBucket: "superman-4eb28.appspot.com",
  messagingSenderId: "66413123858",
  appId: "1:66413123858:web:7aafa75d79b49a2089fbcb",
};

export { auth, db, storage };
// Initialize Firebase
export const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);
