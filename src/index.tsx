// import React from "react";
// import { createRoot } from "react-dom/client";

// import App from "./App";

// const container = document.getElementById("root") as HTMLElement;
// const root = createRoot(container);

// root.render(
//   <React.StrictMode>
//     <App />
//   </React.StrictMode>
// );

// import React from "react";
// import ReactDOM from "react-dom";
// import App from "./App";
// import { AuthProvider } from "./firebase/authContext";


// ReactDOM.render(
//   <AuthProvider>
//     <App />
//   </AuthProvider>,
//   document.getElementById("root")
// );


import React from 'react';
import ReactDOM from 'react-dom/client';  // Updated import
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root')!); // createRoot is now used
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
