// import { Card } from "antd";
// import React from "react";


// type Props = {
//     resource:"companies" | "contacts" | "deals",
//     isLoading:boolean,
//     totalCount:number
// }

// const DashboardTotalCountCard = ({
//   resource,
//   isLoading,
//   totalCount,
// }: Props) => {
//   return
//    (
//     <Card>
  
//     </Card>
//    )
// };

// export default DashboardTotalCountCard;
// import { totalCountVariants } from "@/constants";
// import { Card, Skeleton, Spin, Typography } from "antd";
// import React from "react";
// import { Text } from "../text";
// import { Area, AreaConfig } from "@ant-design/plots";

// type Props = 
// {
//   resource: "companies" | "contacts" | "deals" ;
//   isLoading: boolean;
//   totalCount?: number;
// };

// const DashboardTotalCountCard = ({ resource, isLoading, totalCount }: Props) => {

//   const {primaryColor,secondaryColor,icon,title} = totalCountVariants[resource];
//   const config:AreaConfig={
//     data:totalCountVariants[resource].data,
//     xField:'index',
//     yField:'value',
//     appendPadding:[1,0,0,0],
//     padding:0,
//     syncViewPadding:true,
//     autoFit:true,
//     tooltip:false,
//     animation:false,
//     xAxis:false,
//     yAxis:{
//       tickCount:12,
//       label:{
//         style:{
//           stroke:'transparent'
//         }
//       },grid:{
//         line:{
//           style:{
//             stroke:'transparent'
//           }
//         }
//       }
//     },
//     smooth:true,
//     line:{
//       color:primaryColor,

//     },
//     areaStyle:()=>{
//       return{
//         fill:`l(270) 0:#fff 0.2${secondaryColor} 1:${primaryColor}`,
//       }
//     }
//   }

//   return (
//     <Card style={{ height: "96px",padding:0 }}
//     bodyStyle={{padding:'8px 8px 8px 12px'}}
//     size="small"
//     >
//       <div
//       style={{display:'flex',
//         alignItems:'center',
//         gap:'8px',
//         whiteSpace:'nowrap'
//       }}>
//         {icon}
//         <Text  size="md" className="secondary"style={{marginLeft:'8px'}}>
//           {title}
//         </Text>
//       </div>
//       <div style={{display:'flex',justifyContent:'space-between'}}>
//         <Text
//         size="xxxl"
//         strong
//         style={{
//           flex:1,
//           whiteSpace:'nowrap',
//           flexShrink:0,
//           textAlign:'start',
//           marginLeft:'48px',
//           fontVariantNumeric:'tabular-nums'
//         }}
//         >
//           {isLoading? (
//             <Skeleton.Button
//             style={{marginTop:'8px',
//               width:'74px',
//             }}
//             />
//           ):(
//             totalCount
//           )}
//         </Text>
//         <Area {...config} style={{width:'50%'}}/>
//       </div>
//       {/* <Typography.Title level={4}>{resource.toUpperCase()}</Typography.Title>
//       {isLoading ? <Spin size="large" /> : <Typography.Text strong>{totalCount}</Typography.Text>} */}
//     </Card>
//   );
// };

// export default DashboardTotalCountCard;
// import { totalCountVariants } from "@/constants"; 
// import { Card, Skeleton } from "antd";
// import React, { useEffect, useState } from "react";
// import { Text } from "../text";
// import { Area, AreaConfig } from "@ant-design/plots";
// import { getDocs, collection, query, where } from "firebase/firestore";
// import { auth, db } from "../../firebase/firebase";

// type Props = {
//   resource: "companies" | "contacts" | "deals";
// };

// // Define the pipeline stages you want to count for 'deals'
// const pipelineStages = ["todo", "inProgress", "won", "lost"];

// const DashboardTotalCountCard = ({ resource }: Props) => {
//   const [isLoading, setIsLoading] = useState(true);
//   const [totalCount, setTotalCount] = useState<number>(0);

//   const { primaryColor, secondaryColor, icon, title } = totalCountVariants[resource];

//   useEffect(() => {
//     const fetchCount = async () => {
//       try {
//         const user = auth.currentUser;
//         if (!user) return;
  
//         let q;
  
//         if (resource === "deals") {
//           // Fetch from sales_pipeline collection based on userId
//           q = query(
//             collection(db, "sales_pipeline"), // make sure this is your correct collection name
//             where("userId", "==", user.uid)
//           );
//         } else {
//           // For companies or contacts
//           q = query(collection(db, resource), where("userId", "==", user.uid));
//         }
  
