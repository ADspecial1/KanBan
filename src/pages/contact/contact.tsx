// import React, { useEffect, useState } from "react";
// import { fetchContacts } from "@/firebase/fetchData";
// import { addData, updateData, deleteData } from "@/firebase/firebase";

// // Add Data
// const handleAddContact = async () => {
//   await addData("contacts", {
//     name: "Salman Bhai",
//     email: "bhai@bhai.com",
//     phone: "9999999999",
//   });
// };


// const Contacts = () => {
//   const [contacts, setContacts] = useState<any[]>([]); // TypeScript hai toh `<any[]>` dena hai

//   useEffect(() => {
//     const getContacts = async () => {
//       const data = await fetchContacts();
//       console.log("🔥 Contacts Data:", data);
//       setContacts(data);
//     };

//     getContacts();
//   }, []);

//   return (
//     <>
//       <h1>Contacts</h1>
//       {contacts.length === 0 ? (
//         <p>No Contacts Found</p>
//       ) : (
//         contacts.map((contact, index) => (
//           <div key={contact.id || index}> {/* Index diya extra backup ke liye */}
//             <h3>{contact.name}</h3>
//             <p>{contact.email}</p>
//             <p>{contact.phone}</p>
//           </div>
//         ))
//       )}
//     </>
//   );
// };

// export default Contacts;

// import React, { useEffect, useState } from "react";
// import { getDocs, collection } from "firebase/firestore";
// import { db } from "@/firebase/firebase";
// import { Table, Button, Modal, Input } from "antd";
// import type { ColumnsType } from "antd/es/table";


// const Contacts = () => {
//   const [contacts, setContacts] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     fetchContacts();
//   }, []);

//   const fetchContacts = async () => {
//     const querySnapshot = await getDocs(collection(db, "contacts"));
//     const data: Contact[] = querySnapshot.docs.map((doc) => ({
//       id: doc.id,
//       ...(doc.data() as Contact), // Yeh type-casting hai bhai 🔥
//     }));
//     setContacts(data);
//     setLoading(false);
//   };
  

//   const columns: ColumnsType<Contact> = [
//     {
//       title: "Name",
//       dataIndex: "name",
//       key: "name",
//     },
//     {
//       title: "Email",
//       dataIndex: "email",
//       key: "email",
//     },
//     {
//       title: "Phone",
//       dataIndex: "phone",
//       key: "phone",
//     },
//     {
//       title: "Actions",
//       render: (_: any, record: Contact) => (
//         <>
//           <Button type="primary" style={{ marginRight: "10px" }}>
//             Edit
//           </Button>
//           <Button type="primary" danger>
//             Delete
//           </Button>
//         </>
//       ),
//     },
//   ];
  

//   return (
//     <div>
//       <h1>Contacts</h1>
//       <Table
//         columns={columns}
//         dataSource={contacts}
//         loading={loading}
//         rowKey="id"
//       />
//     </div>
//   );
// };

// export default Contacts;

// import React, { useEffect, useState } from "react";
// import { Table, Button } from "antd";
// import type { ColumnsType } from "antd/es/table";
// import { collection, getDocs } from "firebase/firestore";
// import { db } from "@/firebase/firebase";

// // Type define kar
// type Contact = {
//   id: string;
//   name: string;
//   gmail: string;
//   phone: string;
// };

// const Contacts = () => {
//   const [contacts, setContacts] = useState<Contact[]>([]);
//   const [loading, setLoading] = useState<boolean>(true);

//   const fetchContacts = async () => {
//     const querySnapshot = await getDocs(collection(db, "contacts"));
//     const data: Contact[] = querySnapshot.docs.map((doc) => {
//       const contact = doc.data() as Contact; // Yeh proper type-casting hai
//       return {
//         id: doc.id, // Yeh ID ko alag se assign kar raha hai
//         name: contact.name,
//         gmail: contact.gmail, // Firebase me agar "gmail" hai toh yeh dal
//         phone: contact.phone,
//       };
//     });
  
//     console.log("Contacts Data:", data); // Console check karne ke liye 🔥
//     setContacts(data);
//     setLoading(false);
//   };
  
  

//   useEffect(() => {
//     fetchContacts();
//   }, []);

//   const columns: ColumnsType<Contact> = [
//     {
//       title: "Name",
//       dataIndex: "name",
//       key: "name",
//     },
//     {
//       title: "Email",
//       dataIndex: "gmail",
//       key: "email",
//     },
//     {
//       title: "Phone",
//       dataIndex: "phone",
//       key: "phone",
//     },
//     {
//       title: "Actions",
//       render: (_: any, record: Contact) => (
//         <>
//           <Button type="primary" style={{ marginRight: "10px" }}>
//             Edit
//           </Button>
//           <Button type="primary" danger>
//             Delete
//           </Button>
//         </>
//       ),
//     },
//   ];

