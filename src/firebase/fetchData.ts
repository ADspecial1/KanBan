// import { collection, getDocs } from "firebase/firestore";
// import { db } from "./firebase";

// export const fetchContacts = async () => {
//   try {
//     const querySnapshot = await getDocs(collection(db, "contacts"));
//     const contacts = querySnapshot.docs.map((doc) => ({
//       id: doc.id,
//       ...doc.data(), // Bas simple data hai direct🔥
//     }));
//     console.log("📩 Contacts Fetched:", contacts);
//     return contacts;
//   } catch (error) {
//     console.error("❌ Error fetching contacts:", error);
//     return [];
//   }
// };
import { collection, getDocs } from "firebase/firestore";
import { db } from "./firebase"; // yeh tera firebase config file ka path hai

export const fetchContacts = async () => {
  const querySnapshot = await getDocs(collection(db, "contacts"));
  const contactsData = querySnapshot.docs.map((doc) => ({
    id: doc.id, // Document ka ID
    ...doc.data(), // Baaki ka data
  }));
  return contactsData;
};
