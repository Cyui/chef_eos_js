// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBD_7jFK0rB9_SoXWLZB-ZYaEvESYCVW6Q",
  authDomain: "testing-7e05e.firebaseapp.com",
  projectId: "testing-7e05e",
  storageBucket: "testing-7e05e.firebasestorage.app",
  messagingSenderId: "901078102344",
  appId: "1:901078102344:web:039201717939fce70c037d",
  measurementId: "G-1TLZBXEMMM"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);
