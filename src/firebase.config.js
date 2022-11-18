import firebase from "firebase";

const firebaseConfig = {
  apiKey: "AIzaSyBUHEPezL0h2dP-Nl9Ex6q2C4aHN1LLUNo",
  authDomain: "react-instagram-clone-e565e.firebaseapp.com",
  projectId: "react-instagram-clone-e565e",
  storageBucket: "react-instagram-clone-e565e.appspot.com",
  messagingSenderId: "93119866866",
  appId: "1:93119866866:web:0952f1740df5a04f952d6b"
};

const firebaseApp = firebase.initializeApp(firebaseConfig);
const db = firebaseApp.firestore();
const auth = firebaseApp.auth();
const storage = firebaseApp.storage();

export { db, auth, storage };
