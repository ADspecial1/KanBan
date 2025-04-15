// import { useEffect, useState } from "react";
// import { db } from "../../firebase/firebase";
// import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
// import { collection, getDocs, updateDoc, doc, addDoc } from "firebase/firestore";
// import { Col, Row, Button, Input, Modal, Form, Select, DatePicker, Upload } from "antd";
// import { UploadOutlined } from "@ant-design/icons";
// import { useGetIdentity } from "@refinedev/core";

// const storage = getStorage();

// export const SalesPipeline = () => {
//   const [deals, setDeals] = useState([]);
//   const [isModalVisible, setIsModalVisible] = useState(false);
//   const [form] = Form.useForm();
//   const { data: user } = useGetIdentity();
//   const [contacts, setContacts] = useState([]);
//   const [owners, setOwners] = useState([]);

//   useEffect(() => {
//     const fetchDeals = async () => {
//       try {
//         const dealsSnapshot = await getDocs(collection(db, "sales_pipeline"));
//         const dealsData = dealsSnapshot.docs
//           .map((doc) => ({ id: doc.id, ...doc.data(), status: doc.data()?.status?.toLowerCase() }))
//           .filter((deal) => deal.userId === user?.email);

//         setDeals(dealsData);
//       } catch (error) {
//         console.error("Error fetching deals: ", error);
//       }
//     };

//     const fetchContactsAndOwners = async () => {
//       try {
//         const contactsSnapshot = await getDocs(collection(db, "contacts"));
//         const contactsData = contactsSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
//         setContacts(contactsData);
//         setOwners(contactsData);
//       } catch (error) {
//         console.error("Error fetching contacts: ", error);
//       }
//     };

//     if (user) {
//       fetchDeals();
//       fetchContactsAndOwners();
//     }
//   }, [user]);

//   const statusList = ["new", "follow-up", "under review", "demo", "won", "lost"];

//   const handleDragStart = (e, deal) => {
//     e.dataTransfer.setData("dealId", deal.id);
//   };

//   const handleDrop = async (e, status) => {
//     const dealId = e.dataTransfer.getData("dealId");
//     const draggedDeal = deals.find((deal) => deal.id === dealId);

//     if (draggedDeal && draggedDeal.status !== status) {
//       const updatedDeals = deals.map((deal) => (deal.id === dealId ? { ...deal, status } : deal));
//       setDeals(updatedDeals);

//       const dealRef = doc(db, "sales_pipeline", dealId);
//       await updateDoc(dealRef, { status });
//     }
//   };

//   const showModal = () => setIsModalVisible(true);
//   const handleCancel = () => {
//     setIsModalVisible(false);
//     form.resetFields();
//   };

//   const handleOk = async () => {
//     try {
//       const values = await form.validateFields();
//       const file = values.avatar?.file.originFileObj;
//       let avatarURL = "";

//       if (file) {
//         const storageRef = ref(storage, `avatars/${file.name}`);
//         await uploadBytes(storageRef, file);
//         avatarURL = await getDownloadURL(storageRef);
//       }

//       const newDeal = { ...values, avatar: avatarURL, status: "new", userId: user?.email };
//       const docRef = await addDoc(collection(db, "sales_pipeline"), newDeal);
//       setDeals([...deals, { id: docRef.id, ...newDeal }]);
//       handleCancel();
//     } catch (error) {
//       console.error("Failed to add deal: ", error);
//     }
//   };

//   return (
//     <div style={{ padding: "20px", background: "#f3f4f6" }}>
//       <Row gutter={[32, 32]}>
//         {statusList.map((status) => (
//           <Col key={status} xs={24} sm={12} xl={4}>
//             <div
//               style={{ padding: "20px", background: "white", borderRadius: "10px", boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)" }}
//               onDragOver={(e) => e.preventDefault()}
//               onDrop={(e) => handleDrop(e, status)}
//             >
//               <h3>{status.toUpperCase()}</h3>
//               {deals.filter((deal) => deal.status === status).length > 0 ? (
//                 deals.filter((deal) => deal.status === status).map((deal) => (
//                   <div
//                     key={deal.id}
//                     draggable={deal.status !== "won" && deal.status !== "lost"}
//                     onDragStart={(e) => handleDragStart(e, deal)}
//                     style={{ padding: "10px", margin: "10px 0", border: "1px solid #ddd", borderRadius: "5px", cursor: deal.status !== "won" && deal.status !== "lost" ? "grab" : "not-allowed", background: "#e6f7ff" }}
//                   >
//                     {deal.title} - {deal.company} - {deal.owner} - {deal.date}
//                   </div>
//                 ))
//               ) : (
//                 <p>No Deals</p>
//               )}
//               {status === "new" && (
//                 <Button type="dashed" style={{ marginTop: "10px" }} onClick={showModal}>
//                   + Add New Deal
//                 </Button>
//               )}
//             </div>
//           </Col>
//         ))}
//       </Row>

//       <Modal title="Add New Deal" visible={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
//         <Form form={form} layout="vertical">
//           <Form.Item name="title" label="Title" rules={[{ required: true, message: "Please enter deal title" }]}> 
//             <Input placeholder="Enter Title" />
//           </Form.Item>
//           <Form.Item name="company" label="Company" rules={[{ required: true, message: "Please select company" }]}> 
//             <Select placeholder="Select Company">
//               {contacts.map((contact) => (
//                 <Select.Option key={contact.id} value={contact.company}>{contact.company}</Select.Option>
//               ))}
//             </Select>
//           </Form.Item>
//           <Form.Item name="owner" label="Owner" rules={[{ required: true, message: "Please select owner" }]}> 
//             <Select placeholder="Select Owner">
//               {owners.map((owner) => (
//                 <Select.Option key={owner.id} value={owner.name}>{owner.name}</Select.Option>
//               ))}
//             </Select>
//           </Form.Item>
//           <Form.Item name="date" label="Date" rules={[{ required: true, message: "Please select date" }]}> 
//             <DatePicker style={{ width: "100%" }} />
//           </Form.Item>
//           <Form.Item name="avatar" label="Upload Avatar">
//             <Upload beforeUpload={() => false} listType="picture">
//               <Button icon={<UploadOutlined />}>Upload Avatar</Button>
//             </Upload>
//           </Form.Item>
//         </Form>
//       </Modal>
//     </div>
//   );
// };

