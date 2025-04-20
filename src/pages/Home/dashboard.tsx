// import { Col, Row } from "antd";
// import {
//   DashboardTotalCountCard,
//   DealsCharts,
//   LatestActivities,
//   UpcomingEvents,
// } from "@/components";
// import { useEffect, useState } from "react";
// import { db } from "../../firebase/firebase"; // Firebase config file
// import { collection, getDocs } from "firebase/firestore";

// export const Home = () => {
//   const [companies, setCompanies] = useState(0);
//   const [contacts, setContacts] = useState(0);
//   const [deals, setDeals] = useState(0);

//   useEffect(() => {
//     const fetchCounts = async () => {
//       // Companies Count
//       const companiesSnapshot = await getDocs(collection(db, "company"));
//       setCompanies(companiesSnapshot.size);

//       // Contacts Count
//       const contactsSnapshot = await getDocs(collection(db, "contacts"));
//       setContacts(contactsSnapshot.size);

//       // Deals Count
//       const dealsSnapshot = await getDocs(collection(db, "sales_pipeline"));
//       setDeals(dealsSnapshot.size);
//     };

//     fetchCounts();
//   }, []);

//   return (
//     <div>
//       <Row gutter={[32, 32]}>
//         <Col xs={24} sm={24} xl={8}>
//           <DashboardTotalCountCard
//             resource="companies"
//             totalCount={companies}
//             isLoading={false}
//           />
//         </Col>
//         <Col xs={24} sm={24} xl={8}>
//           <DashboardTotalCountCard
//             resource="contacts"
//             totalCount={contacts}
//             isLoading={false}
//           />
//         </Col>
//         <Col xs={24} sm={24} xl={8}>
//           <DashboardTotalCountCard
//             resource="deals"
//             totalCount={deals}
//             isLoading={false}
//           />
//         </Col>
//       </Row>

//       <Row gutter={[32, 32]} style={{ marginTop: "32px" }}>
//         <Col xs={24} sm={24} xl={8} style={{ height: "460px" }}>
//           <UpcomingEvents />
//         </Col>
//         <Col xs={24} sm={24} xl={16} style={{ height: "460px" }}>
//           <DealsCharts />
//         </Col>
//       </Row>

//       <Row gutter={[32, 32]} style={{ marginTop: "32px" }}>
//         <Col xs={24}>
//           <LatestActivities />
//         </Col>
//       </Row>
//     </div>
//   );
// };

import React, { useEffect, useState } from "react";
import { Col, Row } from "antd";
import { DashboardTotalCountCard, DealsCharts, LatestActivities, UpcomingEvents } from "@/components";
import { db } from "../../firebase/firebase"; // Firebase config file
import { collection, getDocs } from "firebase/firestore";
import CompanyMap from "../../CompanyMap";  // Import the CompanyMap component

export const Home = () => {
  const [companies, setCompanies] = useState(0);
  const [contacts, setContacts] = useState(0);
  const [deals, setDeals] = useState(0);

  useEffect(() => {
    const fetchCounts = async () => {
      // Companies Count
      const companiesSnapshot = await getDocs(collection(db, "company"));
      setCompanies(companiesSnapshot.size);

      // Contacts Count
      const contactsSnapshot = await getDocs(collection(db, "contacts"));
      setContacts(contactsSnapshot.size);

      // Deals Count
      const dealsSnapshot = await getDocs(collection(db, "sales_pipeline"));
      setDeals(dealsSnapshot.size);
    };

    fetchCounts();
  }, []);

  return (
    <div>
      <Row gutter={[32, 32]}>
        <Col xs={24} sm={24} xl={8}>
          <DashboardTotalCountCard
            resource="companies"
            totalCount={companies}
            isLoading={false}
          />
        </Col>
        <Col xs={24} sm={24} xl={8}>
          <DashboardTotalCountCard
            resource="contacts"
            totalCount={contacts}
            isLoading={false}
          />
        </Col>
        <Col xs={24} sm={24} xl={8}>
          <DashboardTotalCountCard
            resource="deals"
            totalCount={deals}
            isLoading={false}
          />
        </Col>
      </Row>

      <Row gutter={[32, 32]} style={{ marginTop: "32px" }}>
        <Col xs={24} sm={24} xl={8} style={{ height: "482px" }}>
          <UpcomingEvents />
        </Col>
        <Col xs={24} sm={24} xl={16} style={{ height: "482px" }}>
          <DealsCharts />
        </Col>
      </Row>

      <Row gutter={[32, 32]} style={{ marginTop: "32px" }}>
        <Col xs={24} sm={24} xl={6}>
          <CompanyMap />
        </Col>
      </Row>

      <Row gutter={[32, 32]} style={{ marginTop: "60px" }}>
        <Col xs={24}>
          <LatestActivities />
        </Col>
      </Row>
    </div>
  );
};


