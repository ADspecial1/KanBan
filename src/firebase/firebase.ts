// // // Import the functions you need from the SDKs you need
// // import { initializeApp } from "firebase/app";
// // import {getAuth} from "firebase/auth";
// // import { getFirestore } from "firebase/firestore";

// // // TODO: Add SDKs for Firebase products that you want to use
// // // https://firebase.google.com/docs/web/setup#available-libraries

// // // Your web app's Firebase configuration
// // const firebaseConfig = {
// //   apiKey: "AIzaSyDBlz0BgJiDQKiONs7eBwrd0--P-J1y1q0",
// //   authDomain: "crmkanban-49b2d.firebaseapp.com",
// //   projectId: "crmkanban-49b2d",
// //   storageBucket: "crmkanban-49b2d.firebasestorage.app",
// //   messagingSenderId: "796027800374",
// //   appId: "1:796027800374:web:3ff577bcd3f80ec25f8197"
// // };

// // // Initialize Firebase
// // const app = initializeApp(firebaseConfig);
// // export const auth = getAuth(app);
// // export const db = getFirestore(app);

// import { initializeApp } from "firebase/app";
// import { getAuth } from "firebase/auth";
// import { getFirestore, collection, getDocs } from "firebase/firestore";

// // Firebase Config
// const firebaseConfig = {
//   apiKey: "AIzaSyDBlz0BgJiDQKiONs7eBwrd0--P-J1y1q0",
//   authDomain: "crmkanban-49b2d.firebaseapp.com",
//   projectId: "crmkanban-49b2d",
//   storageBucket: "crmkanban-49b2d.firebasestorage.app",
//   messagingSenderId: "796027800374",
//   appId: "1:796027800374:web:3ff577bcd3f80ec25f8197",
// };

// const app = initializeApp(firebaseConfig);
// export const auth = getAuth(app);
// export const db = getFirestore(app);

// export const getSalesPipeline = async () => {
//   const querySnapshot = await getDocs(collection(db, "sales_pipeline"));
//   const data = querySnapshot.docs.map((doc) => ({
//     id: doc.id,
//     ...doc.data(),
//   }));
//   console.log("🔥 Deals Data from Firestore:", data);
//   return data;
// };

// Import the functions you need from the SDKs you need
// import { initializeApp } from "firebase/app";
// import { getAuth } from "firebase/auth";
// import { getFirestore, collection, getDocs, doc, updateDoc, addDoc, deleteDoc } from "firebase/firestore";

// // Firebase Config
// const firebaseConfig = {
//   apiKey: "AIzaSyDBlz0BgJiDQKiONs7eBwrd0--P-J1y1q0",
//   authDomain: "crmkanban-49b2d.firebaseapp.com",
//   projectId: "crmkanban-49b2d",
//   storageBucket: "crmkanban-49b2d.appspot.com",
//   messagingSenderId: "796027800374",
//   appId: "1:796027800374:web:3ff577bcd3f80ec25f8197",
// };

// const app = initializeApp(firebaseConfig);
// export const auth = getAuth(app);
// export const db = getFirestore(app);

// // Fetch Sales Pipeline Data
// export const getSalesPipeline = async () => {
//   const querySnapshot = await getDocs(collection(db, "sales_pipeline"));
//   const data = querySnapshot.docs.map((doc) => ({
//     id: doc.id,
//     ...doc.data(),
//   }));
//   console.log("🔥 Deals Data from Firestore:", data);
//   return data;
// };

// // Add New Document to Firestore
// export const addData = async (collectionName, data) => {
//   const docRef = await addDoc(collection(db, collectionName), data);
//   console.log("✅ New Data Added with ID:", docRef.id);
// };

// // Update Document in Firestore
// export const updateData = async (collectionName, id, data) => {
//   try {
//     const docRef = doc(db, collectionName, id);
//     await updateDoc(docRef, data);
//     console.log("🔄 Data Updated for ID:", id);
//   } catch (error) {
//     console.error("❌ Error updating document:", error);
//   }
// };

// // Delete Document in Firestore
// export const deleteData = async (collectionName, id) => {
//   const docRef = doc(db, collectionName, id);
//   await deleteDoc(docRef);
//   console.log("🗑️ Data Deleted for ID:", id);
// };

import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage"
import {
  getFirestore,
  collection,
  getDocs,
  doc,
  updateDoc,
  addDoc,
  deleteDoc,
} from "firebase/firestore";

// Firebase Config
const firebaseConfig = {
  apiKey: "AIzaSyDBlz0BgJiDQKiONs7eBwrd0--P-J1y1q0",
  authDomain: "crmkanban-49b2d.firebaseapp.com",
  projectId: "crmkanban-49b2d",
  storageBucket: "crmkanban-49b2d.appspot.com",
  messagingSenderId: "796027800374",
  appId: "1:796027800374:web:3ff577bcd3f80ec25f8197",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// Fetch Sales Pipeline Data
export const getSalesPipeline = async () => {
  const querySnapshot = await getDocs(collection(db, "sales_pipeline")); // Yeh sahi hai
  const data = querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
  console.log("🔥 Deals Data from Firestore:", data);
  return data;
};

// Add New Document to Firestore ✅
export const addData = async (collectionName: string, data: any) => {
  try {
    const colRef = collection(db, `${collectionName}`); // Yeh line fix hai bhai 🔥
    const docRef = await addDoc(colRef, data);
    console.log("✅ New Data Added with ID:", docRef.id);
  } catch (error) {
    console.error("❌ Error Adding Document:", error);
  }
};

// Update Document in Firestore 🔄
export const updateData = async (collectionName: string, id: string, data: any) => {
  try {
    const docRef = doc(db, `${collectionName}`, id);
    await updateDoc(docRef, data);
    console.log("🔄 Data Updated for ID:", id);
  } catch (error) {
    console.error("❌ Error updating document:", error);
  }
};

// Delete Document in Firestore 🗑️
export const deleteData = async (collectionName: string, id: string) => {
  try {
    const docRef = doc(db, `${collectionName}`, id);
    await deleteDoc(docRef);
    console.log("🗑️ Data Deleted for ID:", id);
  } catch (error) {
    console.error("❌ Error deleting document:", error);
  }
};
