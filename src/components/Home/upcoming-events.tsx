// import { Badge, Card, List } from "antd";
// import React, { useEffect, useState } from "react";
// import { Text } from "../text";
// import { getDate } from "@/utilities/helpers";
// import { db, auth } from "@/firebase/firebase";
// import { collection, query, where, getDocs } from "firebase/firestore";
// import { onAuthStateChanged } from "firebase/auth";
// import dayjs from "dayjs";
// import { useGetIdentity } from "@refinedev/core";
// // import { Calendar } from "lucide-react";
// import LatestActivitiesSkeleton from "../skeleton/latest-activities";
// import { CalendarOutlined, FileTextOutlined } from "@ant-design/icons";

// interface EventType {
//   id: string;
//   title: string;
//   description: string;
//   startDate: string;
//   endDate: string;
//   userId: string;
//   color: string;
// }

// const UpcomingEvents: React.FC = () => {
//   const [events, setEvents] = useState<EventType[]>([]);
//   const [isLoading, setIsLoading] = useState<boolean>(true);
//   const { data: user } = useGetIdentity<{ email: string }>();
//   const [userId, setUserId] = useState<string | null>(null);

//   useEffect(() => {
//     onAuthStateChanged(auth, (user) => {
//       if (user) {
//         setUserId(user.uid);
//         fetchEvents(user.uid);
//       }
//     });
//   }, []);

//   const fetchEvents = async (userId: string) => {
//     setIsLoading(true);
//     try {
//       const q = query(collection(db, "events"), where("userId", "==", userId));
//       const querySnapshot = await getDocs(q);
//       const filteredEvents: EventType[] = querySnapshot.docs
//         .map((doc) => {
//           const data = doc.data() as EventType;
//           return {
//             id: doc.id,
//             ...data,
//           };
//         })
//         .sort((a, b) => dayjs(a.startDate).diff(dayjs(b.startDate)))
//         .slice(0, 5);

//       setEvents(filteredEvents);
//     } catch (error) {
//       console.error("Error fetching events:", error);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <Card
//       title={
//         <div style={{ display: "flex", alignItems: "center", gap: "15px", marginBottom: "12px" }}>
//           {/* <Calendar size={20} color="#1890ff" /> */}
//           <CalendarOutlined  />
//           <Text size="sm" style={{ marginLeft: "0.3rem" }}>Upcoming Events</Text>
//         </div>
//       }
//       style={{ height: "460px", overflow: "auto", padding: "6px", borderRadius: "4px", marginBottom: "20px" }}
//     >
//       {isLoading ? (
//         <List
//           itemLayout="horizontal"
//           dataSource={Array.from({ length: 5 }).map((_, i) => ({ id: i }))}
//           renderItem={(_, index) => <LatestActivitiesSkeleton key={index} />}
//         />
//       ) : events.length > 0 ? (
//         <List
//           itemLayout="horizontal"
//           dataSource={events}
//           renderItem={(item) => {
//             const renderDate = getDate(item.startDate, item.endDate);
//             return (
//               <List.Item>
//                 <List.Item.Meta
//                   avatar={<Badge color={item.color || "blue"} />}
//                   title={<Text size="xs">{renderDate}</Text>}
//                   description={<Text ellipsis={{ tooltip: true }} strong>{item.title}</Text>}
//                 />
//               </List.Item>
//             );
//           }}
//         />
//       ) : (
//         <div style={{ textAlign: "center", padding: "4px", fontSize: "10px", color: "#999" }}>No Upcoming Events</div>
//       )}
//     </Card>
//   );
// };

// export default UpcomingEvents;

import { Badge, Card, List } from "antd";
import React, { useEffect, useState } from "react";
import { Text } from "../text";
import { db, auth } from "@/firebase/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import dayjs from "dayjs";
import { useGetIdentity } from "@refinedev/core";
import { CalendarOutlined } from "@ant-design/icons";

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
        .map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            ...data,
          } as EventType;
        })
        .filter((event) => {
          const now = dayjs();
          const eventStart = dayjs(`${event.startDate} ${event.startTime}`, "YYYY-MM-DD HH:mm");
          const eventEnd = dayjs(`${event.endDate} ${event.endTime}`, "YYYY-MM-DD HH:mm");

          return eventStart.isAfter(now) || (now.isAfter(eventStart) && now.isBefore(eventEnd));
        })
        .sort((a, b) =>
          dayjs(`${a.startDate} ${a.startTime}`, "YYYY-MM-DD HH:mm").diff(
            dayjs(`${b.startDate} ${b.startTime}`, "YYYY-MM-DD HH:mm")
          )
        )
        .slice(0, 5);

      setEvents(filteredEvents);
    } catch (error) {
      console.error("Error fetching events:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card
      title={
        <div style={{ display: "flex", alignItems: "center", gap: "15px", marginBottom: "1px" }}>
          <CalendarOutlined />
          <Text size="sm" style={{ marginLeft: "0.3rem" }}>Upcoming Events</Text>
        </div>
      }
      bodyStyle={{ padding: "0 0 0 15px" }} // 👈 this reduces the inner padding
      style={{
        height: "482px",
        overflow: "auto",
        borderRadius: "12px",
        marginBottom: "20px"
      }}
    >
      {isLoading ? (
        <div style={{ textAlign: "center", padding: "4px", fontSize: "10px", color: "#999" }}>
          Loading...
        </div>
      ) : events.length > 0 ? (
        <List
          itemLayout="horizontal"
          dataSource={events}
          renderItem={(item) => (
            <List.Item>
              <List.Item.Meta
                avatar={<Badge color={item.color || "blue"} />}
                title={
                  <Text size="xs">
                    {dayjs(item.startDate).format("DD MMM YYYY")} | {item.startTime} - {item.endTime}
                  </Text>
                }
                description={<Text ellipsis={{ tooltip: true }} strong>{item.title}</Text>}
              />
            </List.Item>
          )}
        />
      ) : (
        <div style={{ textAlign: "center", padding: "4px", fontSize: "10px", color: "#999" }}>
          No Upcoming Events
        </div>
      )}
    </Card>
  );
};

export default UpcomingEvents;
