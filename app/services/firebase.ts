// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDEaPCQvp-tawoMZWGGpFohveIgOFvQrZM", 
  authDomain: "sheetalstudio-9f4a6.firebaseapp.com",
  projectId: "sheetalstudio-9f4a6",
  storageBucket: "sheetalstudio-9f4a6.firebasestorage.app",
  messagingSenderId: "1050846179924",
  appId: "1:1050846179924:web:d3b4928b5a27efc81d73c1",
  measurementId: "G-D958E4C70N"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth };
