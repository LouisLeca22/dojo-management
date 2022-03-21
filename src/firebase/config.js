
import { initializeApp } from "firebase/app";
import {getFirestore} from "firebase/firestore"
import {getAuth} from "firebase/auth"
import {getStorage} from "firebase/storage"

const firebaseConfig = {
  apiKey: "AIzaSyACJzlHFOa4M09MhmJFzM-qvyL3a35TRg4",
  authDomain: "dojo-management.firebaseapp.com",
  projectId: "dojo-management",
  storageBucket: "dojo-management.appspot.com",
  messagingSenderId: "122853381276",
  appId: "1:122853381276:web:767d56f57561643af68959"
};


const app = initializeApp(firebaseConfig);

const db = getFirestore()

const auth = getAuth()

const storage = getStorage()

export {app, db, auth, storage}