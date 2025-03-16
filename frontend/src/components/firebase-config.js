// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {getAuth} from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDVLi-dSOg5V6RMu9ocEh2a-jpVqAb3gU0",
  authDomain: "iptl-pt4.firebaseapp.com",
  projectId: "iptl-pt4",
  storageBucket: "iptl-pt4.appspot.com",
  messagingSenderId: "712516669615",
  appId: "1:712516669615:web:fc0b51a994003aa317c45a",
  measurementId: "G-W5T81KV5CQ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);