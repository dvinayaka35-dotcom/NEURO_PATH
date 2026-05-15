import { initializeApp } from "firebase/app";
import { getAuth, RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";

// Your web app's Firebase configuration
// Replace these with your project's actual config from Firebase Console
const firebaseConfig = {
  apiKey: "AIzaSyDYU_rmn3HJmuB7LmnUcfBS7D-jCNBV1S4",
  authDomain: "myproject-930f9.firebaseapp.com",
  projectId: "myproject-930f9",
  storageBucket: "myproject-930f9.firebasestorage.app",
  messagingSenderId: "399583070848",
  appId: "1:399583070848:web:88b25451f28fc978ed3465"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth, RecaptchaVerifier, signInWithPhoneNumber };
