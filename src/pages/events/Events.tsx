
import { CalendarOutlined } from "@ant-design/icons";
import { Badge, Card, List, Button, Modal, Form, Input, message, Row, Col, Select, TimePicker } from "antd";
import React, { useEffect, useState } from "react";
import { db, auth } from "@/firebase/firebase";
import { collection, query, where, getDocs, addDoc, deleteDoc, doc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { useGetIdentity } from "@refinedev/core";
import { Calendar } from "antd";
import dayjs from "dayjs";
import { Text } from "@/components/text";

interface EventType {
  id: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
  userId: string;
  color: string;
}

const UpcomingEvents: React.FC = () => {
  const [events, setEvents] = useState<EventType[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();
  const { data: user } = useGetIdentity<{ email: string }>();
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserId(user.uid);
        fetchEvents(user.uid);
      }
    });
  }, []);

  const fetchEvents = async (userId: string) => {
    setIsLoading(true);
    try {
      const q = query(collection(db, "events"), where("userId", "==", userId));
      const querySnapshot = await getDocs(q);
      const filteredEvents: EventType[] = querySnapshot.docs
        .map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as EventType[];

      setEvents(filteredEvents);
    } catch (error) {
      console.error("Error fetching events:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddEvent = async () => {
    const values = await form.validateFields();
    const newEvent = {
      ...values,
      startTime: values.startTime.format("HH:mm"),
      endTime: values.endTime.format("HH:mm"),
      userId: userId,
      color: values.color || "blue",
    };
    await addDoc(collection(db, "events"), newEvent);
    message.success("Event Added!");
    setIsModalOpen(false);
    fetchEvents(userId!);
    form.resetFields();
  };

  const handleDelete = async (id: string) => {
    await deleteDoc(doc(db, "events", id));
    message.success("Event Deleted!");
    fetchEvents(userId!);
  };

  const dateCellRender = (value: any) => {
    const formattedDate = value.format("YYYY-MM-DD");
  
    const dayEvents = events.filter((event) => {
      return formattedDate >= event.startDate && formattedDate <= event.endDate;
    });
  
    return (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
        {dayEvents.map((event) => (
          <Badge
            key={event.id}
            color={event.color || "blue"}
            text={<Text strong>{event.title}</Text>}
            style={{
              margin: "4px 0",
              padding: "4px 8px",
              borderRadius: "4px",
              background: "transparent",
              color: "#000",
            }}
            dot
          />
        ))}
      </div>
    );
  };
  

  return (
    <Row gutter={16}>
      <Col span={16}>
        <Card title={<><CalendarOutlined /> Calendar</>}>
          <Calendar dateCellRender={dateCellRender} />
        </Card>
      </Col>
      <Col span={8}>
        <Card
          title={<Text size="sm">Upcoming Events</Text>}
          extra={<Button type="primary" onClick={() => setIsModalOpen(true)}>+ Add Event</Button>}
        >
          <Modal
            title="Add Event"
            visible={isModalOpen}
            onCancel={() => setIsModalOpen(false)}
            onOk={handleAddEvent}
          >
            <Form form={form} layout="vertical">
              <Form.Item name="title" label="Event Title" rules={[{ required: true }]}>
                <Input />
              </Form.Item>
              <Form.Item name="description" label="Description">
                <Input.TextArea />
              </Form.Item>
              <Form.Item name="startDate" label="Start Date" rules={[{ required: true }]}>
                <Input type="date" />
              </Form.Item>
              <Form.Item name="endDate" label="End Date" rules={[{ required: true }]}>
                <Input type="date" />
              </Form.Item>
              <Form.Item name="startTime" label="Start Time" rules={[{ required: true }]}>
                <TimePicker format="HH:mm" />
              </Form.Item>
              <Form.Item name="endTime" label="End Time" rules={[{ required: true }]}>
                <TimePicker format="HH:mm" />
              </Form.Item>
              <Form.Item name="color" label="Select Event Color" rules={[{ required: true }]}>
                <Select
                  placeholder="Choose a color"
                  options={[
                    { label: "Red (Critical)", value: "red" },
                    { label: "Orange (High Priority)", value: "orange" },
                    { label: "Green (Normal)", value: "green" },
                    { label: "Blue (Info)", value: "blue" },
                    { label: "Purple (Review)", value: "purple" },
                    { label: "Gray (Low Priority)", value: "gray" },
                  ]}
                />
              </Form.Item>
            </Form>
          </Modal>
          {isLoading ? (
            <p>Loading events...</p>
          ) : events.length > 0 ? (
            <List
              itemLayout="horizontal"
              dataSource={events}
              renderItem={(item) => (
                <List.Item>
                  <List.Item.Meta
                    avatar={<Badge color={item.color || "blue"} />}
                    title={<Text size="xs">{item.startDate} - {item.endDate}</Text>}
                    description={<Text ellipsis={{ tooltip: true }} strong>{item.title} ({item.startTime} - {item.endTime})</Text>} // ✅ Time Visible Here
                  />
                  <Button danger size="small" onClick={() => handleDelete(item.id)}>
                    Delete
                  </Button>
                </List.Item>
              )}
            />
          ) : (
            <div style={{ textAlign: "center", padding: "15px" }}>No Upcoming Events</div>
          )}
        </Card>
      </Col>
    </Row>
  );
};

export default UpcomingEvents;  