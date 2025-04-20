// utils/googleLogin.ts
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth, db } from "../firebase/firebase";
import { doc, setDoc, getDoc } from "firebase/firestore";

export const handleGoogleLogin = async () => {
  const provider = new GoogleAuthProvider();
  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;

    // Check if user already has a role
    const userRef = doc(db, "users", user.uid);
    const docSnap = await getDoc(userRef);

    if (!docSnap.exists()) {
      // Ask user to choose role (Manager or Developer)
      const role = prompt("Enter your role: manager or developer").toLowerCase();

      await setDoc(userRef, {
        email: user.email,
        role: role,
      });

      redirectToRole(role);
    } else {
      const role = docSnap.data().role;
      redirectToRole(role);
    }
  } catch (error) {
    console.error("Google login error:", error);
  }
};

const redirectToRole = (role: string) => {
  if (role === "manager") {
    window.location.href = "/manager-dashboard";
  } else if (role === "developer") {
    window.location.href = "/developer-dashboard";
  }
};
