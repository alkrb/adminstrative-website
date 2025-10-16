// تهيئة Firebase
const firebaseConfig = {
   apiKey: "AIzaSyCctRA8GcMlYNvk6nBE1YXeYruQwkawcHA",
  authDomain: "daily-tasks-a69ab.firebaseapp.com",
  databaseURL: "https://daily-tasks-a69ab-default-rtdb.firebaseio.com",
  projectId: "daily-tasks-a69ab",
  storageBucket: "daily-tasks-a69ab.firebasestorage.app",
  messagingSenderId: "799210899623",
  appId: "1:799210899623:web:2cc09163c30bdd1db4b382",
  measurementId: "G-0B95KRGK2S"
};

// تهيئة Firebase
firebase.initializeApp(firebaseConfig);

// تهيئة خدمات Firebase
const db = firebase.firestore();
const auth = firebase.auth();