//         const snapshot = await getDocs(q);
//         setTotalCount(snapshot.size);
//       } catch (error) {
//         console.error(`Error fetching ${resource}:`, error);
//       } finally {
//         setIsLoading(false);
//       }
//     };
  
//     fetchCount();
//   }, [resource]);
  
//   const config: AreaConfig = {
//     data: totalCountVariants[resource].data,
//     xField: "index",
//     yField: "value",
//     appendPadding: [1, 0, 0, 0],
//     padding: 0,
//     syncViewPadding: true,
//     autoFit: true,
//     tooltip: false,
//     animation: false,
//     xAxis: false,
//     yAxis: {
//       tickCount: 12,
//       label: {
//         style: {
//           stroke: "transparent",
//         },
//       },
//       grid: {
//         line: {
//           style: {
//             stroke: "transparent",
//           },
//         },
//       },
//     },
//     smooth: true,
//     line: {
//       color: primaryColor,
//     },
//     areaStyle: () => {
//       return {
//         fill: `l(270) 0:#fff 0.2${secondaryColor} 1:${primaryColor}`,
//       };
//     },
//   };

//   return (
//     <Card style={{ height: "96px", padding: 0 }} bodyStyle={{ padding: "8px 8px 8px 12px" }} size="small">
//       <div style={{ display: "flex", alignItems: "center", gap: "8px", whiteSpace: "nowrap" }}>
//         {icon}
//         <Text size="md" className="secondary" style={{ marginLeft: "8px" }}>
//           {title}
//         </Text>
//       </div>
//       <div style={{ display: "flex", justifyContent: "space-between" }}>
//         <Text
//           size="xxxl"
//           strong
//           style={{
//             flex: 1,
//             whiteSpace: "nowrap",
//             flexShrink: 0,
//             textAlign: "start",
//             marginLeft: "48px",
//             fontVariantNumeric: "tabular-nums",
//           }}
//         >
//           {isLoading ? (
//             <Skeleton.Button
//               style={{
//                 marginTop: "8px",
//                 width: "74px",
//               }}
//             />
//           ) : (
//             totalCount
//           )}
//         </Text>
//         <Area {...config} style={{ width: "50%" }} />
//       </div>
//     </Card>
//   );
// };

// export default DashboardTotalCountCard;

// import { totalCountVariants } from "@/constants";
// import { Card, Skeleton } from "antd";
// import React, { useEffect, useState } from "react";
// import { Text } from "../text";
// import { Area, AreaConfig } from "@ant-design/plots";
// import { getDocs, collection, query, where } from "firebase/firestore";
// import { auth, db } from "../../firebase/firebase";

// type Props = {
//   resource: "companies" | "contacts" | "deals";
// };

// const DashboardTotalCountCard = ({ resource }: Props) => {
//   const [isLoading, setIsLoading] = useState(true);
//   const [totalCount, setTotalCount] = useState<number>(0);

//   const { primaryColor, secondaryColor, icon, title } = totalCountVariants[resource];

//   useEffect(() => {
//     const fetchCount = async () => {
//       try {
//         const user = auth.currentUser;
//         if (!user) return;

//         let q;

//         if (resource === "deals") {
//           // FIXED: Correct collection name is "sale_pipeline"
//           q = query(
//             collection(db, "sales_pipeline"),
//             where("userId", "==", user.email) // Assuming userId = email as per your sample
//           );
//         } else {
//           q = query(collection(db, resource), where("userId", "==", user.email));
//         }

//         const snapshot = await getDocs(q);
//         setTotalCount(snapshot.size);
//       } catch (error) {
//         console.error(`Error fetching ${resource}:`, error);
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     fetchCount();
//   }, [resource]);

//   const config: AreaConfig = {
//     data: totalCountVariants[resource].data,
//     xField: "index",
//     yField: "value",
//     appendPadding: [1, 0, 0, 0],
//     padding: 0,
//     syncViewPadding: true,
//     autoFit: true,
//     tooltip: false,
//     animation: false,
//     xAxis: false,
//     yAxis: {
//       tickCount: 12,
//       label: {
//         style: {
//           stroke: "transparent",
//         },
//       },
//       grid: {
//         line: {
//           style: {
//             stroke: "transparent",
//           },
//         },
//       },
//     },
//     smooth: true,
//     line: {
//       color: primaryColor,
//     },
//     areaStyle: () => {
//       return {
//         fill: `l(270) 0:#fff 0.2${secondaryColor} 1:${primaryColor}`,
//       };
//     },
//   };

