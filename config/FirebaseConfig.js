import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBVoibcf0r7ObOYuPDxxlbk1pUPtb_rBdw",
  authDomain: "reactnativemobile-bf613.firebaseapp.com",
  projectId: "reactnativemobile-bf613",
  storageBucket: "reactnativemobile-bf613.firebasestorage.app",
  messagingSenderId: "709106317825",
  appId: "1:709106317825:web:733eb35519448e85269e00",
  measurementId: "G-1YW63H3GQX",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

// const analytics = getAnalytics(app);
