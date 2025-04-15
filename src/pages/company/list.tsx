// import { CreateButton, List } from "@refinedev/antd";
// import React from "react";
// import { getDefaultFilter, useGo, useTable } from "@refinedev/core";
// import { Table } from "antd";
// import { COMPANIES_LIST_QUERY } from "@/graphql/queries";
// import { SearchOutlined } from "@ant-design/icons";

// const CompanyList = () => {
//   const go = useGo();
//   const { tableProps, filters } = useTable({
//     resource: "companies",
//     pagination: {
//       pageSize: 12,
//     },
//     meta: {
//       gqlQuery: COMPANIES_LIST_QUERY,
//     },
//   });

//   console.log("Pagination Data:", tableProps?.pagination);

//   return (
//     <List
//       breadcrumb={false}
//       headerButtons={() => (
//         <CreateButton
//           onClick={() => {
//             go({
//               to: {
//                 resource: "companies",
//                 action: "create",
//               },
//               options: {
//                 keepQuery: true,
//               },
//               type: "replace",
//             });
//           }}
//         />
//       )}
//     >
//       <Table
//         {...tableProps}
//         pagination={{
//           current: tableProps?.pagination?.current || 1,
//           pageSize: tableProps?.pagination?.pageSize || 12,
//           total: tableProps?.pagination?.total || 100, // Assume 100 records
//         }}
//       >
//         <Table.Column
//           dataIndex="name"
//           title="Company Title"
//           defaultFilteredValue={getDefaultFilter("id", filters)}
//           filterIcon={<SearchOutlined />}
//         />
//       </Table>
//     </List>
//   );
// };

// export default CompanyList;


import { CreateButton, List } from "@refinedev/antd";
import React from "react";
import { useList, useGo } from "@refinedev/core";
import { Table } from "antd";

const CompanyList = () => {
  const go = useGo();

  // Firebase se direct data fetch karega
  const { data, isLoading } = useList({ resource: "company" });

  console.log("Fetched Companies:", data?.data);

  return (
    <List
      breadcrumb={false}
      headerButtons={() => (
        <CreateButton
          onClick={() => {
            go({
              to: {
                resource: "company",
                action: "create",
              },
              options: {
                keepQuery: true,
              },
              type: "replace",
            });
          }}
        />
      )}
    >
      <Table dataSource={data?.data || []} loading={isLoading} rowKey="id">
        <Table.Column title="Company Name" dataIndex="name" key="name" />
        <Table.Column title="Email" dataIndex="email" key="email" />
        <Table.Column title="Phone" dataIndex="phone" key="phone" />
      </Table>
    </List>
  );
};

export default CompanyList;
