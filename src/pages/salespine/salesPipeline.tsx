// // Import statements
// import { useEffect, useState } from "react";
// import { db } from "../../firebase/firebase";
// import {
//   collection,
//   getDocs,
//   addDoc,
//   updateDoc,
//   doc,
// } from "firebase/firestore";
// import {
//   Col, Row, Button, Input, Modal, Form, Select, message, Spin,
// } from "antd";
// import { useGetIdentity } from "@refinedev/core";
// import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

// // Component
// export const SalesPipeline = () => {
//   const [deals, setDeals] = useState([]);
//   const [companies, setCompanies] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [form] = Form.useForm();
//   const [isModalVisible, setIsModalVisible] = useState(false);
//   const { data: user } = useGetIdentity();

//   const statusList = ["new", "follow-up", "under review", "demo", "won", "lost"];

//   useEffect(() => {
//     const fetchData = async () => {
//       if (!user?.email) return;
//       try {
//         const dealSnap = await getDocs(collection(db, "sales_pipeline"));
//         const companySnap = await getDocs(collection(db, "company"));

//         const dealsData = dealSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }))
//           .filter(deal => deal.userId === user.email);

//         const companyData = companySnap.docs.map(doc => ({ id: doc.id, ...doc.data() }))
//           .filter(company => company.userId === user.email);

//         setDeals(dealsData);
//         setCompanies(companyData);
//       } catch (err) {
//         message.error("Failed to fetch data");
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchData();
//   }, [user]);

//   const onDragEnd = async (result) => {
//     if (!result.destination) return;
//     const { draggableId, destination } = result;

//     const draggedDeal = deals.find(deal => deal.id === draggableId);
//     if (!draggedDeal || draggedDeal.status === destination.droppableId) return;

//     try {
//       const newStatus = destination.droppableId;
//       const updatedDeals = deals.map(deal =>
//         deal.id === draggableId ? { ...deal, status: newStatus } : deal
//       );

//       setDeals(updatedDeals);
//       await updateDoc(doc(db, "sales_pipeline", draggableId), {
//         status: newStatus,
//         date: new Date().toLocaleDateString(), // Save latest move date
//       });
//       message.success("Deal status updated");
//     } catch (error) {
//       console.error(error);
//       message.error("Failed to update deal");
//     }
//   };

//   const handleAddDeal = async () => {
//     try {
//       const values = await form.validateFields();
//       const selectedCompany = companies.find(c => c.id === values.company);
//       if (!selectedCompany) return message.error("Invalid company selected");

//       const newDeal = {
//         title: values.title,
//         company: selectedCompany.name,
//         amount: parseFloat(values.amount),
//         status: values.status || "new",
//         date: new Date().toLocaleDateString(), // Store in string format like "15/04/2025"
//         userId: user.email,
//       };

//       const docRef = await addDoc(collection(db, "sales_pipeline"), newDeal);
//       setDeals([...deals, { id: docRef.id, ...newDeal }]);
//       message.success("Deal added");
//       form.resetFields();
//       setIsModalVisible(false);
//     } catch (err) {
//       message.error("Error adding deal");
//     }
//   };

//   if (loading) return <Spin size="large" style={{ margin: "100px auto", display: "block" }} />;

//   return (
//     <div style={{ padding: 20, background: "#f3f4f6" }}>
//       <Button type="primary" onClick={() => setIsModalVisible(true)} style={{ marginBottom: 20 }}>
//         + Add Deal
//       </Button>

//       <Modal
//         open={isModalVisible}
//         title="Add Deal"
//         onCancel={() => setIsModalVisible(false)}
//         onOk={handleAddDeal}
//       >
//         <Form layout="vertical" form={form}>
//           <Form.Item name="title" label="Title" rules={[{ required: true }]}>
//             <Input />
//           </Form.Item>

//           <Form.Item name="company" label="Company" rules={[{ required: true }]}>
//             <Select placeholder="Select a company">
//               {companies.map(c => (
//                 <Select.Option key={c.id} value={c.id}>{c.name}</Select.Option>
//               ))}
//             </Select>
//           </Form.Item>

//           <Form.Item name="status" label="Status" rules={[{ required: true }]}>
//             <Select>
//               {statusList.map(s => (
//                 <Select.Option key={s} value={s}>{s.toUpperCase()}</Select.Option>
//               ))}
//             </Select>
//           </Form.Item>

