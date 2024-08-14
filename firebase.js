// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {
  getDownloadURL,
  getStorage, 
  ref,
  uploadBytesResumable,
} from "firebase/storage";
const firebaseStroageURL="gs://pingpost-ad5bb.appspot.com"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDudsiHN-SNmmXJqcsufmbAI2wYvCDO1CA",
  authDomain: "pingpost-ad5bb.firebaseapp.com",
  projectId: "pingpost-ad5bb",
  storageBucket: "pingpost-ad5bb.appspot.com",
  messagingSenderId: "282626467414",
  appId: "1:282626467414:web:9e27d616bf661c6881fdf7",
  measurementId: "G-L0XZ8RG65S"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const storage=getStorage(app,firebaseStroageURL);

