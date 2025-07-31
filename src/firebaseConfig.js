// src/firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyDAivpQ__QeE6oRQTtadhbTGE7jsCFjuQI",
  authDomain: "crossfitgames-d9f9b.firebaseapp.com",
  projectId: "crossfitgames-d9f9b",
  storageBucket: "crossfitgames-d9f9b.firebasestorage.app",
  messagingSenderId: "19637690349",
  appId: "1:19637690349:web:0084089258ecc0e1d211e4",
  measurementId: "G-BPDYWYCL73"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

export { db };
