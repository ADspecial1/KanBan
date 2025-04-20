
// import React, { useState, useEffect } from "react";
// import {
//   Card,
//   Col,
//   Row,
//   Button,
//   Modal,
//   Form,
//   Input,
//   Select,
//   DatePicker,
//   message,
// } from "antd";
// import {
//   PlusOutlined,
//   ExclamationCircleOutlined,
//   MoreOutlined,
// } from "@ant-design/icons";
// import { v4 as uuidv4 } from "uuid";
// import dayjs from "dayjs";
// import {
//   DragDropContext,
//   Droppable,
//   Draggable,
//   DropResult,
// } from "@hello-pangea/dnd";
// import {
//   collection,
//   getDocs,
//   addDoc,
//   updateDoc,
//   deleteDoc,
//   doc,
//   query,
//   where,
// } from "firebase/firestore";
// import { db } from "../../firebase/firebase"; // your path here

// type Task = {
//   id: string;
//   title: string;
//   description: string;
//   category: string;
//   dueDate: string;
//   assignedTo: string; // uid of developer
//   assignedToName: string; // display name
//   userId: string; // userId of the creator/assignee
// };

// type Developer = {
//   uid: string;
//   username: string;
// };

// const categoryTitles: Record<string, string> = {
//   backlog: "Backlog",
//   todo: "To Do",
//   inprogress: "In Progress",
//   inreview: "In Review",
//   done: "Done",
// };
// const categories = Object.keys(categoryTitles);

// const KanbanBoard: React.FC = () => {
//   const [tasks, setTasks] = useState<Task[]>([]);
//   const [developers, setDevelopers] = useState<Developer[]>([]);
//   const [isModalVisible, setIsModalVisible] = useState(false);
//   const [editingTask, setEditingTask] = useState<Task | null>(null);
//   const [currentCategory, setCurrentCategory] = useState<string>("");
//   const [form] = Form.useForm();
//   const userId = "RwlMNV4yh5VPFAhN4Jp0CUCuWlL2"; // Replace with logged-in user's ID

//   // Load developers on mount
//   useEffect(() => {
//     (async () => {
//       try {
//         const q = query(
//           collection(db, "users"),
//           where("role", "==", "developer")
//         );
//         const snap = await getDocs(q);
//         const devs: Developer[] = snap.docs.map(d => ({
//           uid: d.id,
//           username: d.data().username as string,
//         }));
//         setDevelopers(devs);
//       } catch (e) {
//         message.error("Failed to load developers");
//         console.error(e);
//       }
//     })();

//     // Fetch tasks for the logged-in user
//     (async () => {
//       try {
//         const q = query(
//           collection(db, "tasks"),
//           where("userId", "==", userId) // Filter by userId
//         );
//         const snap = await getDocs(q);
//         const tasksData: Task[] = snap.docs.map(doc => ({
//           id: doc.id,
//           ...doc.data(),
//         })) as Task[];
//         setTasks(tasksData);
//       } catch (e) {
//         message.error("Failed to load tasks");
//         console.error(e);
//       }
//     })();
//   }, []);

//   // Show modal for new or edit
//   const showModal = (category: string, task?: Task) => {
//     setCurrentCategory(category);
//     setEditingTask(task || null);
//     if (task) {
//       form.setFieldsValue({
//         ...task,
//         dueDate: dayjs(task.dueDate),
//         assignedTo: task.assignedTo,
//       });
//     } else {
//       form.resetFields();
//       form.setFieldsValue({ dueDate: dayjs() });
//     }
//     setIsModalVisible(true);
//   };

//   // Create or update task
//   const handleOk = async () => {
//     try {
//       const values = await form.validateFields();
//       const dev = developers.find(d => d.uid === values.assignedTo);
//       const payload: Omit<Task, "id"> & { id?: string } = {
//         title: values.title,
//         description: values.description,
//         category: currentCategory,
//         dueDate: values.dueDate.format("YYYY-MM-DD"),
//         assignedTo: values.assignedTo,
//         assignedToName: dev?.username || "Unknown",
//         userId, // Save userId
//       };

