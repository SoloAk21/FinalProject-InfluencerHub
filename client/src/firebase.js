// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

import { getDatabase } from "firebase/database";
import { getStorage } from "firebase/storage";
// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "influencer-hub-e6b6d.firebaseapp.com",
  projectId: "influencer-hub-e6b6d",
  storageBucket: "influencer-hub-e6b6d.appspot.com",
  messagingSenderId: "530442267361",
  appId: "1:530442267361:web:a9754549539bc09bb025a0",
};
// Initialize Firebase
export const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const storage = getStorage();
export const db = getDatabase(app);
