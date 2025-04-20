// import React from "react";
// import { Button, Form, Input, Space, Typography } from "antd";
// import { GoogleOutlined } from "@ant-design/icons";
import { handleGoogleLogin } from "../../firebase/googleLogin"; // Make sure the handleGoogleLogin function is correctly defined

// const { Title } = Typography;

// const CustomLogin: React.FC = () => {
//   const onFinish = (values: any) => {
//     console.log("Login data:", values);
//     // Add your login logic here
//   };

//   return (
//     <div style={{ maxWidth: 400, margin: "0 auto", padding: "20px" }}>
//       <Title level={2}>Login</Title>
//       <Form
//         name="loginForm"
//         onFinish={onFinish}
//         layout="vertical"
//       >
//         <Form.Item
//           label="Email"
//           name="email"
//           rules={[{ required: true, message: "Please input your email!" }]}
//         >
//           <Input />
//         </Form.Item>

//         <Form.Item
//           label="Password"
//           name="password"
//           rules={[{ required: true, message: "Please input your password!" }]}
//         >
//           <Input.Password />
//         </Form.Item>

//         <Form.Item>
//           <Button type="primary" htmlType="submit" style={{ width: "100%" }}>
//             Login
//           </Button>
//         </Form.Item>

//         <Form.Item>
//           <Space direction="vertical" style={{ width: "100%" }}>
//             <Button
//               type="default"
//               icon={<GoogleOutlined />}
//               onClick={handleGoogleLogin} // This handles Google login
//               style={{ width: "100%" }}
//             >
//               Sign in with Google
//             </Button>
//           </Space>
//         </Form.Item>
//       </Form>
//     </div>
//   );
// };

// export default CustomLogin;


// // src/pages/CustomLogin.tsx
// import React from "react";
// import { Button, Form, Input, Space, Typography } from "antd";
// import { GoogleOutlined } from "@ant-design/icons";
// // import { handleGoogleLogin } from "../utils/googleLogin";

// const { Title } = Typography;

// const CustomLogin: React.FC = () => {
//   console.log("Custom Login Rendered!"); // Debugging log
//   const onFinish = (values: any) => {
//     console.log("Email login with:", values);
//   };

//   return (
//     <div style={{ maxWidth: 400, margin: "4rem auto", padding: "2rem", background: "#fff", borderRadius: 8 }}>
//       <Title level={3} style={{ textAlign: "center" }}>Sign In</Title>
//       <Form name="login" layout="vertical" onFinish={onFinish}>
//         <Form.Item name="email" label="Email" rules={[{ required: true, message: "Please input your email!" }]}>
//           <Input />
//         </Form.Item>
//         <Form.Item name="password" label="Password" rules={[{ required: true, message: "Please input your password!" }]}>
//           <Input.Password />
//         </Form.Item>
//         <Form.Item>
//           <Button type="primary" htmlType="submit" block>
//             Sign in
//           </Button>
//         </Form.Item>
//         <Form.Item>
//           <Space direction="vertical" style={{ width: "100%" }}>
//             <Button icon={<GoogleOutlined />} onClick={handleGoogleLogin} block>
//               Sign in with Google
//             </Button>
//           </Space>
//         </Form.Item>
//       </Form>
//     </div>
//   );
// };

// export default CustomLogin;

// import { AuthPage } from "@refinedev/antd";

// export const Login = () => {
//   return (
//     <AuthPage
//       type="login"

//     />
//   );
// };

// src/pages/login.tsx
// Login.tsx
// import { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { auth, db, provider } from "../../firebase/firebase";
// import {
//   signInWithEmailAndPassword,
//   signInWithPopup,
// } from "firebase/auth";
// import { doc, getDoc } from "firebase/firestore";
// import { Button, Input, Typography, Card } from "antd";
// import { GoogleOutlined } from "@ant-design/icons";

// const { Title } = Typography;

// export const Login = () => {
//   const navigate = useNavigate();
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");

//   const handleGoogleLogin = async () => {
//     try {
//       const result = await signInWithPopup(auth, provider);
//       const user = result.user;

//       const userRef = doc(db, "users", user.uid);
//       const snap = await getDoc(userRef);
//       const role = snap.data()?.role;

//       navigate(role === "manager" ? "/" : "/developer-dashboard");
//     } catch (error) {
//       alert("Google login error");
//     }
//   };

//   const handleEmailLogin = async () => {
//     try {
//       const res = await signInWithEmailAndPassword(auth, email, password);
//       const user = res.user;

//       const userRef = doc(db, "users", user.uid);
//       const snap = await getDoc(userRef);
//       const role = snap.data()?.role;

//       navigate(role === "manager" ? "/" : "/developer-dashboard");
//     } catch (error) {
//       alert("Email login failed");
//     }
//   };

//   return (
//     <div style={{ height: "100vh", display: "flex", justifyContent: "center", alignItems: "center" }}>
//       <Card style={{ width: 400 }}>
//         <Title level={3}>Sign In</Title>
//         <Input placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
//         <Input.Password placeholder="Password" style={{ marginTop: 10 }} onChange={(e) => setPassword(e.target.value)} />
//         <Button type="primary" block style={{ marginTop: 10 }} onClick={handleEmailLogin}>
//           Sign In with Email
//         </Button>
//         <Button icon={<GoogleOutlined />} block style={{ marginTop: 10 }} onClick={handleGoogleLogin}>
//           Sign In with Google
//         </Button>
//         <Button type="link" block onClick={() => navigate("/register")}>
//           Don't have an account? Sign up
//         </Button>
//       </Card>
//     </div>
//   );
// };


// src/pages/Login.tsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db, provider } from "../../firebase/firebase";
import {
  signInWithEmailAndPassword,
  signInWithPopup,
} from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { Input, Button, Card, Typography, message } from "antd";
import { GoogleOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const redirectByRole = async (uid: string) => {
    const snap = await getDoc(doc(db, "users", uid));
    const role = snap.data()?.role;
    if (role === "manager") {
      navigate("/");
    } else if (role === "developer") {
      navigate("/developer-dashboard");
    } else {
      message.error("Role not found.");
    }
  };

  const handleEmailLogin = async () => {
    try {
      const res = await signInWithEmailAndPassword(auth, email, password);
      await redirectByRole(res.user.uid);
    } catch (err: any) {
      message.error("Email login failed: " + err.message);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const res = await signInWithPopup(auth, provider);
      await redirectByRole(res.user.uid);
    } catch (err: any) {
      message.error("Google login failed: " + err.message);
    }
  };

  return (
    <div style={{
      height: "100vh",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      background: "#f0f2f5"
    }}>
      <Card style={{
        width: 350,
        borderRadius: 8,
        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
        textAlign: "center"
      }}>
        <Title level={3}>Sign In</Title>
        <Input
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          style={{ marginTop: 16 }}
        />
        <Input.Password
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          style={{ marginTop: 16 }}
        />
        <Button
          type="primary"
          block
          style={{ marginTop: 24 }}
          onClick={handleEmailLogin}
        >
          Sign In with Email
        </Button>
        <Text style={{ display: "block", margin: "16px 0" }}>or</Text>
        <Button
          icon={<GoogleOutlined />}
          block
          style={{ marginBottom: 16 }}
          onClick={handleGoogleLogin}
        >
          Sign In with Google
        </Button>
        <Button
          type="link"
          onClick={() => navigate("/register")}
        >
          Don’t have an account? Sign up
        </Button>
      </Card>
    </div>
  );
};