//           <Form.Item name="amount" label="Amount" rules={[{ required: true }]}>
//             <Input type="number" />
//           </Form.Item>

//           <Form.Item label="Owner">
//             <Input disabled value={user?.email} />
//           </Form.Item>
//         </Form>
//       </Modal>

//       <DragDropContext onDragEnd={onDragEnd}>
//         <Row gutter={16}>
//           {statusList.map(status => (
//             <Col span={4} key={status}>
//               <h4>{status.toUpperCase()}</h4>
//               <Droppable droppableId={status}>
//                 {(provided) => (
//                   <div
//                     ref={provided.innerRef}
//                     {...provided.droppableProps}
//                     style={{ minHeight: 150, background: "#e0e0e0", padding: 10 }}
//                   >
//                     {deals
//                       .filter(deal => deal.status === status)
//                       .map((deal, index) => (
//                         <Draggable key={deal.id} draggableId={deal.id} index={index}>
//                           {(provided) => (
//                             <div
//                               ref={provided.innerRef}
//                               {...provided.draggableProps}
//                               {...provided.dragHandleProps}
//                               style={{
//                                 margin: "8px 0",
//                                 background: "#fff",
//                                 padding: 10,
//                                 borderRadius: 5,
//                                 ...provided.draggableProps.style,
//                               }}
//                             >
//                               {deal.title} - ₹{deal.amount}
//                             </div>
//                           )}
//                         </Draggable>
//                       ))}
//                     {provided.placeholder}
//                   </div>
//                 )}
//               </Droppable>
//             </Col>
//           ))}
//         </Row>
//       </DragDropContext>
//     </div>
//   );
// };

// import { useEffect, useState } from "react";
// import { db } from "../../firebase/firebase";
// import {
//   collection,
//   getDocs,
//   addDoc,
//   updateDoc,
//   doc,
// } from "firebase/firestore";
// import {
//   Col, Row, Button, Input, Modal, Form, Select, message, Spin,
// } from "antd";
// import { useGetIdentity } from "@refinedev/core";
// import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd";

// // TYPES
// interface Deal {
//   id: string;
//   title: string;
//   company: string;
//   amount: number;
//   status: string;
//   date: string;
//   userId: string;
// }

// interface Company {
//   id: string;
//   name: string;
//   userId: string;
// }

// // Component
// export const SalesPipeline = () => {
//   const [deals, setDeals] = useState<Deal[]>([]);
//   const [companies, setCompanies] = useState<Company[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [form] = Form.useForm();
//   const [isModalVisible, setIsModalVisible] = useState(false);
//   const { data: user } = useGetIdentity();

//   const statusList = ["new", "follow-up", "under review", "demo", "won", "lost"];

//   useEffect(() => {
//     const fetchData = async () => {
//       if (!user?.email) return;
//       try {
//         const dealSnap = await getDocs(collection(db, "sales_pipeline"));
//         const companySnap = await getDocs(collection(db, "company"));

//         const dealsData: Deal[] = dealSnap.docs.map(doc => ({
//           id: doc.id,
//           ...(doc.data() as Omit<Deal, "id">),
//         })).filter(deal => deal.userId === user.email);

//         const companyData: Company[] = companySnap.docs.map(doc => ({
//           id: doc.id,
//           ...(doc.data() as Omit<Company, "id">),
//         })).filter(company => company.userId === user.email);

//         setDeals(dealsData);
//         setCompanies(companyData);
//       } catch (err) {
//         message.error("Failed to fetch data");
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchData();
//   }, [user]);

//   const onDragEnd = async (result: DropResult) => {
//     if (!result.destination) return;
//     const { draggableId, destination } = result;

//     const draggedDeal = deals.find(deal => deal.id === draggableId);
//     if (!draggedDeal || draggedDeal.status === destination.droppableId) return;

//     try {
//       const newStatus = destination.droppableId;
//       const updatedDeals = deals.map(deal =>
//         deal.id === draggableId ? { ...deal, status: newStatus } : deal
//       );