//   return (
//     <Card
//       style={{ height: "96px", padding: 0 }}
//       bodyStyle={{ padding: "8px 8px 8px 12px" }}
//       size="small"
//     >
//       <div style={{ display: "flex", alignItems: "center", gap: "8px", whiteSpace: "nowrap" }}>
//         {icon}
//         <Text size="md" className="secondary" style={{ marginLeft: "8px" }}>
//           {title}
//         </Text>
//       </div>
//       <div style={{ display: "flex", justifyContent: "space-between" }}>
//         <Text
//           size="xxxl"
//           strong
//           style={{
//             flex: 1,
//             whiteSpace: "nowrap",
//             flexShrink: 0,
//             textAlign: "start",
//             marginLeft: "48px",
//             fontVariantNumeric: "tabular-nums",
//           }}
//         >
//           {isLoading ? (
//             <Skeleton.Button
//               style={{
//                 marginTop: "8px",
//                 width: "74px",
//               }}
//             />
//           ) : (
//             totalCount
//           )}
//         </Text>
//         <Area {...config} style={{ width: "50%" }} />
//       </div>
//     </Card>
//   );
// };

// export default DashboardTotalCountCard;

import { totalCountVariants } from "@/constants";
import { Card, Skeleton } from "antd";
import React, { useEffect, useState } from "react";
import { Text } from "../text";
import { Area, AreaConfig } from "@ant-design/plots";
import { getDocs, collection, query, where } from "firebase/firestore";
import { auth, db } from "../../firebase/firebase";

type Props = {
  resource: "companies" | "contacts" | "deals";
};

// Mapping resource to their actual Firestore collection
const resourceCollectionMap: Record<"companies" | "contacts" | "deals", string> = {
  companies: "companies",
  contacts: "contacts",
  deals: "sales_pipeline",
};

const DashboardTotalCountCard = ({ resource }: Props) => {
  const [isLoading, setIsLoading] = useState(true);
  const [totalCount, setTotalCount] = useState<number>(0);

  const { primaryColor, secondaryColor, icon, title } = totalCountVariants[resource];

  useEffect(() => {
    const fetchCount = async () => {
      try {
        const user = auth.currentUser;
        if (!user) return;
  
        let q;
  
        if (resource === "deals") {
          // sales_pipeline → uses email as userId
          q = query(
            collection(db, "sales_pipeline"),
            where("userId", "==", user.email)
          );
        } else {
          // contacts or companies → use UID as userId
          q = query(
            collection(db, resource),
            where("userId", "==", user.uid)
          );
        }
  
        const snapshot = await getDocs(q);
        setTotalCount(snapshot.size);
      } catch (error) {
        console.error(`Error fetching ${resource}:`, error);
      } finally {
        setIsLoading(false);
      }
    };
  
    fetchCount();
  }, [resource]);
  

  const config: AreaConfig = {
    data: totalCountVariants[resource].data,
    xField: "index",
    yField: "value",
    appendPadding: [1, 0, 0, 0],
    padding: 0,
    syncViewPadding: true,
    autoFit: true,
    tooltip: false,
    animation: false,
    xAxis: false,
    yAxis: {
      tickCount: 12,
      label: {
        style: {
          stroke: "transparent",
        },
      },
      grid: {
        line: {
          style: {
            stroke: "transparent",
          },
        },
      },
    },
    smooth: true,
    line: {
      color: primaryColor,
    },
    areaStyle: () => {
      return {
        fill: `l(270) 0:#fff 0.2${secondaryColor} 1:${primaryColor}`,
      };
    },
  };

  return (
    <Card style={{ height: "96px", padding: 0 }} bodyStyle={{ padding: "8px 8px 8px 12px" }} size="small">
      <div style={{ display: "flex", alignItems: "center", gap: "8px", whiteSpace: "nowrap" }}>
        {icon}
        <Text size="md" className="secondary" style={{ marginLeft: "8px" }}>
          {title}
        </Text>
      </div>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <Text
          size="xxxl"
          strong
          style={{
            flex: 1,
            whiteSpace: "nowrap",
            flexShrink: 0,
            textAlign: "start",
            marginLeft: "48px",
            fontVariantNumeric: "tabular-nums",
          }}
        >
          {isLoading ? (
            <Skeleton.Button
              style={{
                marginTop: "8px",
                width: "74px",
              }}
            />
          ) : (
            totalCount
          )}
        </Text>
        <Area {...config} style={{ width: "50%" }} />
      </div>
    </Card>
  );
};

export default DashboardTotalCountCard;
