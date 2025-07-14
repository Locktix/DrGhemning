import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyClZeyHKL8O6ESy1tqrrJTn4qkvdr2COro",
  authDomain: "ghemning-bc91e.firebaseapp.com",
  projectId: "ghemning-bc91e",
  storageBucket: "ghemning-bc91e.appspot.com",
  messagingSenderId: "538971526472",
  appId: "1:538971526472:web:b6dc5ebd825e6be037cf7d",
  measurementId: "G-6KBDTNF60T"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db }; 