//       setDeals(updatedDeals);
//       await updateDoc(doc(db, "sales_pipeline", draggableId), {
//         status: newStatus,
//         date: new Date().toLocaleDateString(),
//       });
//       message.success("Deal status updated");
//     } catch (error) {
//       console.error(error);
//       message.error("Failed to update deal");
//     }
//   };

//   const handleAddDeal = async () => {
//     try {
//       const values = await form.validateFields();
//       const selectedCompany = companies.find(c => c.id === values.company);
//       if (!selectedCompany) return message.error("Invalid company selected");

//       const newDeal: Omit<Deal, "id"> = {
//         title: values.title,
//         company: selectedCompany.name,
//         amount: parseFloat(values.amount),
//         status: values.status || "new",
//         date: new Date().toLocaleDateString(),
//         userId: user.email,
//       };

//       const docRef = await addDoc(collection(db, "sales_pipeline"), newDeal);
//       setDeals([...deals, { id: docRef.id, ...newDeal }]);
//       message.success("Deal added");
//       form.resetFields();
//       setIsModalVisible(false);
//     } catch (err) {
//       message.error("Error adding deal");
//     }
//   };

//   if (loading) return <Spin size="large" style={{ margin: "100px auto", display: "block" }} />;

//   return (
//     <div style={{ padding: 20, background: "#f3f4f6" }}>
//       <Button type="primary" onClick={() => setIsModalVisible(true)} style={{ marginBottom: 20 }}>
//         + Add Deal
//       </Button>

//       <Modal
//         open={isModalVisible}
//         title="Add Deal"
//         onCancel={() => setIsModalVisible(false)}
//         onOk={handleAddDeal}
//       >
//         <Form layout="vertical" form={form}>
//           <Form.Item name="title" label="Title" rules={[{ required: true }]}>
//             <Input />
//           </Form.Item>

//           <Form.Item name="company" label="Company" rules={[{ required: true }]}>
//             <Select placeholder="Select a company">
//               {companies.map(c => (
//                 <Select.Option key={c.id} value={c.id}>{c.name}</Select.Option>
//               ))}
//             </Select>
//           </Form.Item>

//           <Form.Item name="status" label="Status" rules={[{ required: true }]}>
//             <Select>
//               {statusList.map(s => (
//                 <Select.Option key={s} value={s}>{s.toUpperCase()}</Select.Option>
//               ))}
//             </Select>
//           </Form.Item>

//           <Form.Item name="amount" label="Amount" rules={[{ required: true }]}>
//             <Input type="number" />
//           </Form.Item>

//           <Form.Item label="Owner">
//             <Input disabled value={user?.email} />
//           </Form.Item>
//         </Form>
//       </Modal>

//       <DragDropContext onDragEnd={onDragEnd}>
//         <Row gutter={16}>
//           {statusList.map(status => (
//             <Col span={4} key={status}>
//               <h4>{status.toUpperCase()}</h4>
//               <Droppable droppableId={status}>
//                 {(provided) => (
//                   <div
//                     ref={provided.innerRef}
//                     {...provided.droppableProps}
//                     style={{ minHeight: 150, background: "#e0e0e0", padding: 10 }}
//                   >
//                     {deals
//                       .filter(deal => deal.status === status)
//                       .map((deal, index) => (
//                         <Draggable key={deal.id} draggableId={deal.id} index={index}>
//                           {(provided) => (
//                             <div
//                               ref={provided.innerRef}
//                               {...provided.draggableProps}
//                               {...provided.dragHandleProps}
//                               style={{
//                                 margin: "8px 0",
//                                 background: "#fff",
//                                 padding: 10,
//                                 borderRadius: 5,
//                                 ...provided.draggableProps.style,
//                               }}
//                             >
//                               {deal.title} - ₹{deal.amount}
//                             </div>
//                           )}
//                         </Draggable>
//                       ))}
//                     {provided.placeholder}
//                   </div>
//                 )}
//               </Droppable>
//             </Col>
//           ))}
//         </Row>
//       </DragDropContext>
//     </div>
//   );
// };

// import { useEffect, useState } from "react";
// import { db } from "../../firebase/firebase";
// import {
//   collection,
//   getDocs,
//   addDoc,
//   updateDoc,
//   doc,
// } from "firebase/firestore";
// import {
//   Col,
//   Row,
//   Button,
//   Input,
//   Modal,
//   Form,
//   Select,
//   message,
//   Spin,
//   Space,
// } from "antd";
// import { useGetIdentity } from "@refinedev/core";
// import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

