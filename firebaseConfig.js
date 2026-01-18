// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCWS3EF0RjKwuChLHveqh6gtPIP8pSdPXQ",
  authDomain: "vansa-nepal.firebaseapp.com",
  projectId: "vansa-nepal",
  storageBucket: "vansa-nepal.firebasestorage.app",
  messagingSenderId: "473724967542",
  appId: "1:473724967542:web:a6804463529c8d97aedd57",
  measurementId: "G-L7BHBDW3QK",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app); // Removed for React Native compatibility
export const auth = getAuth(app);
export const db = getFirestore(app);
