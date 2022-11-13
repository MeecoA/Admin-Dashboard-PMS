import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  onSnapshot,
  addDoc,
  deleteDoc,
  doc,
  query,
  where,
  orderBy,
  serverTimestamp,
  getDoc,
  updateDoc,
  getDocs,
  setDoc,
  collectionGroup,
  arrayUnion,
  arrayRemove,
  increment,
  limit,
} from "firebase/firestore";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import { getAuth, createUserWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";
//this config connects the backend and frontend
//after this, intall firebase in node.js
const firebaseConfig = {
  apiKey: "AIzaSyBFzmDkFR_ZIi5aSc1ATfXykOcowRTx8oA",
  authDomain: "bulsu---pms.firebaseapp.com",
  projectId: "bulsu---pms",
  storageBucket: "bulsu---pms.appspot.com",
  messagingSenderId: "36091561292",
  appId: "1:36091561292:web:85d41dea4e7c7b80f8fbe9",
};
// const firebaseConfig = {
//   apiKey: "AIzaSyBY3hnXsQuXX_RIJ0VZSWbIYFmOxYe94SQ",
//   authDomain: "sample-capstone-project-ba941.firebaseapp.com",
//   projectId: "sample-capstone-project-ba941",
//   storageBucket: "sample-capstone-project-ba941.appspot.com",
//   messagingSenderId: "619482030443",
//   appId: "1:619482030443:web:f0d4435fed137c16902c2e",
//   measurementId: "G-VNRXHHQSRB",
// };
//for initializing app
initializeApp(firebaseConfig);

// EXPORTS
// init service, Firestore is more concerned in Collections than JSON.
export const database = getFirestore(); //anything we do in our DB, we use this
export const storage = getStorage(); //get the firebase storage
export const auth = getAuth();

//exports
// Firestore
export const doLimit = limit;
export const myGetDownloadUrl = getDownloadURL;
export const myUploadBytes = uploadBytes;
export const myStorageRef = ref;
export const myGetFirestore = getFirestore;
export const myCollection = collection;
export const myOnSnapshot = onSnapshot;
export const myGetDocs = getDocs;
export const myGetDoc = getDoc;
export const myAddDoc = addDoc;
export const myDeleteDoc = deleteDoc;
export const myDoc = doc;
export const myUpdateDoc = updateDoc;
export const doSetDoc = setDoc;
export const doQuery = query;
export const doWhere = where;
export const doOrderBy = orderBy;
export const doArrayUnion = arrayUnion;
export const doArrayRemove = arrayRemove;
export const doIncrement = increment;
export const doAuth = createUserWithEmailAndPassword;
// initializing services
export const db = getFirestore();

//collection reference
export const secColRef = collection(db, "security");
export const accColRef = collection(db, "account-information");
export const announceColRef = collection(db, "announcements");
export const councilColRef = collection(db, "admin-council");
export const napColRef = collection(db, "nonacademic");
// for storage

//queries
const secQuery = query(secColRef, orderBy("createdAt"));
const accQuery = query(accColRef, orderBy("createdAt"));
// const announceQuery = query(announceColRef, orderBy("createdAt"));
// Side bar links

// dashboard scripts
const userCount = document.querySelector("#userCount");

onSnapshot(accQuery, (snapshot) => {
  userCount.textContent = snapshot.size;
});