// import React, { useEffect, useState } from "react";
// import { Col, Row, Spin, Alert } from "antd";
// import { DashboardTotalCountCard, DealsCharts, LatestActivities, UpcomingEvents } from "@/components";
// import { db } from "../../firebase/firebase"; // Firebase config file
// import { collection, getDocs, doc, getDoc } from "firebase/firestore";
// import CompanyMap from "../../CompanyMap";  // Import the CompanyMap component

// export const Home = () => {
//   const [companies, setCompanies] = useState(0);
//   const [contacts, setContacts] = useState(0);
//   const [deals, setDeals] = useState(0);
//   const [isLoading, setIsLoading] = useState(true);  // Track loading state
//   const [error, setError] = useState(null);  // Track any errors during fetch
//   const [role, setRole] = useState("developer");  // Default role

//   useEffect(() => {
//     const fetchUserRole = async () => {
//       // Fetch the logged-in user's role from Firebase
//       const userId = "exampleUserId";  // Get the actual user ID from Firebase Authentication
//       const userDoc = await getDoc(doc(db, "users", userId)); // Assuming 'users' collection
//       if (userDoc.exists()) {
//         setRole(userDoc.data().role);  // Set the user's role (e.g., "developer" or "manager")
//       }
//     };

//     fetchUserRole();
//   }, []);

//   useEffect(() => {
//     const fetchCounts = async () => {
//       try {
//         setIsLoading(true);

//         // Only fetch counts if the user is a manager
//         if (role === "manager") {
//           // Companies Count
//           const companiesSnapshot = await getDocs(collection(db, "company"));
//           setCompanies(companiesSnapshot.size);

//           // Contacts Count
//           const contactsSnapshot = await getDocs(collection(db, "contacts"));
//           setContacts(contactsSnapshot.size);

//           // Deals Count
//           const dealsSnapshot = await getDocs(collection(db, "sales_pipeline"));
//           setDeals(dealsSnapshot.size);
//         }

//         setIsLoading(false);  // Stop loading once data is fetched
//       } catch (error) {
//         setError(error.message);
//         setIsLoading(false);  // Stop loading even if there's an error
//       }
//     };

//     fetchCounts();
//   }, [role]);  // Re-fetch data when role changes

//   if (isLoading) {
//     return <Spin size="large" tip="Loading Data..." />; // Show loading spinner
//   }

//   if (error) {
//     return <Alert message="Error" description={error} type="error" showIcon />;
//   }

//   return (
//     <div>
//       {role === "developer" ? (
//         // Developer Panel (Only Dashboard and Kanban Board)
//         <Row gutter={[32, 32]}>
//           <Col xs={24} sm={24} xl={24}>
//             <DashboardTotalCountCard
//               resource="dashboard"
//               totalCount={0}  // This can be custom data
//               isLoading={false}
//             />
//           </Col>
//         </Row>
//       ) : (
//         // Manager Panel (Dashboard + Data)
//         <div>
//           <Row gutter={[32, 32]}>
//             <Col xs={24} sm={24} xl={8}>
//               <DashboardTotalCountCard
//                 resource="companies"
//                 totalCount={companies}
//                 isLoading={false}
//               />
//             </Col>
//             <Col xs={24} sm={24} xl={8}>
//               <DashboardTotalCountCard
//                 resource="contacts"
//                 totalCount={contacts}
//                 isLoading={false}
//               />
//             </Col>
//             <Col xs={24} sm={24} xl={8}>
//               <DashboardTotalCountCard
//                 resource="deals"
//                 totalCount={deals}
//                 isLoading={false}
//               />
//             </Col>
//           </Row>

//           <Row gutter={[32, 32]} style={{ marginTop: "32px" }}>
//             <Col xs={24} sm={24} xl={8} style={{ height: "482px" }}>
//               <UpcomingEvents />
//             </Col>
//             <Col xs={24} sm={24} xl={16} style={{ height: "482px" }}>
//               <DealsCharts />
//             </Col>
//           </Row>

//           <Row gutter={[32, 32]} style={{ marginTop: "32px" }}>
//             <Col xs={24} sm={24} xl={6}>
//               <CompanyMap />
//             </Col>
//           </Row>

//           <Row gutter={[32, 32]} style={{ marginTop: "60px" }}>
//             <Col xs={24}>
//               <LatestActivities />
//             </Col>
//           </Row>
//         </div>
//       )}
//     </div>
//   );
// };