//       if (editingTask) {
//         // update
//         await updateDoc(
//           doc(db, "tasks", editingTask.id),
//           payload as any
//         );
//         setTasks(ts =>
//           ts.map(t =>
//             t.id === editingTask.id ? { ...t, ...payload } as Task : t
//           )
//         );
//       } else {
//         // new
//         const id = uuidv4();
//         await addDoc(collection(db, "tasks"), { ...payload, id });
//         setTasks(ts => [...ts, { ...(payload as Task), id }]);
//       }

//       setIsModalVisible(false);
//       setEditingTask(null);
//     } catch (e) {
//       message.error("Failed to save task");
//       console.error(e);
//     }
//   };

//   // Delete
//   const handleDelete = (id: string) => {
//     Modal.confirm({
//       title: "Delete this task?",
//       icon: <ExclamationCircleOutlined />,
//       onOk: async () => {
//         await deleteDoc(doc(db, "tasks", id));
//         setTasks(ts => ts.filter(t => t.id !== id));
//       },
//     });
//   };

//   // Drag & drop handler
//   const onDragEnd = (result: DropResult) => {
//     const { source, destination, draggableId } = result;
//     if (!destination) return;
//     if (
//       source.droppableId === destination.droppableId &&
//       source.index === destination.index
//     )
//       return;
//     setTasks(ts =>
//       ts.map(t =>
//         t.id === draggableId
//           ? { ...t, category: destination.droppableId }
//           : t
//       )
//     );
//     // also persist:
//     updateDoc(doc(db, "tasks", draggableId), {
//       category: destination.droppableId,
//     }).catch(console.error);
//   };

//   return (
//     <>
//       <DragDropContext onDragEnd={onDragEnd}>
//         <div style={{ overflowX: "auto", padding: 16 }}>
//           <Row wrap={false} gutter={16} style={{ minWidth: "100%" }}>
//             {categories.map(cat => (
//               <Col key={cat} style={{ minWidth: 300 }}>
//                 <Card
//                   title={
//                     <div style={{ display: "flex", justifyContent: "space-between" }}>
//                       <span>
//                         {categoryTitles[cat]} (
//                         {tasks.filter(t => t.category === cat).length})
//                       </span>
//                       <Button
//                         type="text"
//                         icon={<PlusOutlined />}
//                         onClick={() => showModal(cat)}
//                       />
//                     </div>
//                   }
//                   bordered={false}
//                   style={{ background: "#fafafa", borderRadius: 8 }}
//                 >
//                   <Droppable droppableId={cat}>
//                     {(provided, snapshot) => (
//                       <div
//                         ref={provided.innerRef}
//                         {...provided.droppableProps}
//                         style={{
//                           padding: 8,
//                           minHeight: 100,
//                           background: snapshot.isDraggingOver ? "#e6f7ff" : "#fff",
//                           borderRadius: 6,
//                         }}
//                       >
//                         {tasks
//                           .filter(t => t.category === cat)
//                           .map((task, idx) => (
//                             <Draggable key={task.id} draggableId={task.id} index={idx}>
//                               {(prov, snap) => (
//                                 <Card
//                                   size="small"
//                                   ref={prov.innerRef}
//                                   {...prov.draggableProps}
//                                   {...prov.dragHandleProps}
//                                   style={{
//                                     marginBottom: 8,
//                                     opacity: snap.isDragging ? 0.8 : 1,
//                                     ...prov.draggableProps.style,
//                                   }}
//                                   actions={[
//                                     <MoreOutlined
//                                       key="edit"
//                                       onClick={() => showModal(cat, task)}
//                                     />,
//                                     <MoreOutlined
//                                       key="delete"
//                                       style={{ color: "red" }}
//                                       onClick={() => handleDelete(task.id)}
//                                     />,
//                                   ]}
//                                 >
//                                   <strong>{task.title}</strong>
//                                   <div style={{ margin: "4px 0" }}>
//                                     {task.description}
//                                   </div>
//                                   <small>Due: {task.dueDate}</small>
//                                   <br />
//                                   <small>Assigned: {task.assignedToName}</small>
//                                 </Card>
//                               )}
//                             </Draggable>
//                           ))}
//                         {provided.placeholder}
//                       </div>
//                     )}
//                   </Droppable>
//                 </Card>
//               </Col>
//             ))}
//           </Row>
//         </div>
//       </DragDropContext>