// // ==== Types ====
// interface Deal {
//   id: string;
//   title: string;
//   company: string;
//   amount: number;
//   status: string;
//   date: string;
//   userId: string;
// }

// interface Company {
//   id: string;
//   name: string;
//   userId: string;
//   logoUrl?:string
// }

// interface Identity {
//   email: string;
//   uid: string;
//   [key: string]: any;
// }

// // ==== Component ====
// export const SalesPipeline = () => {
//   const [deals, setDeals] = useState<Deal[]>([]);
//   const [companies, setCompanies] = useState<Company[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [form] = Form.useForm();
//   const [isModalVisible, setIsModalVisible] = useState(false);
//   const [isAddCompanyModalVisible, setIsAddCompanyModalVisible] = useState(false);
//   const [newCompanyName, setNewCompanyName] = useState("");
//   const { data: user } = useGetIdentity<Identity>();

//   const statusList = [
//     "new",
//     "follow-up",
//     "under review",
//     "demo",
//     "won",
//     "lost",
//   ];

//   const fetchDeals = async () => {
//     if (!user?.email) return;
//     try {
//       const dealSnap = await getDocs(collection(db, "sales_pipeline"));
//       const dealsData: Deal[] = dealSnap.docs
//         .map((doc) => ({
//           id: doc.id,
//           ...(doc.data() as Omit<Deal, "id">),
//         }))
//         .filter((deal) => deal.userId === user.email);
//       setDeals(dealsData);
//     } catch (err) {
//       message.error("Failed to fetch deals");
//     }
//   };

//   const fetchCompanies = async () => {
//     if (!user?.email) {
//       message.error("User is not authenticated");
//       return;
//     }

//     try {
//       const companySnap = await getDocs(collection(db, "companies"));
//       const companyData: Company[] = companySnap.docs
//         .map((doc) => ({
//           id: doc.id,
//           ...(doc.data() as Omit<Company, "id">),
//         }))
//         .filter((company) => company.userId === user.email);

//       // Console log to debug
//       console.log(companyData);

//       if (companyData.length === 0) {
//         message.info("No companies found");
//       }

//       setCompanies(companyData);
//     } catch (err) {
//       message.error("Failed to fetch companies");
//       console.error("Error fetching companies:", err);
//     }
// };


//   useEffect(() => {
//     setLoading(true);
//     fetchDeals().finally(() => setLoading(false));
//   }, [user]);

//   useEffect(() => {
//     fetchCompanies();
//   }, [user?.email]); // Fetch companies only when user?.email changes and is truthy

//   const handleAddCompany = async () => {
//     if (!newCompanyName.trim()) return message.error("Please enter company name");
//     try {
//       const docRef = await addDoc(collection(db, "companies"), {
//         name: newCompanyName,
//         userId: user!.email,
//       });

//       const newCompany: Company = {
//         id: docRef.id,
//         name: newCompanyName,
//         userId: user!.email,
//       };

//       setCompanies((prev) => [...prev, newCompany]);
//       setNewCompanyName("");
//       setIsAddCompanyModalVisible(false);
//       message.success("Company added successfully");
//     } catch (err) {
//       message.error("Error adding company");
//     }
//   };

//   const onDragEnd = async (result: any) => {
//     if (!result.destination) return;
//     const { draggableId, destination } = result;

//     const draggedDeal = deals.find((deal) => deal.id === draggableId);
//     if (!draggedDeal || draggedDeal.status === destination.droppableId) return;

//     try {
//       const newStatus = destination.droppableId;
//       const updatedDeals = deals.map((deal) =>
//         deal.id === draggableId ? { ...deal, status: newStatus } : deal
//       );

//       setDeals(updatedDeals);
//       await updateDoc(doc(db, "sales_pipeline", draggableId), {
//         status: newStatus,
//         date: new Date().toLocaleDateString(),
//       });
//       message.success("Deal status updated");
//     } catch (error) {
//       console.error(error);
//       message.error("Failed to update deal");
//     }
//   };

