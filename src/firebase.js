import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyDpeePBNSq5Y4FuFD-tpQ5LADcB3mfNDjQ",
  authDomain: "rifa-beneficiente-76246.firebaseapp.com",
  projectId: "rifa-beneficiente-76246",
  storageBucket: "rifa-beneficiente-76246.firebasestorage.app",
  messagingSenderId: "1076993391579",
  appId: "1:1076993391579:web:d475a8e7de7a1710f7c5fe",
  measurementId: "G-FRSWGN2WME"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);