//       <Modal
//         title={editingTask ? "Edit Task" : "New Task"}
//         open={isModalVisible}
//         onCancel={() => setIsModalVisible(false)}
//         onOk={handleOk}
//         okText={editingTask ? "Update" : "Create"}
//       >
//         <Form form={form} layout="vertical">
//           <Form.Item
//             name="title"
//             label="Title"
//             rules={[{ required: true, message: "Enter title" }]}
//           >
//             <Input />
//           </Form.Item>
//           <Form.Item
//             name="description"
//             label="Description"
//             rules={[{ required: true, message: "Enter description" }]}
//           >
//             <Input.TextArea rows={3} />
//           </Form.Item>
//           <Form.Item
//             name="dueDate"
//             label="Due Date"
//             rules={[{ required: true, message: "Pick a date" }]}
//           >
//             <DatePicker style={{ width: "100%" }} />
//           </Form.Item>
//           <Form.Item
//             name="assignedTo"
//             label="Assign To"
//             rules={[{ required: true, message: "Select a developer" }]}
//           >
//             <Select placeholder="Select developer">
//               {developers.map(dev => (
//                 <Select.Option key={dev.uid} value={dev.uid}>
//                   {dev.username}
//                 </Select.Option>
//               ))}
//             </Select>
//           </Form.Item>
//         </Form>
//       </Modal>
//     </>
//   );
// };

// export default KanbanBoard;

import React, { useState, useEffect } from "react";
import {
  Card,
  Col,
  Row,
  Button,
  Modal,
  Form,
  Input,
  Select,
  DatePicker,
  message,
} from "antd";
import {
  PlusOutlined,
  ExclamationCircleOutlined,
  MoreOutlined,
} from "@ant-design/icons";
import { v4 as uuidv4 } from "uuid";
import dayjs from "dayjs";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "@hello-pangea/dnd";
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
import { db } from "../../firebase/firebase"; // your path here

type Task = {
  id: string;
  title: string;
  description: string;
  category: string;
  dueDate: string;
  assignedTo: string; // uid of developer
  assignedToName: string; // display name
};

type Developer = {
  uid: string;
  username: string;
};

const categoryTitles: Record<string, string> = {
  backlog: "Backlog",
  todo: "To Do",
  inprogress: "In Progress",
  inreview: "In Review",
  done: "Done",
};
const categories = Object.keys(categoryTitles);