//   const handleAddDeal = async () => {
//     try {
//       const values = await form.validateFields();
//       const selectedCompany = companies.find((c) => c.id === values.company);
//       if (!selectedCompany) return message.error("Invalid company selected");

//       const newDeal: Omit<Deal, "id"> = {
//         title: values.title,
//         company: selectedCompany.name,
//         amount: parseFloat(values.amount),
//         status: values.status || "new",
//         date: new Date().toLocaleDateString(),
//         userId: user!.email,
//       };

//       const docRef = await addDoc(collection(db, "sales_pipeline"), newDeal);
//       setDeals([...deals, { id: docRef.id, ...newDeal }]);
//       message.success("Deal added");
//       form.resetFields();
//       setIsModalVisible(false);
//     } catch (err) {
//       message.error("Error adding deal");
//     }
//   };

//   const showAddDealModal = () => {
//     setIsModalVisible(true);
//   };

//   if (loading) {
//     return (
//       <div style={{ display: "flex", justifyContent: "center", marginTop: "20vh" }}>
//         <Spin size="large" />
//       </div>
//     );
//   }

//   return (
//     <div style={{ padding: 20, background: "#f9fafb", minHeight: "100vh" }}>
//       <Space style={{ marginBottom: 20 }}>
//         <Button
//           type="primary"
//           onClick={showAddDealModal}
//           style={{ background: "#2563eb", borderColor: "#2563eb" }}
//         >
//           + Add Deal
//         </Button>
//         <Button
//           onClick={() => setIsAddCompanyModalVisible(true)}
//           style={{ background: "#10b981", borderColor: "#10b981", color: "#fff" }}
//         >
//           + Add Company
//         </Button>
//       </Space>

//       {/* Modal: Add Deal */}
//       <Modal
//         open={isModalVisible}
//         title="Add New Deal"
//         onCancel={() => setIsModalVisible(false)}
//         onOk={handleAddDeal}
//         okText="Add Deal"
//       >
//         <Form layout="vertical" form={form}>
//           <Form.Item name="title" label="Title" rules={[{ required: true }]}>
//             <Input placeholder="Enter deal title" />
//           </Form.Item>
//           <Form.Item name="company" label="Company" rules={[{ required: true }]}>
//             <Select placeholder="Select a company">
//               {companies.map((c) => (
//                 <Select.Option key={c.id} value={c.id}>
//                   {c.name}
//                 </Select.Option>
//               ))}
//             </Select>
//           </Form.Item>
//           <Form.Item name="status" label="Status" rules={[{ required: true }]}>
//             <Select placeholder="Select status">
//               {statusList.map((s) => (
//                 <Select.Option key={s} value={s}>
//                   {s.toUpperCase()}
//                 </Select.Option>
//               ))}
//             </Select>
//           </Form.Item>
//           <Form.Item name="amount" label="Amount" rules={[{ required: true }]}>
//             <Input type="number" placeholder="Enter deal amount" />
//           </Form.Item>
//           <Form.Item label="Owner">
//             <Input disabled value={user?.email} />
//           </Form.Item>
//         </Form>
//       </Modal>

//       {/* Modal: Add Company */}
//       <Modal
//         open={isAddCompanyModalVisible}
//         title="Add New Company"
//         onCancel={() => setIsAddCompanyModalVisible(false)}
//         onOk={handleAddCompany}
//         okText="Add Company"
//       >
//         <Input
//           placeholder="Enter company name"
//           value={newCompanyName}
//           onChange={(e) => setNewCompanyName(e.target.value)}
//         />
//       </Modal>