import { useEffect, useState, useMemo } from "react";
import { db } from "../../firebase/firebase";
import { collection, getDocs, updateDoc, doc, addDoc } from "firebase/firestore";
import { Col, Row, Button, Input, Modal, Form, Select, message, Spin } from "antd";
import { useGetIdentity } from "@refinedev/core";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

export const SalesPipeline = () => {
  const [deals, setDeals] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const { data: user } = useGetIdentity();
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!user?.email) return;
      try {
        const dealsSnapshot = await getDocs(collection(db, "sales_pipeline"));
        const companiesSnapshot = await getDocs(collection(db, "company"));

        const dealsData = dealsSnapshot.docs
          .map((doc) => ({ id: doc.id, ...doc.data() }))
          .filter((deal) => deal.userId === user.email);

        const companiesData = companiesSnapshot.docs
          .map((doc) => ({ id: doc.id, ...doc.data() }))
          .filter((company) => company.userId === user.email);

        setDeals(dealsData);
        setCompanies(companiesData);
      } catch (error) {
        console.error("Error fetching data: ", error);
        message.error("Failed to fetch data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  const statusList = ["new", "follow-up", "under review", "demo", "won", "lost"];

  const onDragEnd = async (result) => {
    if (!result.destination) return;

    const { draggableId, destination } = result;
    const draggedDeal = deals.find((deal) => deal.id === draggableId);
    if (!draggedDeal || draggedDeal.status === destination.droppableId) return;

    try {
      const updatedDeals = deals.map((deal) =>
        deal.id === draggableId ? { ...deal, status: destination.droppableId } : deal
      );
      setDeals(updatedDeals);
      await updateDoc(doc(db, "sales_pipeline", draggableId), { status: destination.droppableId });
      message.success("Deal Updated Successfully!");
    } catch (error) {
      console.error("Failed to update deal: ", error);
      message.error("Failed to update deal");
    }
  };

  const showModal = () => setIsModalVisible(true);
  const handleCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
  };

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      const selectedCompany = companies.find((company) => company.id === values.company);
      if (!selectedCompany) return message.error("Invalid Company Selected");

      const newDeal = {
        title: values.title,
        company: selectedCompany.name,
        amount: parseFloat(values.amount),
        status: "new",
        userId: user.email
      };

      const docRef = await addDoc(collection(db, "sales_pipeline"), newDeal);
      setDeals([...deals, { id: docRef.id, ...newDeal }]);
      message.success("Deal Added Successfully!");
      handleCancel();
    } catch (error) {
      console.error("Failed to add deal: ", error);
      message.error("Failed to add deal");
    }
  };

  const pieData = useMemo(() => [
    { name: "Won Deals", value: deals.filter((deal) => deal.status === "won").length },
    { name: "Lost Deals", value: deals.filter((deal) => deal.status === "lost").length }
  ], [deals]);

  const COLORS = ["#0088FE", "#FF8042"];

  if (loading) return <Spin size="large" style={{ display: "block", margin: "100px auto" }} />;

  return (
    <div style={{ padding: "20px", background: "#f3f4f6" }}>
      <Button type="primary" onClick={showModal} style={{ marginBottom: "20px" }}>+ Add New Deal</Button>
      <Modal title="Add New Deal" open={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
        <Form form={form} layout="vertical">
          <Form.Item name="title" label="Title" rules={[{ required: true }]}> <Input placeholder="Enter Title" /> </Form.Item>
          <Form.Item name="amount" label="Amount" rules={[{ required: true }]}> <Input placeholder="Enter Amount" type="number" /> </Form.Item>
          <Form.Item name="company" label="Company" rules={[{ required: true }]}> 
            <Select placeholder="Select Company">
              {companies.map((company) => ( <Select.Option key={company.id} value={company.id}>{company.name}</Select.Option> ))}
            </Select>
          </Form.Item>
        </Form>
      </Modal>

      <DragDropContext onDragEnd={onDragEnd}>
        <Row gutter={16}>
          {statusList.map((status) => (
            <Col span={4} key={status}>
              <h3>{status.toUpperCase()}</h3>
              <Droppable droppableId={status}>
                {(provided) => (
                  <div ref={provided.innerRef} {...provided.droppableProps} style={{ minHeight: "200px", padding: "10px", background: "#e8e8e8" }}>
                    {deals.filter((deal) => deal.status === status).map((deal, index) => (
                      <Draggable key={deal.id} draggableId={deal.id} index={index}>
                        {(provided) => (
                          <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps} style={{ margin: "10px 0", padding: "10px", background: "#fff", borderRadius: "5px" }}>
                            {deal.title} - {deal.company} - ₹{deal.amount}
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </Col>
          ))}
        </Row>
      </DragDropContext>

      <PieChart width={400} height={400}>
        <Pie data={pieData} cx={200} cy={200} outerRadius={100} dataKey="value" label>
          {pieData.map((entry, index) => <Cell key={index} fill={COLORS[index % COLORS.length]} />)}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </div>
  );
};
 