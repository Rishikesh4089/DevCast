// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBHc-cObFz9b8IvViJkyl8zR0IW3q_ZoDk",
  authDomain: "devcast-91632.firebaseapp.com",
  projectId: "devcast-91632",
  storageBucket: "devcast-91632.firebasestorage.app",
  messagingSenderId: "950829371218",
  appId: "1:950829371218:web:5c9da2825cc87d91b7b48b",
  measurementId: "G-BRBM1HX1DG"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);