//       {/* Drag and Drop Sales Board */}
//       <DragDropContext onDragEnd={onDragEnd}>
//         <Row gutter={[16, 16]}>
//           {statusList.map((status) => (
//             <Col xs={24} sm={12} md={8} lg={4} key={status}>
//               <div
//                 style={{
//                   background: "#fff",
//                   borderRadius: 12,
//                   padding: 12,
//                   minHeight: 400,
//                   maxHeight: "75vh",
//                   overflowY: "auto",
//                   boxShadow: "0 3px 10px rgba(0,0,0,0.05)",
//                   borderTop: `4px solid ${
//                     status === "won"
//                       ? "#22c55e"
//                       : status === "lost"
//                       ? "#ef4444"
//                       : "#3b82f6"
//                   }`,
//                 }}
//               >
//                 <h4
//                   style={{
//                     textAlign: "center",
//                     textTransform: "uppercase",
//                     fontWeight: 600,
//                     color: "#111827",
//                     marginBottom: 12,
//                   }}
//                 >
//                   {status}
//                 </h4>
//                 <Droppable droppableId={status}>
//                   {(provided) => (
//                     <div
//                       ref={provided.innerRef}
//                       {...provided.droppableProps}
//                       style={{ minHeight: 100 }}
//                     >
//                       {deals
//                         .filter((deal) => deal.status === status)
//                         .map((deal, index) => (
//                           <Draggable key={deal.id} draggableId={deal.id} index={index}>
//                             {(provided) => (
//                               <div
//                                 ref={provided.innerRef}
//                                 {...provided.draggableProps}
//                                 {...provided.dragHandleProps}
//                                 style={{
//                                   padding: "12px",
//                                   borderRadius: "12px",
//                                   background: "#f0f9ff",
//                                   marginBottom: 12,
//                                   boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
//                                   transition: "all 0.3s ease",
//                                   ...provided.draggableProps.style,
//                                 }}
//                               >
//                                 <div
//                                   style={{
//                                     fontWeight: 600,
//                                     color: "#0369a1",
//                                     fontSize: 16,
//                                   }}
//                                 >
//                                   {deal.title}
//                                 </div>
//                                 <div
//                                   style={{
//                                     fontSize: 14,
//                                     color: "#0c4a6e",
//                                     marginTop: 4,
//                                   }}
//                                 >
//                                   ₹{deal.amount} • {deal.company}
//                                 </div>
//                                 <div
//                                   style={{
//                                     fontSize: 12,
//                                     color: "#64748b",
//                                     marginTop: 6,
//                                   }}
//                                 >
//                                   {new Intl.DateTimeFormat("en-IN", {
//                                     dateStyle: "medium",
//                                   }).format(new Date(deal.date))}
//                                 </div>
//                               </div>
//                             )}
//                           </Draggable>
//                         ))}
//                       {provided.placeholder}
//                     </div>
//                   )}
//                 </Droppable>
//               </div>
//             </Col>
//           ))}
//         </Row>
//       </DragDropContext>
//     </div>
//   );
// };

import { useEffect, useState } from "react";
import { db } from "../../firebase/firebase";
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  doc,
  query,
  where,
} from "firebase/firestore";
import {
  Col,
  Row,
  Button,
  Input,
  Modal,
  Form,
  Select,
  message,
  Spin,
  Space,
} from "antd";
import { useGetIdentity } from "@refinedev/core";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { getAuth } from "firebase/auth";

// ==== Types ====
interface Deal {
  id: string;
  title: string;
  company: string;
  amount: number;
  status: string;
  date: string;
  userId: string;
}

interface Company {
  id: string;
  name: string;
  userId: string;
  logoUrl?: string;
  member?: string;
}

interface Identity {
  email: string;
  uid: string;
  [key: string]: any;
}