//   return (
//     <>
//       <h1>All Contacts 🔥</h1>
//       <Table
//         dataSource={contacts}
//         columns={columns}
//         rowKey="id"
//         loading={loading}
//       />
//     </>
//   );
// };

// export default Contacts;

import React, { useEffect, useState } from "react";
import { Table, Button, message, Modal, Form, Input } from "antd";
import type { ColumnsType } from "antd/es/table";
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from "firebase/firestore";
import { db } from "@/firebase/firebase";

// Type define kar
type Contact = {
  id: string;
  name: string;
  gmail: string;
  phone: string;
};

const Contacts = () => {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingContact, setEditingContact] = useState<Contact | null>(null);
  const [form] = Form.useForm();

  const fetchContacts = async () => {
    const querySnapshot = await getDocs(collection(db, "contacts"));
    const data: Contact[] = querySnapshot.docs.map((doc) => {
      const contact = doc.data() as Contact;
      return {
        id: doc.id,
        name: contact.name,
        gmail: contact.gmail,
        phone: contact.phone,
      };
    });
    setContacts(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  const showModal = (contact?: Contact) => {
    setIsModalOpen(true);
    if (contact) {
      setEditingContact(contact);
      form.setFieldsValue(contact);
    } else {
      setEditingContact(null);
      form.resetFields();
    }
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    form.resetFields();
  };

  const handleOk = async () => {
    const values = await form.validateFields();
    setIsModalOpen(false);

    if (editingContact) {
      await updateDoc(doc(db, "contacts", editingContact.id), values);
      message.success("Contact Updated Successfully!");
    } else {
      await addDoc(collection(db, "contacts"), values);
      message.success("Contact Added Successfully!");
    }
    fetchContacts();
  };

  const handleDelete = async (id: string) => {
    await deleteDoc(doc(db, "contacts", id));
    message.success("Contact Deleted Successfully!");
    fetchContacts();
  };

  const columns: ColumnsType<Contact> = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      filterDropdown: ({ setSelectedKeys, selectedKeys, confirm }) => (
        <div style={{ padding: 8 }}>
          <input
            placeholder="Search Name"
            value={selectedKeys[0] as string}
            onChange={(e) =>
              setSelectedKeys(e.target.value ? [e.target.value] : [])
            }
            style={{ marginBottom: 8, display: "block" }}
          />
          <Button type="primary" onClick={() => confirm()} size="small">
            Search
          </Button>
        </div>
      ),
      onFilter: (value, record) =>
        record.name.toLowerCase().includes((value as string).toLowerCase()),
    },
    {
      title: "Email",
      dataIndex: "gmail",
      key: "email",
      filterSearch: true,
      onFilter: (value, record) =>
        record.gmail.toLowerCase().includes((value as string).toLowerCase()),
      filters: contacts.map((contact) => ({
        text: contact.gmail,
        value: contact.gmail,
      })),
    },
    {
      title: "Phone",
      dataIndex: "phone",
      key: "phone",
    },
    {
      title: "Actions",
      render: (_: any, record: Contact) => (
        <>
          <Button
            type="primary"
            style={{ marginRight: "10px" }}
            onClick={() => showModal(record)}
          >
            Edit
          </Button>
          <Button
            type="primary"
            danger
            onClick={() => handleDelete(record.id)}
          >
            Delete
          </Button>
        </>
      ),
    },
  ];

  return (
    <>
      <h1>All Contacts 🔥</h1>
      <Button type="primary" onClick={() => showModal()} style={{ marginBottom: "10px" }}>
        Add Contact
      </Button>
      <Table dataSource={contacts} columns={columns} rowKey="id" loading={loading} />

      <Modal
        title={editingContact ? "Edit Contact" : "Add Contact"}
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Form form={form} layout="vertical">
          <Form.Item name="name" label="Name" rules={[{ required: true }]}> 
            <Input placeholder="Enter Name" />
          </Form.Item>
          <Form.Item name="gmail" label="Email" rules={[{ required: true }]}> 
            <Input placeholder="Enter Email" />
          </Form.Item>
          <Form.Item name="phone" label="Phone" rules={[{ required: true }]}> 
            <Input placeholder="Enter Phone Number" />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default Contacts;
