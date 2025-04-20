// import React, { useEffect, useState } from "react";
// import { Card, List, Space, Tooltip } from "antd";
// import { UnorderedListOutlined } from "@ant-design/icons";
// import { Text } from "../text";
// import { db } from "../../firebase/firebase";
// import { collection, query, getDocs, Timestamp } from "firebase/firestore";
// import CustomAvatar from "../custom-avatar";
// import dayjs from "dayjs";
// import relativeTime from "dayjs/plugin/relativeTime";

// dayjs.extend(relativeTime);

// interface Deal {
//   id: string;
//   amount: number;
//   company: string;
//   date: Timestamp;
//   status: string;
//   title: string;
//   userId: string;
// }

// const LatestActivities: React.FC = () => {
//   const [deals, setDeals] = useState<Deal[]>([]);
//   const [loading, setLoading] = useState<boolean>(true);

//   const fetchDeals = async () => {
//     try {
//       const q = query(collection(db, "sales_pipeline"));
//       const snapshot = await getDocs(q);

//       const dealsData: Deal[] = snapshot.docs.map((doc) => {
//         const data = doc.data();
//         return {
//           id: doc.id,
//           ...data,
//           date: data.date?.toDate ? data.date.toDate() : new Date(), // fallback if date missing
//         };
//       });

//       // Sort by latest date & limit to 5
//       dealsData.sort((a, b) => b.date.getTime() - a.date.getTime());
//       setDeals(dealsData.slice(0, 5));
//     } catch (error) {
//       console.error("Error fetching deals:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchDeals();
//   }, []);

//   const formatDate = (date: Date) => ({
//     relative: dayjs(date).fromNow(),
//     time: dayjs(date).format("h:mm A"),
//     full: dayjs(date).format("MMMM D, YYYY h:mm A"),
//   });

//   return (
//     <Card
//       headStyle={{ padding: "16px" }}
//       bodyStyle={{ padding: "0 1rem" }}
//       title={
//         <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
//           <UnorderedListOutlined />
//           <Text size="sm" style={{ marginLeft: "0.5rem" }}>
//             Latest Activities
//           </Text>
//         </div>
//       }
//     >
//       <List
//         itemLayout="horizontal"
//         dataSource={deals}
//         loading={loading}
//         renderItem={(deal) => {
//           const formatted = formatDate(deal.date as Date);
//           return (
//             <List.Item>
//               <List.Item.Meta
//                 title={<Tooltip title={formatted.full}>{formatted.relative}</Tooltip>}
//                 avatar={
//                   <CustomAvatar
//                     shape="square"
//                     size={48}
//                     name={deal.company || "Unknown"}
//                   />
//                 }
//                 description={
//                   <Space size={4}>
//                     <Text strong>{deal.userId?.split("@")[0]}</Text>
//                     <Text>created</Text>
//                     <Text strong>{deal.title}</Text>
//                     <Text>deal</Text>
//                     <Text>in</Text>
//                     <Text strong>{deal.status?.toUpperCase()}</Text>
//                     <Text>at</Text>
//                     <Text strong>{formatted.time}</Text>
//                   </Space>
//                 }
//               />
//             </List.Item>
//           );
//         }}
//       />
//     </Card>
//   );
// };

// export default LatestActivities;

// import React, { useEffect, useState } from "react";
// import { Card, List, Space, Tooltip, Empty } from "antd";
// import { UnorderedListOutlined } from "@ant-design/icons";
// import { Text } from "../text";
// import { db } from "../../firebase/firebase";
// import {
//   collection,
//   query,
//   getDocs,
//   Timestamp,
//   where,
// } from "firebase/firestore";
// import CustomAvatar from "../custom-avatar";
// import dayjs from "dayjs";
// import relativeTime from "dayjs/plugin/relativeTime";
// import { getAuth, onAuthStateChanged } from "firebase/auth";

// dayjs.extend(relativeTime);

// interface Deal {
//   id: string;
//   amount: number;
//   company: string;
//   date: Timestamp;
//   status: string;
//   title: string;
//   userId: string;
// }

// const LatestActivities: React.FC = () => {
//   const [deals, setDeals] = useState<Deal[]>([]);
//   const [loading, setLoading] = useState<boolean>(true);
//   const [userId, setUserId] = useState<string | null>(null);

//   useEffect(() => {
//     const auth = getAuth();
//     const unsubscribe = onAuthStateChanged(auth, (user) => {
//       if (user?.email) {
//         setUserId(user.email);
//       } else {
//         setUserId(null);
//         setLoading(false);
//       }
//     });

//     return () => unsubscribe();
//   }, []);

//   useEffect(() => {
//     const fetchDeals = async () => {
//       if (!userId) return;

//       try {
//         const q = query(
//           collection(db, "sales_pipeline"),
//           where("userId", "==", userId)
//         );
//         const snapshot = await getDocs(q);

//         const dealsData: Deal[] = snapshot.docs.map((doc) => {
//           const data = doc.data();
//           return {
//             id: doc.id,
//             ...data,
//             date: data.date?.toDate ? data.date.toDate() : new Date(),
//           };
//         });

