
// import { useEffect, useState } from "react";
// import { Table, Button, message, Modal, Form, Input } from "antd";
// import type { ColumnsType } from "antd/es/table";
// import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from "firebase/firestore";
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
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [editingContact, setEditingContact] = useState<Contact | null>(null);
//   const [form] = Form.useForm();

//   const fetchContacts = async () => {
//     const querySnapshot = await getDocs(collection(db, "contacts"));
//     const data: Contact[] = querySnapshot.docs.map((doc) => {
//       const contact = doc.data() as Contact;
//       return {
//         id: doc.id,
//         name: contact.name,
//         gmail: contact.gmail,
//         phone: contact.phone,
//       };
//     });
//     setContacts(data);
//     setLoading(false);
//   };

//   useEffect(() => {
//     fetchContacts();
//   }, []);

//   const showModal = (contact?: Contact) => {
//     setIsModalOpen(true);
//     if (contact) {
//       setEditingContact(contact);
//       form.setFieldsValue(contact);
//     } else {
//       setEditingContact(null);
//       form.resetFields();
//     }
//   };

//   const handleCancel = () => {
//     setIsModalOpen(false);
//     form.resetFields();
//   };

//   const handleOk = async () => {
//     const values = await form.validateFields();
//     setIsModalOpen(false);

//     if (editingContact) {
//       await updateDoc(doc(db, "contacts", editingContact.id), values);
//       message.success("Contact Updated Successfully!");
//     } else {
//       await addDoc(collection(db, "contacts"), values);
//       message.success("Contact Added Successfully!");
//     }
//     fetchContacts();
//   };

//   const handleDelete = async (id: string) => {
//     await deleteDoc(doc(db, "contacts", id));
//     message.success("Contact Deleted Successfully!");
//     fetchContacts();
//   };

//   const columns: ColumnsType<Contact> = [
//     {
//       title: "Name",
//       dataIndex: "name",
//       key: "name",
//       filterDropdown: ({ setSelectedKeys, selectedKeys, confirm }) => (
//         <div style={{ padding: 8 }}>
//           <input
//             placeholder="Search Name"
//             value={selectedKeys[0] as string}
//             onChange={(e) =>
//               setSelectedKeys(e.target.value ? [e.target.value] : [])
//             }
//             style={{ marginBottom: 8, display: "block" }}
//           />
//           <Button type="primary" onClick={() => confirm()} size="small">
//             Search
//           </Button>
//         </div>
//       ),
//       onFilter: (value, record) =>
//         record.name.toLowerCase().includes((value as string).toLowerCase()),
//     },
//     {
//       title: "Email",
//       dataIndex: "gmail",
//       key: "email",
//       filterSearch: true,
//       onFilter: (value, record) =>
//         record.gmail.toLowerCase().includes((value as string).toLowerCase()),
//       filters: contacts.map((contact) => ({
//         text: contact.gmail,
//         value: contact.gmail,
//       })),
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
//           <Button
//             type="primary"
//             style={{ marginRight: "10px" }}
//             onClick={() => showModal(record)}
//           >
//             Edit
//           </Button>
//           <Button
//             type="primary"
//             danger
//             onClick={() => handleDelete(record.id)}
//           >
//             Delete
//           </Button>
//         </>
//       ),
//     },
//   ];

//   return (
//     <>
//       <h1>All Contacts 🔥</h1>
//       <Button type="primary" onClick={() => showModal()} style={{ marginBottom: "10px" }}>
//         Add Contact
//       </Button>
//       <Table dataSource={contacts} columns={columns} rowKey="id" loading={loading} />

//       <Modal
//         title={editingContact ? "Edit Contact" : "Add Contact"}
//         open={isModalOpen}
//         onOk={handleOk}
//         onCancel={handleCancel}
//       >
//         <Form form={form} layout="vertical">
//           <Form.Item name="name" label="Name" rules={[{ required: true }]}> 
//             <Input placeholder="Enter Name" />
//           </Form.Item>
//           <Form.Item name="gmail" label="Email" rules={[{ required: true }]}> 
//             <Input placeholder="Enter Email" />
//           </Form.Item>
//           <Form.Item name="phone" label="Phone" rules={[{ required: true }]}> 
//             <Input placeholder="Enter Phone Number" />
//           </Form.Item>
//         </Form>
//       </Modal>
//     </>
//   );
// };

