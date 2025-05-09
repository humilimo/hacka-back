// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: "hacka-recolhe.firebaseapp.com",
  projectId: "hacka-recolhe",
  storageBucket: "hacka-recolhe.firebasestorage.app",
  messagingSenderId: "963490559333",
  appId: "1:963490559333:web:5d9ea618c6bc73e11add8c",
  measurementId: "G-EY3EQ45420"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);