// ==== Component ====
export const SalesPipeline = () => {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [form] = Form.useForm();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isAddCompanyModalVisible, setIsAddCompanyModalVisible] = useState(false);
  const [newCompanyName, setNewCompanyName] = useState("");
  const { data: user } = useGetIdentity<Identity>();
  
  // Get the Firebase Auth User ID
  const firebaseUser = getAuth().currentUser;
  const userId = firebaseUser?.uid || "";

  const statusList = [
    "new",
    "follow-up",
    "under review",
    "demo",
    "won",
    "lost",
  ];

  const fetchDeals = async () => {
    if (!user?.email) return;
    try {
      const dealSnap = await getDocs(collection(db, "sales_pipeline"));
      const dealsData: Deal[] = dealSnap.docs
        .map((doc) => ({
          id: doc.id,
          ...(doc.data() as Omit<Deal, "id">),
        }))
        .filter((deal) => deal.userId === user.email);
      setDeals(dealsData);
    } catch (err) {
      message.error("Failed to fetch deals");
    }
  };

  const fetchCompanies = async () => {
    if (!userId) {
      console.log("No user ID available for fetching companies");
      return;
    }

    try {
      // Create a query to get companies where userId matches the current Firebase user ID
      const companiesQuery = query(
        collection(db, "companies"), 
        where("userId", "==", userId)
      );
      
      const companySnap = await getDocs(companiesQuery);
      
      // Map the company documents to our Company interface
      const companyData: Company[] = companySnap.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as Omit<Company, "id">),
      }));

      // Also get companies created in the sales pipeline that use email as userId
      if (user?.email) {
        const emailCompaniesQuery = query(
          collection(db, "companies"),
          where("userId", "==", user.email)
        );
        
        const emailCompanySnap = await getDocs(emailCompaniesQuery);
        const emailCompanyData: Company[] = emailCompanySnap.docs.map((doc) => ({
          id: doc.id,
          ...(doc.data() as Omit<Company, "id">),
        }));
        
        // Combine both sets of companies, avoiding duplicates
        const allCompanies = [...companyData];
        
        emailCompanyData.forEach(company => {
          if (!allCompanies.some(c => c.id === company.id)) {
            allCompanies.push(company);
          }
        });
        
        setCompanies(allCompanies);
      } else {
        setCompanies(companyData);
      }

      // Console log to debug
      console.log("Fetched companies:", companyData);

      if (companyData.length === 0) {
        console.log("No companies found with userId:", userId);
      }
    } catch (err) {
      message.error("Failed to fetch companies");
      console.error("Error fetching companies:", err);
    }
  };

  useEffect(() => {
    setLoading(true);
    fetchDeals().finally(() => setLoading(false));
  }, [user]);

  useEffect(() => {
    fetchCompanies();
  }, [userId, user?.email]); // Fetch companies when either userId or user.email changes

  const handleAddCompany = async () => {
    if (!newCompanyName.trim()) return message.error("Please enter company name");
    try {
      // Use Firebase Auth user ID instead of email for consistency
      const newCompanyData = {
        name: newCompanyName,
        userId: userId || user?.email || "", // Fallback to email if uid not available
      };
      
      const docRef = await addDoc(collection(db, "companies"), newCompanyData);

      const newCompany: Company = {
        id: docRef.id,
        ...newCompanyData
      };

      setCompanies((prev) => [...prev, newCompany]);
      setNewCompanyName("");
      setIsAddCompanyModalVisible(false);
      message.success("Company added successfully");
    } catch (err) {
      message.error("Error adding company");
    }
  };

  const onDragEnd = async (result: any) => {
    if (!result.destination) return;
    const { draggableId, destination } = result;

    const draggedDeal = deals.find((deal) => deal.id === draggableId);
    if (!draggedDeal || draggedDeal.status === destination.droppableId) return;

    try {
      const newStatus = destination.droppableId;
      const updatedDeals = deals.map((deal) =>
        deal.id === draggableId ? { ...deal, status: newStatus } : deal
      );

      setDeals(updatedDeals);
      await updateDoc(doc(db, "sales_pipeline", draggableId), {
        status: newStatus,
        date: new Date().toLocaleDateString(),
      });
      message.success("Deal status updated");
    } catch (error) {
      console.error(error);
      message.error("Failed to update deal");
    }
  };

  const handleAddDeal = async () => {
    try {
      const values = await form.validateFields();
      const selectedCompany = companies.find((c) => c.id === values.company);
      if (!selectedCompany) return message.error("Invalid company selected");

      const newDeal: Omit<Deal, "id"> = {
        title: values.title,
        company: selectedCompany.name,
        amount: parseFloat(values.amount),
        status: values.status || "new",
        date: new Date().toLocaleDateString(),
        userId: user!.email,
      };

      const docRef = await addDoc(collection(db, "sales_pipeline"), newDeal);
      setDeals([...deals, { id: docRef.id, ...newDeal }]);
      message.success("Deal added");
      form.resetFields();
      setIsModalVisible(false);
    } catch (err) {
      message.error("Error adding deal");
    }
  };

  const showAddDealModal = () => {
    setIsModalVisible(true);
  };

  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", marginTop: "20vh" }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div style={{ padding: 20, background: "#f9fafb", minHeight: "100vh" }}>
      <Space style={{ marginBottom: 20 }}>
        <Button
          type="primary"
          onClick={showAddDealModal}
          style={{ background: "#2563eb", borderColor: "#2563eb" }}
        >
          + Add Deal
        </Button>
        <Button
          onClick={() => setIsAddCompanyModalVisible(true)}
          style={{ background: "#10b981", borderColor: "#10b981", color: "#fff" }}
        >
          + Add Company
        </Button>
      </Space>

      {/* Modal: Add Deal */}
      <Modal
        open={isModalVisible}
        title="Add New Deal"
        onCancel={() => setIsModalVisible(false)}
        onOk={handleAddDeal}
        okText="Add Deal"
      >
        <Form layout="vertical" form={form}>
          <Form.Item name="title" label="Title" rules={[{ required: true }]}>
            <Input placeholder="Enter deal title" />
          </Form.Item>
          <Form.Item name="company" label="Company" rules={[{ required: true }]}>
            <Select placeholder="Select a company">
              {companies.map((c) => (
                <Select.Option key={c.id} value={c.id}>
                  {c.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item name="status" label="Status" rules={[{ required: true }]}>
            <Select placeholder="Select status">
              {statusList.map((s) => (
                <Select.Option key={s} value={s}>
                  {s.toUpperCase()}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item name="amount" label="Amount" rules={[{ required: true }]}>
            <Input type="number" placeholder="Enter deal amount" />
          </Form.Item>
          <Form.Item label="Owner">
            <Input disabled value={user?.email} />
          </Form.Item>
        </Form>
      </Modal>

      {/* Modal: Add Company */}
      <Modal
        open={isAddCompanyModalVisible}
        title="Add New Company"
        onCancel={() => setIsAddCompanyModalVisible(false)}
        onOk={handleAddCompany}
        okText="Add Company"
      >
        <Input
          placeholder="Enter company name"
          value={newCompanyName}
          onChange={(e) => setNewCompanyName(e.target.value)}
        />
      </Modal>

      {/* Drag and Drop Sales Board */}
      <DragDropContext onDragEnd={onDragEnd}>
        <Row gutter={[16, 16]}>
          {statusList.map((status) => (
            <Col xs={24} sm={12} md={8} lg={4} key={status}>
              <div
                style={{
                  background: "#fff",
                  borderRadius: 12,
                  padding: 12,
                  minHeight: 400,
                  maxHeight: "75vh",
                  overflowY: "auto",
                  boxShadow: "0 3px 10px rgba(0,0,0,0.05)",
                  borderTop: `4px solid ${
                    status === "won"
                      ? "#22c55e"
                      : status === "lost"
                      ? "#ef4444"
                      : "#3b82f6"
                  }`,
                }}
              >
                <h4
                  style={{
                    textAlign: "center",
                    textTransform: "uppercase",
                    fontWeight: 600,
                    color: "#111827",
                    marginBottom: 12,
                  }}
                >
                  {status}
                </h4>
                <Droppable droppableId={status}>
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      style={{ minHeight: 100 }}
                    >
                      {deals
                        .filter((deal) => deal.status === status)
                        .map((deal, index) => (
                          <Draggable key={deal.id} draggableId={deal.id} index={index}>
                            {(provided) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                style={{
                                  padding: "12px",
                                  borderRadius: "12px",
                                  background: "#f0f9ff",
                                  marginBottom: 12,
                                  boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
                                  transition: "all 0.3s ease",
                                  ...provided.draggableProps.style,
                                }}
                              >
                                <div
                                  style={{
                                    fontWeight: 600,
                                    color: "#0369a1",
                                    fontSize: 16,
                                  }}
                                >
                                  {deal.title}
                                </div>
                                <div
                                  style={{
                                    fontSize: 14,
                                    color: "#0c4a6e",
                                    marginTop: 4,
                                  }}
                                >
                                  ₹{deal.amount} • {deal.company}
                                </div>
                                <div
                                  style={{
                                    fontSize: 12,
                                    color: "#64748b",
                                    marginTop: 6,
                                  }}
                                >
                                  {new Intl.DateTimeFormat("en-IN", {
                                    dateStyle: "medium",
                                  }).format(new Date(deal.date))}
                                </div>
                              </div>
                            )}
                          </Draggable>
                        ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </div>
            </Col>
          ))}
        </Row>
      </DragDropContext>
    </div>
  );
};