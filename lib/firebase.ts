import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDydyC8b8-tNQnZuFwqYpQ7oNuBzvXWzqQ",
  authDomain: "agis-protocol.firebaseapp.com",
  projectId: "agis-protocol",
  storageBucket: "agis-protocol.firebasestorage.app",
  messagingSenderId: "265683493278",
  appId: "1:265683493278:web:44d7626daf7404e0cbb68f"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
