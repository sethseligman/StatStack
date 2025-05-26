// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
import { getFirestore } from 'firebase/firestore';

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyA3gg8PRTXqrIVb7NDa0vLPCeHfRkPJEbY",
  authDomain: "statstack-lite.firebaseapp.com",
  projectId: "statstack-lite",
  storageBucket: "statstack-lite.firebasestorage.app",
  messagingSenderId: "253492573141",
  appId: "1:253492573141:web:4b0dfcbfc952340c89435c",
  measurementId: "G-GPQZ5PWXB2"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);
export const db = getFirestore(app); 