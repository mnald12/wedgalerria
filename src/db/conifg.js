// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "@firebase/firestore";
import { getStorage } from "@firebase/storage";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional

const firebaseConfig = {
  apiKey: "AIzaSyD5kL5L14xly65JQWaNj8JeGEKikrMF504",
  authDomain: "bgiadmin.firebaseapp.com",
  projectId: "bgiadmin",
  storageBucket: "bgiadmin.appspot.com",
  messagingSenderId: "355262102436",
  appId: "1:355262102436:web:73faa70013f59c5a8f5f31",
  measurementId: "G-3K2PWV8779",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);
const db = getFirestore(app);

export { db, storage };
