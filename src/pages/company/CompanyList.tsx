import { useState, useEffect } from "react";
import {
  Card,
  Button,
  message,
  Modal,
  Form,
  Input,
  Select,
  Row,
  Col,
  Dropdown,
  Menu,
  Divider,
  Tag,
} from "antd";
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  where,
  getDoc,
} from "firebase/firestore";
import { db } from "@/firebase/firebase";
import { getAuth } from "firebase/auth";
import { EllipsisOutlined } from "@ant-design/icons";

type Contact = {
  id: string;
  name: string;
  phone?: string;
  email?: string;
  companies?: string[]; // Array of company IDs associated with this contact
};

type Company = {
  id: string;
  name: string;
  member: string;
  logo?: string;
};

const Companies = () => {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCompany, setEditingCompany] = useState<Company | null>(null);
  const [form] = Form.useForm();
  const [isAddContactModalOpen, setIsAddContactModalOpen] = useState(false);
  const [newContactName, setNewContactName] = useState("");
  const [newContactPhone, setNewContactPhone] = useState("");
  const [newContactEmail, setNewContactEmail] = useState("");
  const [pendingCompanyData, setPendingCompanyData] = useState<any>(null);
  const [newContactNameInline, setNewContactNameInline] = useState("");
  const [newContactPhoneInline, setNewContactPhoneInline] = useState("");
  const [showInlinePhoneInput, setShowInlinePhoneInput] = useState(false);
  const [viewingContactDetails, setViewingContactDetails] = useState(false);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);

  const userId = getAuth().currentUser?.uid;

  // Fetch contacts with their associated companies
  const fetchContacts = async () => {
    if (!userId) return;

    const q = query(collection(db, "contacts"), where("userId", "==", userId));
    const querySnapshot = await getDocs(q);
    const contactList = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      name: doc.data().name,
      phone: doc.data().phone || "",
      email: doc.data().email || "",
      companies: doc.data().companies || [],
    }));
    setContacts(contactList);
  };

  // Fetch companies
  const fetchCompanies = async () => {
    if (!userId) return;

    const q = query(collection(db, "companies"), where("userId", "==", userId));
    const querySnapshot = await getDocs(q);
    const companyList = querySnapshot.docs.map((doc) => {
      const data = doc.data() as Company;
      return {
        id: doc.id,
        name: data.name,
        member: data.member,
        logo: data.logo || "",
      };
    });
    setCompanies(companyList);
    setLoading(false);
  };

  // Fetch contacts and companies on userId change
  useEffect(() => {
    fetchContacts();
    fetchCompanies();
  }, [userId]);

  const showModal = (company?: Company) => {
    setIsModalOpen(true);
    if (company) {
      setEditingCompany(company);
      form.setFieldsValue(company);
    } else {
      setEditingCompany(null);
      form.resetFields();
    }
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    form.resetFields();
  };

  const handleOk = async () => {
    const values = await form.validateFields();
    if (!userId) return;

    const contactExists = contacts.some((c) => c.id === values.member);
    if (!contactExists) {
      setPendingCompanyData({ ...values, userId });
      setIsModalOpen(false);
      setIsAddContactModalOpen(true); // Open the "Add New Contact" modal
      return;
    }

    await saveCompany(values, userId);
  };

  const saveCompany = async (values: any, userId: string) => {
    const companyData = { ...values, userId };

    let companyId = "";
    if (editingCompany) {
      companyId = editingCompany.id;
      await updateDoc(doc(db, "companies", companyId), companyData);
      message.success("Company Updated!");
    } else {
      const docRef = await addDoc(collection(db, "companies"), companyData);
      companyId = docRef.id;
      message.success("Company Added!");
    }

    // Update the contact to include this company
    const contactRef = doc(db, "contacts", values.member);
    const contactSnap = await getDoc(contactRef);
    
    if (contactSnap.exists()) {
      const contactData = contactSnap.data();
      const companies = contactData.companies || [];
      
      // Only add the company if it's not already in the list
      if (!companies.includes(companyId)) {
        await updateDoc(contactRef, {
          companies: [...companies, companyId]
        });
      }
    }

    fetchCompanies();
    fetchContacts(); // Refresh contacts to show updated company associations
    setIsModalOpen(false);
  };

  // Handle numeric input for phone fields
  const handlePhoneInput = (e: React.ChangeEvent<HTMLInputElement>, setter: React.Dispatch<React.SetStateAction<string>>) => {
    const value = e.target.value;
    // Only allow numeric inputs
    if (/^\d*$/.test(value)) {
      setter(value);
    }
  };

  const handleAddContact = async () => {
    if (!userId) return;

    if (!newContactName) {
      message.warning("Name is required.");
      return;
    }

    if (!newContactPhone || newContactPhone.length !== 10) {
      message.warning("Phone number must be exactly 10 digits.");
      return;
    }

    const contactData = {
      name: newContactName,
      phone: newContactPhone,
      email: newContactEmail,
      userId,
      companies: [],
    };

    const newContactRef = await addDoc(collection(db, "contacts"), contactData);

    const newContactId = newContactRef.id;
    setContacts((prev) => [...prev, { ...contactData, id: newContactId }]);
    setIsAddContactModalOpen(false);
    setNewContactName("");
    setNewContactPhone("");
    setNewContactEmail("");

    if (pendingCompanyData) {
      pendingCompanyData.member = newContactId;
      await saveCompany(pendingCompanyData, userId);
      setPendingCompanyData(null);
    }
  };

  const handleInlineNameSubmit = () => {
    if (!newContactNameInline.trim()) {
      message.warning("Contact name is required.");
      return;
    }
    
    // Show phone input after entering name
    setShowInlinePhoneInput(true);
  };

  const addNewContactInline = async () => {
    if (!userId) return;

    if (!newContactNameInline) {
      message.warning("Contact name is required.");
      return;
    }

    if (!newContactPhoneInline || newContactPhoneInline.length !== 10) {
      message.warning("Phone number must be exactly 10 digits.");
      return;
    }

    try {
      const contactData = {
        name: newContactNameInline,
        phone: newContactPhoneInline,
        userId,
        companies: [],
      };

      const newContactRef = await addDoc(collection(db, "contacts"), contactData);

      const newContactId = newContactRef.id;
      setContacts((prev) => [...prev, { ...contactData, id: newContactId }]);
      message.success("New contact added!");
      setNewContactNameInline("");
      setNewContactPhoneInline("");
      setShowInlinePhoneInput(false);
      form.setFieldsValue({ member: newContactId });
    } catch (error: any) {
      message.error("Failed to add contact: " + error.message);
    }
  };

  const resetInlineForm = () => {
    setNewContactNameInline("");
    setNewContactPhoneInline("");
    setShowInlinePhoneInput(false);
  };

  const handleDelete = async (id: string) => {
    // Get the company to find which contact it's associated with
    const companySnap = await getDoc(doc(db, "companies", id));
    
    if (companySnap.exists()) {
      const companyData = companySnap.data();
      const memberId = companyData.member;
      
      // Remove company association from the contact
      const contactRef = doc(db, "contacts", memberId);
      const contactSnap = await getDoc(contactRef);
      
      if (contactSnap.exists()) {
        const contactData = contactSnap.data();
        const companies = contactData.companies || [];
        
        await updateDoc(contactRef, {
          companies: companies.filter((companyId: string) => companyId !== id)
        });
      }
    }
    
    // Delete the company
    await deleteDoc(doc(db, "companies", id));
    message.success("Company deleted!");
    fetchCompanies();
    fetchContacts();
  };

  const getContactName = (id: string) => {
    const contact = contacts.find((c) => c.id === id);
    return contact ? contact.name : "Unknown";
  };

  const getCompanyNames = (companyIds: string[]) => {
    return companyIds.map(id => {
      const company = companies.find(c => c.id === id);
      return company ? company.name : "Unknown Company";
    });
  };

  const showContactDetails = (contact: Contact) => {
    setSelectedContact(contact);
    setViewingContactDetails(true);
  };

  // Tab for Contacts
  const ContactsTab = () => (
    <>
      <h2 style={{ fontSize: 20, marginBottom: 16 }}>Your Contacts</h2>
      <Row gutter={[16, 16]}>
        {contacts.map((contact) => (
          <Col xs={24} sm={12} md={8} lg={6} key={contact.id}>
            <Card
              title={contact.name}
              hoverable
              bordered
              style={{ borderRadius: 12, boxShadow: "0 4px 12px rgba(0,0,0,0.08)" }}
              onClick={() => showContactDetails(contact)}
            >
              {contact.phone && <p><strong>Phone:</strong> {contact.phone}</p>}
              {contact.email && <p><strong>Email:</strong> {contact.email}</p>}
              {contact.companies && contact.companies.length > 0 && (
                <div>
                  <strong>Companies:</strong> 
                  <div style={{ marginTop: 8 }}>
                    {getCompanyNames(contact.companies).map((name, idx) => (
                      <Tag 
                        color="blue" 
                        key={idx} 
                        style={{ marginBottom: 4 }}
                      >
                        {name}
                      </Tag>
                    ))}
                  </div>
                </div>
              )}
            </Card>
          </Col>
        ))}
      </Row>
    </>
  );

  // Tab for Companies
  const CompaniesTab = () => (
    <>
      <h2 style={{ fontSize: 20, marginBottom: 16 }}>Your Companies</h2>
      <Button 
        type="primary" 
        onClick={() => showModal()} 
        style={{ marginBottom: 20 }}
      >
        Add Company
      </Button>

      <Row gutter={[16, 16]}>
        {companies.map((company) => (
          <Col xs={24} sm={12} md={8} lg={6} key={company.id}>
            <Card
              title={
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  {company.logo ? (
                    <img
                      src={company.logo}
                      alt="logo"
                      style={{
                        width: 32,
                        height: 32,
                        borderRadius: "50%",
                        objectFit: "cover",
                      }}
                    />
                  ) : (
                    <div
                      style={{
                        width: 32,
                        height: 32,
                        borderRadius: "50%",
                        backgroundColor: "#ccc",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontWeight: "bold",
                        color: "#fff",
                      }}
                    >
                      {company.name.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <span>{company.name}</span>
                </div>
              }
              extra={
                <Dropdown
                  overlay={
                    <Menu>
                      <Menu.Item onClick={() => showModal(company)}>Edit</Menu.Item>
                      <Menu.Item danger onClick={() => handleDelete(company.id)}>
                        Delete
                      </Menu.Item>
                    </Menu>
                  }
                  trigger={["click"]}
                >
                  <EllipsisOutlined style={{ fontSize: 20, cursor: "pointer" }} />
                </Dropdown>
              }
              bordered
              style={{ borderRadius: 12, boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}
            >
              <p><strong>Member:</strong> {getContactName(company.member)}</p>
              <p><strong>Company:</strong> {company.name}</p>
            </Card>
          </Col>
        ))}
      </Row>
    </>
  );

  const [activeTab, setActiveTab] = useState('companies');

  return (
    <>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 24, marginBottom: 16 }}>Contact Management</h1>
        <div style={{ display: 'flex', gap: 16 }}>
          <Button 
            type={activeTab === 'companies' ? 'primary' : 'default'} 
            onClick={() => setActiveTab('companies')}
          >
            Companies
          </Button>
          <Button 
            type={activeTab === 'contacts' ? 'primary' : 'default'}
            onClick={() => setActiveTab('contacts')}
          >
            Contacts
          </Button>
        </div>
      </div>

      {activeTab === 'companies' ? <CompaniesTab /> : <ContactsTab />}

      <Modal
        title={editingCompany ? "Edit Company" : "Add Company"}
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Form form={form} layout="vertical">
          <Form.Item name="name" label="Company Name" rules={[{ required: true }]}>
            <Input placeholder="Enter Company Name" />
          </Form.Item>
          <Form.Item name="member" label="Member" rules={[{ required: true }]}>
            <Select
              placeholder="Select a member"
              showSearch
              optionFilterProp="children"
              dropdownRender={(menu) => (
                <>
                  {menu}
                  <Divider style={{ margin: '8px 0' }} />
                  <div style={{ padding: '8px' }}>
                    {!showInlinePhoneInput ? (
                      <div style={{ display: "flex", marginBottom: '8px' }}>
                        <Input
                          placeholder="Add new contact name"
                          value={newContactNameInline}
                          onChange={(e) => setNewContactNameInline(e.target.value)}
                          onPressEnter={handleInlineNameSubmit}
                        />
                        <Button
                          type="primary"
                          onClick={handleInlineNameSubmit}
                          style={{ marginLeft: 8 }}
                        >
                          Next
                        </Button>
                      </div>
                    ) : (
                      <div>
                        <div style={{ marginBottom: '8px' }}>
                          <strong>Name:</strong> {newContactNameInline}
                          <Button 
                            type="link" 
                            size="small" 
                            onClick={() => setShowInlinePhoneInput(false)}
                            style={{ padding: '0 4px' }}
                          >
                            Edit
                          </Button>
                        </div>
                        <div style={{ display: "flex", marginBottom: '8px' }}>
                          <Input
                            placeholder="10-digit Phone Number"
                            value={newContactPhoneInline}
                            onChange={(e) => handlePhoneInput(e, setNewContactPhoneInline)}
                            maxLength={10}
                            type="tel"
                            onPressEnter={addNewContactInline}
                          />
                          <Button
                            type="primary"
                            onClick={addNewContactInline}
                            style={{ marginLeft: 8 }}
                          >
                            Add
                          </Button>
                          <Button
                            onClick={resetInlineForm}
                            style={{ marginLeft: 8 }}
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                </>
              )}
            >
              {contacts.length > 0 ? (
                contacts.map((contact) => (
                  <Select.Option key={contact.id} value={contact.id}>
                    {contact.name}
                  </Select.Option>
                ))
              ) : (
                <Select.Option disabled>No contacts available</Select.Option>
              )}
            </Select>
          </Form.Item>
          <Form.Item name="logo" label="Logo URL">
            <Input placeholder="Optional Logo URL" />
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="Add New Contact"
        open={isAddContactModalOpen}
        onOk={handleAddContact}
        onCancel={() => {
          setIsAddContactModalOpen(false);
          setPendingCompanyData(null);
        }}
      >
        <Form layout="vertical">
          <Form.Item label="Name" required>
            <Input
              value={newContactName}
              onChange={(e) => setNewContactName(e.target.value)}
              placeholder="Contact Name"
            />
          </Form.Item>
          <Form.Item label="Phone Number" required>
            <Input
              value={newContactPhone}
              onChange={(e) => handlePhoneInput(e, setNewContactPhone)}
              placeholder="Phone Number"
              maxLength={10}
              minLength={10}
              type="tel"
            />
          </Form.Item>
          <Form.Item label="Email">
            <Input
              value={newContactEmail}
              onChange={(e) => setNewContactEmail(e.target.value)}
              placeholder="Email Address"
              type="email"
            />
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="Contact Details"
        open={viewingContactDetails}
        onCancel={() => setViewingContactDetails(false)}
        footer={[
          <Button key="close" onClick={() => setViewingContactDetails(false)}>
            Close
          </Button>
        ]}
      >
        {selectedContact && (
          <div>
            <h2 style={{ fontSize: 22, marginBottom: 16 }}>{selectedContact.name}</h2>
            
            {selectedContact.phone && (
              <p><strong>Phone:</strong> {selectedContact.phone}</p>
            )}
            
            {selectedContact.email && (
              <p><strong>Email:</strong> {selectedContact.email}</p>
            )}
            
            {selectedContact.companies && selectedContact.companies.length > 0 && (
              <div style={{ marginTop: 16 }}>
                <strong>Associated Companies:</strong>
                <div style={{ marginTop: 8 }}>
                  {getCompanyNames(selectedContact.companies).map((name, idx) => (
                    <Tag color="blue" key={idx} style={{ marginBottom: 4 }}>
                      {name}
                    </Tag>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </Modal>
    </>
  );
};

export default Companies;
