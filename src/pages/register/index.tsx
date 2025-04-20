// import { AuthPage } from "@refinedev/antd";

// export const Register = () => {
//   return <AuthPage type="register" />;
// };

// Signup.tsx
// src/pages/Register.tsx
// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { Input, Select, Button, Card, Typography, message } from "antd";
// import { auth, db } from "../../firebase/firebase";
// import { createUserWithEmailAndPassword } from "firebase/auth";
// import { doc, setDoc } from "firebase/firestore";

// const { Title } = Typography;
// const { Option } = Select;

// export const Register: React.FC = () => {
//   const navigate = useNavigate();
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [role, setRole] = useState<"manager" | "developer" | "">("");

//   const handleRegister = async () => {
//     if (!email || !password || !role) {
//       return message.warning("Please fill all fields.");
//     }
//     try {
//       const cred = await createUserWithEmailAndPassword(auth, email, password);
//       // Write role into Firestore
//       await setDoc(doc(db, "users", cred.user.uid), { email, role });
//       message.success("Registered!");
//       navigate("/login");
//     } catch (err: any) {
//       message.error(err.message);
//     }
//   };

//   return (
//     <div style={{
//       height: "100vh",
//       display: "flex",
//       justifyContent: "center",
//       alignItems: "center",
//       background: "#f0f2f5"
//     }}>
//       <Card style={{ width: 350, borderRadius: 8, boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}>
//         <Title level={3} style={{ textAlign: "center" }}>Sign Up</Title>
//         <Input
//           placeholder="Email"
//           value={email}
//           onChange={e => setEmail(e.target.value)}
//           style={{ marginTop: 16 }}
//         />
//         <Input.Password
//           placeholder="Password"
//           value={password}
//           onChange={e => setPassword(e.target.value)}
//           style={{ marginTop: 16 }}
//         />
//         <Select
//           placeholder="Select role"
//           value={role}
//           onChange={(v) => setRole(v)}
//           style={{ width: "100%", marginTop: 16 }}
//         >
//           <Option value="manager">Manager</Option>
//           <Option value="developer">Developer</Option>
//         </Select>
//         <Button
//           type="primary"
//           block
//           style={{ marginTop: 24 }}
//           onClick={handleRegister}
//         >
//           Create Account
//         </Button>
//         <Button
//           type="link"
//           block
//           onClick={() => navigate("/login")}
//         >
//           Already have an account? Sign in
//         </Button>
//       </Card>
//     </div>
//   );
// };


import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input, Select, Button, Card, Typography, message } from "antd";
import { auth, db } from "../../firebase/firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";

const { Title } = Typography;
const { Option } = Select;

export const Register: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"manager" | "developer" | "">("");
  const [username, setUsername] = useState("");

  const handleRegister = async () => {
    if (!email || !password || !role || !username) {
      return message.warning("Please fill all fields.");
    }
    try {
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      await setDoc(doc(db, "users", cred.user.uid), {
        email,
        role,
        username,
      });
      message.success("Registered!");
      navigate("/login");
    } catch (err: any) {
      message.error(err.message);
    }
  };

  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "#f0f2f5",
      }}
    >
      <Card
        style={{
          width: 350,
          borderRadius: 8,
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
        }}
      >
        <Title level={3} style={{ textAlign: "center" }}>
          Sign Up
        </Title>
        <Input
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          style={{ marginTop: 16 }}
        />
        <Input
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{ marginTop: 16 }}
        />
        <Input.Password
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{ marginTop: 16 }}
        />
        <Select
          placeholder="Select role"
          value={role}
          onChange={(v) => setRole(v)}
          style={{ width: "100%", marginTop: 16 }}
        >
          <Option value="manager">Manager</Option>
          <Option value="developer">Developer</Option>
        </Select>
        <Button
          type="primary"
          block
          style={{ marginTop: 24 }}
          onClick={handleRegister}
        >
          Create Account
        </Button>
        <Button type="link" block onClick={() => navigate("/login")}>
          Already have an account? Sign in
        </Button>
      </Card>
    </div>
  );
};
