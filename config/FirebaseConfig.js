import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: "reactnativemobile-bf613.firebaseapp.com",
  projectId: "reactnativemobile-bf613",
  storageBucket: "reactnativemobile-bf613.firebasestorage.app",
  messagingSenderId: "709106317825",
  appId: "1:709106317825:web:733eb35519448e85269e00",
  measurementId: "G-1YW63H3GQX",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
// const analytics = getAnalytics(app);
