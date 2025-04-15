// import { AuthBindings } from "@refinedev/core";

// import { API_URL, dataProvider } from "./data";

// export const authCredentials = {
//   email: "michael.scott@dundermifflin.com",
//   password: "demodemo",
// };

// export const authProvider: AuthBindings = {
//   login: async ({ email }) => {
//     try {

//       const { data } = await dataProvider.custom({
//         url: API_URL,
//         method: "post",
//         headers: {},
//         meta: {
//           variables: { email },
//           rawQuery: `
//             mutation Login($email: String!) {
//               login(loginInput: { email: $email }) {
//                 accessToken
//               }
//             }
//           `,
//         },
//       });

//       localStorage.setItem("access_token", data.login.accessToken);

//       return {
//         success: true,
//         redirectTo: "/",
//       };
//     } catch (e) {
//       const error = e as Error;

//       return {
//         success: false,
//         error: {
//           message: "message" in error ? error.message : "Login failed",
//           name: "name" in error ? error.name : "Invalid email or password",
//         },
//       };
//     }
//   },

//   logout: async () => {
//     localStorage.removeItem("access_token");

//     return {
//       success: true,
//       redirectTo: "/login",
//     };
//   },

//   onError: async (error) => {
//     if (error.statusCode === "UNAUTHENTICATED") {
//       return {
//         logout: true,
//         ...error,
//       };
//     }

//     return { error };
//   },

//   check: async () => {
//     try {
//       await dataProvider.custom({
//         url: API_URL,
//         method: "post",
//         headers: {},
//         meta: {
//           rawQuery: `
//             query Me {
//               me {
//                 name
//               }
//             }
//           `,
//         },
//       });

//       return {
//         authenticated: true,
//         redirectTo: "/",
//       };
//     } catch (error) {
//       return {
//         authenticated: false,
//         redirectTo: "/login",
//       };
//     }
//   },

//   getIdentity: async () => {
//     const accessToken = localStorage.getItem("access_token");

//     try {

//       const { data } = await dataProvider.custom<{ me: any }>({
//         url: API_URL,
//         method: "post",
//         headers: accessToken
//           ? {
//               Authorization: `Bearer ${accessToken}`,
//             }
//           : {},
//         meta: {
//           rawQuery: `
//             query Me {
//               me {
//                 id
//                 name
//                 email
//                 phone
//                 jobTitle
//                 timezone
//                 avatarUrl
//               }
//             }
//           `,
//         },
//       });

//       return data.me;
//     } catch (error) {
//       return undefined;
//     }
//   },
// };
// import { AuthBindings } from "@refinedev/core";
// import { auth } from "../firebase";
// import {
//   signInWithEmailAndPassword,
//   createUserWithEmailAndPassword,
//   signOut,
// } from "firebase/auth";
// import { API_URL } from "./data";

// export const authProvider: AuthBindings = {
//   login: async ({ email, password }) => {
//     try {
//       await signInWithEmailAndPassword(auth, email, password);
//       return {
//         success: true,
//         redirectTo: "/",
//       };
//     } catch (error: any) {
//       return {
//         success: false,
//         error: {
//           message: error.message || "Login failed",
//           name: "Invalid email or password",
//         },
//       };
//     }
//   },

//   register: async ({ email, password }) => {
//     try {
//       await createUserWithEmailAndPassword(auth, email, password);
//       return {
//         success: true,
//         redirectTo: "/login",
//       };
//     } catch (error: any) {
//       return {
//         success: false,
//         error: {
//           message: error.message || "Signup failed",
//           name: "Email already exists",
//         },
//       };
//     }
//   },

//   logout: async () => {
//     await signOut(auth);
//     return {
//       success: true,
//       redirectTo: "/login",
//     };
//   },

//   check: async () => {
//     const user = auth.currentUser;
//     if (user) {
//       return {
//         authenticated: true,
//         redirectTo: "/",
//       };
//     }
//     return {
//       authenticated: false,
//       redirectTo: "/login",
//     };
//   },

//   getIdentity: async () => {
//     const accessToken = localStorage.getItem("access_token");

//     try {
//       const { data } = await dataProvider.custom({
//         url: API_URL,
//         method: "post",
//         headers: accessToken
//           ? {
//               Authorization: `Bearer ${accessToken}`,
//             }
//           : {},
//         meta: {
//           rawQuery: `
//             query GetUser($id: String!) { // String se hi milega ab
//               user(id: $id) {
//                 id
//                 name
//                 avatarUrl
//                 email
//                 phone
//                 jobTitle
//               }
//             }
//           `,
//           variables: { id: String(accessToken) }, // Yahan fix ho raha hai
//         },
//       });

//       return data.user; // Yeh data wapas karega
//     } catch (error) {
//       console.log("Identity Error:", error);
//       return undefined;
//     }
//   },

//   getPermissions: async () => null,
// };

import { AuthBindings } from "@refinedev/core";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../firebase/firebase";
// import { auth } from "../firebase";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
} from "firebase/auth";

export const authProvider: AuthBindings = {
  login: async ({ email, password }) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      return {
        success: true,
        redirectTo: "/",
      };
    } catch (error: any) {
      return {
        success: false,
        error: {
          message: error.message || "Login failed",
          name: "Invalid email or password",
        },
      };
    }
  },

  register: async ({ email, password }) => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      return {
        success: true,
        redirectTo: "/login",
      };
    } catch (error: any) {
      return {
        success: false,
        error: {
          message: error.message || "Signup failed",
          name: "Email already exists",
        },
      };
    }
  },

  logout: async () => {
    await signOut(auth);
    return {
      success: true,
      redirectTo: "/login",
    };
  },

  check: async () => {
    return new Promise((resolve) => {
      auth.onAuthStateChanged((user) => {
        if (user) {
          resolve({
            authenticated: true,
            redirectTo: "/",
          });
        } else {
          resolve({
            authenticated: false,
            redirectTo: "/login",
          });
        }
      });
    });
  },

  getIdentity: async () => {
    const user = auth.currentUser;

    if (user) {
      return {
        id: user.uid,
        name: user.displayName || user.email,
        avatarUrl: user.photoURL,
        email: user.email,
      };
    }

    return undefined;
  },

  getPermissions: async () => null,
};
