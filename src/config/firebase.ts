import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyAzbiWNnNgXUmKOXtx0Zu0ntTqj0Gs681k",
  authDomain: "superman-4eb28.firebaseapp.com",
  databaseURL:
    "https://superman-4eb28-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "superman-4eb28",
  storageBucket: "superman-4eb28.appspot.com",
  messagingSenderId: "66413123858",
  appId: "1:66413123858:web:7aafa75d79b49a2089fbcb",
};

export const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const database = getDatabase(app);
const storage = getStorage(app);

export { auth, database, db, storage };
