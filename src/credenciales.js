// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore';
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD_bZRDwZ2kv8YcClTUO97cPA_El_5C29k",
  authDomain: "congregacionojls-ce670.firebaseapp.com",
  projectId: "congregacionojls-ce670",
  storageBucket: "congregacionojls-ce670.appspot.com",
  messagingSenderId: "392932822837",
  appId: "1:392932822837:web:172066ab282ce3c7e1867c",
  measurementId: "G-72TTX05SWT"
};

// Initialize Firebase
const appFirebase = initializeApp(firebaseConfig);

export const db = getFirestore(appFirebase);

export default appFirebase;