const KanbanBoard: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [developers, setDevelopers] = useState<Developer[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [currentCategory, setCurrentCategory] = useState<string>("");
  const [form] = Form.useForm();

  // Load developers on mount
  useEffect(() => {
    (async () => {
      try {
        const q = query(
          collection(db, "users"),
          where("role", "==", "developer")
        );
        const snap = await getDocs(q);
        const devs: Developer[] = snap.docs.map(d => ({
          uid: d.id,
          username: d.data().username as string,
        }));
        setDevelopers(devs);
      } catch (e) {
        message.error("Failed to load developers");
        console.error(e);
      }
    })();
  }, []);

  // Show modal for new or edit
  const showModal = (category: string, task?: Task) => {
    setCurrentCategory(category);
    setEditingTask(task || null);
    if (task) {
      form.setFieldsValue({
        ...task,
        dueDate: dayjs(task.dueDate),
        assignedTo: task.assignedTo,
      });
    } else {
      form.resetFields();
      form.setFieldsValue({ dueDate: dayjs() });
    }
    setIsModalVisible(true);
  };

  // Create or update task
  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      const dev = developers.find(d => d.uid === values.assignedTo);
      const payload: Omit<Task, "id"> & { id?: string } = {
        title: values.title,
        description: values.description,
        category: currentCategory,
        dueDate: values.dueDate.format("YYYY-MM-DD"),
        assignedTo: values.assignedTo,
        assignedToName: dev?.username || "Unknown",
      };

      if (editingTask) {
        // update
        await updateDoc(
          doc(db, "tasks", editingTask.id),
          payload as any
        );
        setTasks(ts =>
          ts.map(t =>
            t.id === editingTask.id ? { ...t, ...payload } as Task : t
          )
        );
      } else {
        // new
        const id = uuidv4();
        await addDoc(collection(db, "tasks"), { ...payload, id });
        setTasks(ts => [...ts, { ...(payload as Task), id }]);
      }

      setIsModalVisible(false);
      setEditingTask(null);
    } catch (e) {
      message.error("Failed to save task");
      console.error(e);
    }
  };

  // Delete
  const handleDelete = (id: string) => {
    Modal.confirm({
      title: "Delete this task?",
      icon: <ExclamationCircleOutlined />,
      onOk: async () => {
        await deleteDoc(doc(db, "tasks", id));
        setTasks(ts => ts.filter(t => t.id !== id));
      },
    });
  };

  // Drag & drop handler
  const onDragEnd = (result: DropResult) => {
    const { source, destination, draggableId } = result;
    if (!destination) return;
    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    )
      return;
    setTasks(ts =>
      ts.map(t =>
        t.id === draggableId
          ? { ...t, category: destination.droppableId }
          : t
      )
    );
    // also persist:
    updateDoc(doc(db, "tasks", draggableId), {
      category: destination.droppableId,
    }).catch(console.error);
  };

  return (
    <>
      <DragDropContext onDragEnd={onDragEnd}>
        <Row wrap={false} gutter={16} style={{ overflowX: "auto", padding: 16 }}>
          {categories.map(cat => (
            <Col key={cat} style={{ minWidth: 300 }}>
              <Card
                title={
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span>
                      {categoryTitles[cat]} (
                      {tasks.filter(t => t.category === cat).length})
                    </span>
                    <Button
                      type="text"
                      icon={<PlusOutlined />}
                      onClick={() => showModal(cat)}
                    />
                  </div>
                }
                bordered={false}
                style={{
                  background: "#fafafa",
                  borderRadius: 8,
                  boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
                }}
              >
                <Droppable droppableId={cat}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      style={{
                        padding: 8,
                        minHeight: 100,
                        background: snapshot.isDraggingOver ? "#e6f7ff" : "#fff",
                        borderRadius: 6,
                        maxHeight: "calc(100vh - 200px)", // Make it scrollable
                        overflowY: "auto", // Enable scrolling
                      }}
                    >
                      {tasks
                        .filter(t => t.category === cat)
                        .map((task, idx) => (
                          <Draggable key={task.id} draggableId={task.id} index={idx}>
                            {(prov, snap) => (
                              <Card
                                size="small"
                                ref={prov.innerRef}
                                {...prov.draggableProps}
                                {...prov.dragHandleProps}
                                style={{
                                  marginBottom: 8,
                                  opacity: snap.isDragging ? 0.8 : 1,
                                  ...prov.draggableProps.style,
                                  boxShadow: "0 2px 6px rgba(0, 0, 0, 0.2)", // Shadow for better visual
                                }}
                                actions={[
                                  <MoreOutlined
                                    key="edit"
                                    onClick={() => showModal(cat, task)}
                                  />,
                                  <MoreOutlined
                                    key="delete"
                                    style={{ color: "red" }}
                                    onClick={() => handleDelete(task.id)}
                                  />,
                                ]}
                              >
                                <strong>{task.title}</strong>
                                <div style={{ margin: "4px 0" }}>
                                  {task.description}
                                </div>
                                <small>Due: {task.dueDate}</small>
                                <br />
                                <small>Assigned: {task.assignedToName}</small>
                              </Card>
                            )}
                          </Draggable>
                        ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </Card>
            </Col>
          ))}
        </Row>
      </DragDropContext>

      <Modal
        title={editingTask ? "Edit Task" : "New Task"}
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        onOk={handleOk}
        okText={editingTask ? "Update" : "Create"}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="title"
            label="Title"
            rules={[{ required: true, message: "Enter title" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="description"
            label="Description"
            rules={[{ required: true, message: "Enter description" }]}
          >
            <Input.TextArea rows={3} />
          </Form.Item>
          <Form.Item
            name="dueDate"
            label="Due Date"
            rules={[{ required: true, message: "Pick a date" }]}
          >
            <DatePicker style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item
            name="assignedTo"
            label="Assign To"
            rules={[{ required: true, message: "Select a developer" }]}
          >
            <Select placeholder="Select developer">
              {developers.map(dev => (
                <Select.Option key={dev.uid} value={dev.uid}>
                  {dev.username}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default KanbanBoard;
