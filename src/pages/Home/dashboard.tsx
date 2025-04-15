import { Col, Row } from "antd";
import {
  DashboardTotalCountCard,
  DealsCharts,
  LatestActivities,
  UpcomingEvents,
} from "@/components";
import { useEffect, useState } from "react";
import { db } from "../../firebase/firebase"; // Firebase config file
import { collection, getDocs } from "firebase/firestore";

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
        <Col xs={24} sm={24} xl={8} style={{ height: "460px" }}>
          <UpcomingEvents />
        </Col>
        <Col xs={24} sm={24} xl={16} style={{ height: "460px" }}>
          <DealsCharts />
        </Col>
      </Row>

      <Row gutter={[32, 32]} style={{ marginTop: "32px" }}>
        <Col xs={24}>
          <LatestActivities />
        </Col>
      </Row>
    </div>
  );
};

// import {
//   DashboardTotalCountCard,
//   DealsCharts,
//   LatestActivities,
//   UpcomingEvents,
// } from "@/components";
// import { DASHBOARD_TOTAL_COUNTS_QUERY } from "@/graphql/queries";
// import { DashboardTotalCountsQuery } from "@/graphql/types";
// import { useCustom } from "@refinedev/core";
// import { Col, Row } from "antd";

// export const Home = () => {
//   const { data, isLoading } = useCustom<DashboardTotalCountsQuery>({
//     url: "", // Replace with actual GraphQL API URL
//     method: "post",
//     meta: {
//       gqlQuery: DASHBOARD_TOTAL_COUNTS_QUERY, // Fix typo: "qglQuery" → "graphqlQuery"
//     },
//   });

//   return (
//     <div>
//       <Row gutter={[32, 32]}>
//         <Col xs={24} sm={24} xl={8}>
//           <DashboardTotalCountCard
//             resource="companies"
//             isLoading={isLoading}
//             totalCount={data?.data.companies.totalCount}
//           />
//         </Col>
//         <Col xs={24} sm={24} xl={8}>
//           <DashboardTotalCountCard
//             resource="contacts"
//             isLoading={isLoading}
//             totalCount={data?.data.contacts.totalCount}
//           />
//         </Col>
//         <Col xs={24} sm={24} xl={8}>
//           <DashboardTotalCountCard
//             resource="deals"
//             isLoading={isLoading}
//             totalCount={data?.data.deals.totalCount}
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
//       <Row
//       gutter={[32,32]}
//       style={{
//         marginTop: "32px",
//       }}
//       >
//         <Col xs={24}>
//         <LatestActivities/>
//         </Col>
//       </Row>
//     </div>
//   );
// };

// import {
//   DashboardTotalCountCard,
//   DealsCharts,
//   UpcomingEvents,
// } from "@/components";
// import { DASHBOARD_TOTAL_COUNTS_QUERY } from "@/graphql/queries";
// import { DashboardTotalCountsQuery } from "@/graphql/types";
// import { useCustom } from "@refinedev/core";
// import { Col, Row } from "antd";

// export const Home = () => {
//   const { data, isLoading } = useCustom<DashboardTotalCountsQuery>({
//     url: "https://your-api-url/graphql", // Replace with actual API URL
//     method: "post", // Use POST for GraphQL queries
//     meta: {
//       graphqlQuery: DASHBOARD_TOTAL_COUNTS_QUERY, // Fix typo
//     },
//   });

//   return (
//     <div>
//       <Row gutter={[32, 32]}>
//         <Col xs={24} sm={24} xl={8}>
//           <DashboardTotalCountCard
//             resource="companies"
//             isLoading={isLoading} // Fix typo
//             totalCount={data?.data?.companies?.totalCount}
//           />
//         </Col>
//         <Col xs={24} sm={24} xl={8}>
//           <DashboardTotalCountCard
//             resource="contacts"
//             isLoading={isLoading}
//             totalCount={data?.data?.contacts?.totalCount}
//           />
//         </Col>
//         <Col xs={24} sm={24} xl={8}>
//           <DashboardTotalCountCard
//             resource="deals"
//             isLoading={isLoading}
//             totalCount={data?.data?.deals?.totalCount}
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
//     </div>
//   );
// };