// export default Contacts;



// import { useEffect, useState } from "react";
// import { Table, Button, message, Modal, Form, Input } from "antd";
// import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, query, where } from "firebase/firestore";
// import { db } from "@/firebase/firebase";
// import { getAuth } from "firebase/auth";

// type Contact = {
//   id: string;
//   name: string;
//   gmail: string;
//   phone: string;
// };

// const Contacts = () => {
//   const [contacts, setContacts] = useState<Contact[]>([]);
//   const [loading, setLoading] = useState<boolean>(true);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [editingContact, setEditingContact] = useState<Contact | null>(null);
//   const [form] = Form.useForm();

//   const fetchContacts = async () => {
//     const user = getAuth().currentUser;
//     if (!user) {
//       message.error("You must be logged in to view contacts.");
//       setLoading(false);
//       return;
//     }

//     const userId = user.uid; 
//     const q = query(collection(db, "contacts"), where("userId", "==", userId));

//     try {
//       const querySnapshot = await getDocs(q);
//       const data: Contact[] = querySnapshot.docs.map((doc) => {
//         const contact = doc.data() as Contact;
//         return {
//           id: doc.id,
//           name: contact.name,
//           gmail: contact.gmail,
//           phone: contact.phone,
//         };
//       });
//       setContacts(data);
//     } catch (error:any) {
//       message.error("Failed to fetch contacts: " + error.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchContacts();
//   }, []); // Fetch contacts once when the component mounts

//   const showModal = (contact?: Contact) => {
//     setIsModalOpen(true);
//     if (contact) {
//       setEditingContact(contact);
//       form.setFieldsValue(contact);
//     } else {
//       setEditingContact(null);
//       form.resetFields();
//     }
//   };

//   const handleCancel = () => {
//     setIsModalOpen(false);
//     form.resetFields();
//   };

//   const handleOk = async () => {
//     const values = await form.validateFields();
//     const userId = getAuth().currentUser?.uid; // Get logged-in user ID
//     if (!userId) return; // Exit if no user is logged in

//     setIsModalOpen(false);

//     const contactData = { ...values, userId }; // Add userId to the contact data

//     if (editingContact) {
//       await updateDoc(doc(db, "contacts", editingContact.id), contactData);
//       message.success("Contact Updated Successfully!");
//     } else {
//       await addDoc(collection(db, "contacts"), contactData);
//       message.success("Contact Added Successfully!");
//     }

//     fetchContacts(); // Fetch updated contacts
//   };

//   const handleDelete = async (id: string) => {
//     await deleteDoc(doc(db, "contacts", id));
//     message.success("Contact Deleted Successfully!");
//     fetchContacts(); // Fetch updated contacts after deletion
//   };

//   const columns = [
//     {
//       title: "Name",
//       dataIndex: "name",
//       key: "name",
//     },
//     {
//       title: "Email",
//       dataIndex: "gmail",
//       key: "gmail",
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
//           <Button
//             type="primary"
//             style={{ marginRight: "10px" }}
//             onClick={() => showModal(record)}
//           >
//             Edit
//           </Button>
//           <Button
//             type="primary"
//             danger
//             onClick={() => handleDelete(record.id)}
//           >
//             Delete
//           </Button>
//         </>
//       ),
//     },
//   ];

//   return (
//     <>
//       <h1>All Contacts 🔥</h1>
//       <Button type="primary" onClick={() => showModal()} style={{ marginBottom: "10px" }}>
//         Add Contact
//       </Button>
//       <Table dataSource={contacts} columns={columns} rowKey="id" loading={loading} />

//       <Modal
//         title={editingContact ? "Edit Contact" : "Add Contact"}
//         open={isModalOpen}
//         onOk={handleOk}
//         onCancel={handleCancel}
//       >
//         <Form form={form} layout="vertical">
//           <Form.Item name="name" label="Name" rules={[{ required: true }]}>
//             <Input placeholder="Enter Name" />
//           </Form.Item>
//           <Form.Item name="gmail" label="Email" rules={[{ required: true }]}>
//             <Input placeholder="Enter Email" />
//           </Form.Item>
//           <Form.Item name="phone" label="Phone" rules={[{ required: true }]}>
//             <Input placeholder="Enter Phone Number" />
//           </Form.Item>
//         </Form>
//       </Modal>
//     </>
//   );
// };

// export default Contacts;