//         // Sort and limit
//         dealsData.sort((a, b) => b.date.getTime() - a.date.getTime());
//         setDeals(dealsData.slice(0, 5));
//       } catch (error) {
//         console.error("Error fetching deals:", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     if (userId) {
//       fetchDeals();
//     }
//   }, [userId]);

//   const formatDate = (date: Date) => ({
//     relative: dayjs(date).fromNow(),
//     time: dayjs(date).format("h:mm A"),
//     full: dayjs(date).format("MMMM D, YYYY h:mm A"),
//   });

//   return (
//     <Card
//       headStyle={{ padding: "16px" }}
//       bodyStyle={{ padding: "0 1rem" }}
//       title={
//         <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
//           <UnorderedListOutlined />
//           <Text size="sm" style={{ marginLeft: "0.5rem" }}>
//             Latest Activities
//           </Text>
//         </div>
//       }
//     >
//       <List
//         itemLayout="horizontal"
//         dataSource={deals}
//         loading={loading}
//         locale={{ emptyText: <Empty description="No latest activity" /> }}
//         renderItem={(deal) => {
//           const formatted = formatDate(deal.date as Date);
//           return (
//             <List.Item>
//               <List.Item.Meta
//                 title={<Tooltip title={formatted.full}>{formatted.relative}</Tooltip>}
//                 avatar={
//                   <CustomAvatar
//                     shape="square"
//                     size={48}
//                     name={deal.company || "Unknown"}
//                   />
//                 }
//                 description={
//                   <Space size={4}>
//                     <Text strong>{deal.userId?.split("@")[0]}</Text>
//                     <Text>created</Text>
//                     <Text strong>{deal.title}</Text>
//                     <Text>deal</Text>
//                     <Text>in</Text>
//                     <Text strong>{deal.status?.toUpperCase()}</Text>
//                     <Text>at</Text>
//                     <Text strong>{formatted.time}</Text>
//                   </Space>
//                 }
//               />
//             </List.Item>
//           );
//         }}
//       />
//     </Card>
//   );
// };

// export default LatestActivities;



import React, { useEffect, useState } from "react";
import { Card, List, Space, Tooltip, Empty } from "antd";
import { UnorderedListOutlined } from "@ant-design/icons";
import { Text } from "../text";
import { db } from "../../firebase/firebase";
import { collection, query, getDocs, Timestamp, where } from "firebase/firestore";
import CustomAvatar from "../custom-avatar";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { getAuth, onAuthStateChanged } from "firebase/auth";

dayjs.extend(relativeTime);

interface Deal {
  id: string;
  amount: number;
  company: string;
  date: Timestamp; // Firestore Timestamp
  status: string;
  title: string;
  userId: string;
}

const LatestActivities: React.FC = () => {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user?.email) {
        setUserId(user.email);
      } else {
        setUserId(null);
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const fetchDeals = async () => {
      if (!userId) return;

      try {
        const q = query(
          collection(db, "sales_pipeline"),
          where("userId", "==", userId)
        );
        const snapshot = await getDocs(q);

        const dealsData: Deal[] = snapshot.docs.map((doc) => {
          const data = doc.data();
          // Properly convert the Timestamp to Date
          const date = data.date instanceof Timestamp ? data.date.toDate() : new Date();
          return {
            id: doc.id,
            ...data,
            date,
          };
        });

        // Sort and limit to the latest 5 deals
        dealsData.sort((a, b) => b.date.getTime() - a.date.getTime());
        setDeals(dealsData.slice(0, 5)); // Show top 5 latest
      } catch (error) {
        console.error("Error fetching deals:", error);
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchDeals();
    }
  }, [userId]);

  const formatDate = (date: Date) => ({
    relative: dayjs(date).fromNow(),
    time: dayjs(date).format("h:mm A"),
    full: dayjs(date).format("MMMM D, YYYY h:mm A"),
  });

  return (
    <Card
    
      headStyle={{ padding: "16px" }}
      bodyStyle={{ padding: "0 1rem" }}
      title={
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <UnorderedListOutlined />
          <Text size="sm" style={{ marginLeft: "0.5rem" }}>
            Latest Activities
          </Text>
        </div>
      }
    >
      <List
        itemLayout="horizontal"
        dataSource={deals}
        loading={loading}
        locale={{ emptyText: <Empty description="No latest activity" /> }}
        renderItem={(deal) => {
          const formatted = formatDate(deal.date);
          return (
            <List.Item>
              <List.Item.Meta
                title={<Tooltip title={formatted.full}>{formatted.relative}</Tooltip>}
                avatar={
                  <CustomAvatar
                    shape="square"
                    size={48}
                    name={deal.company || "Unknown"}
                  />
                }
                description={
                  <Space size={4}>
                    <Text strong>{deal.userId?.split("@")[0]}</Text>
                    <Text>created</Text>
                    <Text strong>{deal.title}</Text>
                    <Text>deal</Text>
                    <Text>in</Text>
                    <Text strong>{deal.status?.toUpperCase()}</Text>
                    <Text>at</Text>
                    <Text strong>{formatted.time}</Text>
                  </Space>
                }
              />
            </List.Item>
          );
        }}
      />
    </Card>
  );
};

export default LatestActivities;
