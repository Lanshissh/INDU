// firebaseConfig.js
const { initializeApp } = require("firebase/app");
const { getFirestore } = require("firebase/firestore");
const { getStorage } = require("firebase/storage");
const { getAuth} = require("firebase/auth"); // Import Firebase Auth

const firebaseConfig = {
  apiKey: "AIzaSyAJRziBrAGCUcBXT6pewF5ZlU3Sk8j1oRI",
  authDomain: "dry-run-9a768.firebaseapp.com",
  projectId: "dry-run-9a768",
  storageBucket: "dry-run-9a768.appspot.com",
  messagingSenderId: "1075534475775",
  appId: "1:1075534475775:web:51b61ac6b7a44186da77ca",
  measurementId: "G-TQJB1W7MN9"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);
const auth = getAuth(app); // Initialize Firebase Auth

module.exports = {
  db,
  storage,
  auth // Export the auth object
};