import { useEffect, useState } from "react";
import { Table, Button, message, Modal, Form, Input, Select } from "antd";
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  where,
} from "firebase/firestore";
import { db } from "@/firebase/firebase";
import { getAuth } from "firebase/auth";

const { Option } = Select;

type Contact = {
  id: string;
  name: string;
  gmail: string;
  phone: string;
  company: string;
};

type Company = {
  id: string;
  name: string;
};

const Contacts = () => {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [companyLoading, setCompanyLoading] = useState<boolean>(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingContact, setEditingContact] = useState<Contact | null>(null);
  const [form] = Form.useForm();

  const fetchContacts = async () => {
    const user = getAuth().currentUser;
    if (!user) {
      message.error("You must be logged in to view contacts.");
      setLoading(false);
      return;
    }

    const userId = user.uid;
    const q = query(collection(db, "contacts"), where("userId", "==", userId));

    try {
      const querySnapshot = await getDocs(q);
      const data: Contact[] = querySnapshot.docs.map((doc) => {
        const contact = doc.data() as Contact;
        return {
          id: doc.id,
          name: contact.name,
          gmail: contact.gmail,
          phone: contact.phone,
          company: contact.company,
        };
      });
      setContacts(data);
    } catch (error: any) {
      message.error("Failed to fetch contacts: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchCompanies = async () => {
    const user = getAuth().currentUser;
    if (!user) return;

    const q = query(collection(db, "companies"), where("userId", "==", user.uid));
    const snapshot = await getDocs(q);
    const fetchedCompanies = snapshot.docs.map((doc) => ({
      id: doc.id,
      name: doc.data().name,
    }));

    setCompanies(fetchedCompanies);
    setCompanyLoading(false);
  };

  useEffect(() => {
    fetchContacts();
    fetchCompanies();
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
    const userId = getAuth().currentUser?.uid;
    if (!userId) return;

    setIsModalOpen(false);
    const contactData = { ...values, userId };

    if (editingContact) {
      await updateDoc(doc(db, "contacts", editingContact.id), contactData);
      message.success("Contact Updated Successfully!");
    } else {
      await addDoc(collection(db, "contacts"), contactData);
      message.success("Contact Added Successfully!");
    }

    fetchContacts();
  };

  const handleDelete = async (id: string) => {
    await deleteDoc(doc(db, "contacts", id));
    message.success("Contact Deleted Successfully!");
    fetchContacts();
  };

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Email",
      dataIndex: "gmail",
      key: "gmail",
    },
    {
      title: "Phone",
      dataIndex: "phone",
      key: "phone",
    },
    {
      title: "Company",
      dataIndex: "company",
      key: "company",
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
          <Button type="primary" danger onClick={() => handleDelete(record.id)}>
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
          <Form.Item
            name="gmail"
            label="Email"
            rules={[{ required: true, message: "Email is required" }, { type: "email", message: "Invalid email format" }]}
          >
            <Input placeholder="Enter Email" />
          </Form.Item>
          <Form.Item
            name="phone"
            label="Phone"
            rules={[{ required: true, message: "Phone is required" }, { pattern: /^\d{10}$/, message: "Phone number must be exactly 10 digits" }]}
          >
            <Input placeholder="Enter 10-digit Phone Number" />
          </Form.Item>
          <Form.Item
            name="company"
            label="Company"
            rules={[{ required: true, message: "Please select or enter a company name!" }]}
          >
            <Select
              placeholder="Select or Add Company"
              loading={companyLoading}
              showSearch
              optionFilterProp="children"
              dropdownRender={(menu) => (
                <>
                  {menu}
                  <div style={{ display: "flex", padding: 8 }}>
                    <Input
                      placeholder="Add new company"
                      onPressEnter={(e) => {
                        const newCompany = (e.target as HTMLInputElement).value;
                        if (newCompany) {
                          const userId = getAuth().currentUser?.uid;
                          if (!userId) return;
                          const newComp = { name: newCompany, userId };
                          addDoc(collection(db, "companies"), newComp).then(() => {
                            message.success("New company added!");
                            fetchCompanies();
                            form.setFieldsValue({ company: newCompany });
                          });
                        }
                      }}
                    />
                  </div>
                </>
              )}
            >
              {companies.map((comp) => (
                <Option key={comp.id} value={comp.name}>
                  {comp.name}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default Contacts;
