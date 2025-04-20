// import { DollarOutlined } from "@ant-design/icons";
// import { Card } from "antd";
// import React from "react";
// import { Text } from "../text";
// import { Area, AreaConfig } from "@ant-design/plots";
// import { useList } from "@refinedev/core";
// import { DASHBOARD_DEALS_CHART_QUERY } from "@/graphql/queries";
// import { mapDealsData } from "@/utilities/helpers";
// import { GetFieldsFromList } from "@refinedev/nestjs-query";
// import { DashboardDealsChartQuery } from "@/graphql/types";

// const DealsCharts = () => {
//   const { data } = useList<GetFieldsFromList<DashboardDealsChartQuery>>({
//     resource: "dealStages",
//     filters: [
//       {
//         field: "title",
//         operator: "in",
//         value: ["WON", "LOST"],
//       },
//     ],
//     meta: {
//       gqlQuery: DASHBOARD_DEALS_CHART_QUERY,
//     },
//   });

//   const dealData = React.useMemo(() => {
//     return mapDealsData(data?.data);
//   }, [data?.data]);

//   const config: AreaConfig = {
//     data: dealData,
//     xField: "timeText",
//     yField: "value",
//     isStack: false,
//     seriesField: "state",
//     animation: true,
//     startOnZero: false,
//     smooth: true,
//     legend: {
//       offsetY: -6,
//     },

//     yAxis: {
//       tickCount: 4,
//       label: {
//         formatter: (v: string) => {
//           return `₹${Number(v) / 1000}k`;
//         },
//       },
//     },
//     tooltip: {
//       formatter: (data) => {
//         return {
//           name: data.state,
//           value: `₹${Number(data.value) / 1000}k`,
//         };
//       },
//     },
//   };

//   return (
//     <Card
//       style={{ height: "100%" }}
//       headStyle={{ padding: "8px 16px" }}
//       bodyStyle={{ padding: "24px 24px 0 24px" }}
//       title={
//         <div
//           style={{
//             display: "flex",
//             alignItems: "center",
//             gap: "8px",
//           }}
//         >
//           <DollarOutlined />
//           <Text size="sm" style={{ marginLeft: "0.5rem" }}>
//             Deals
//           </Text>
//         </div>
//       }
//     >
//       <Area {...config} height={325} />
//     </Card>
//   );
// };

// export default DealsCharts;

// src/pages/home/components/deals-chart.tsx



// import React, { useEffect, useState } from "react";
// import { Card, Row, Col, Statistic, Spin, Typography } from "antd";
// import { ArrowUpOutlined, ArrowDownOutlined, DollarOutlined } from "@ant-design/icons";
// import {
//   ResponsiveContainer,
//   ComposedChart,
//   XAxis,
//   YAxis,
//   Tooltip,
//   Legend,
//   Bar,
//   CartesianGrid,
// } from "recharts";
// import { getDocs, collection, query, where } from "firebase/firestore";
// import { auth, db } from "../../firebase/firebase";

// const { Text } = Typography;

// interface Deal {
//   date: string;    // "MM/DD/YYYY" from Firestore
//   status: string;  // "won" or "lost"
//   amount: number;
//   userId: string;
// }

// interface ChartRow {
//   date: string;    // e.g. "17 Apr"
//   WON: number;
//   LOST: number;
// }

// const DealsChart: React.FC = () => {
//   const [loading, setLoading] = useState(true);
//   const [chartData, setChartData] = useState<ChartRow[]>([]);
//   const [totalWon, setTotalWon] = useState(0);
//   const [totalLost, setTotalLost] = useState(0);

//   useEffect(() => {
//     const fetch = async () => {
//       const user = auth.currentUser;
//       if (!user) return;

//       // 1) load all deals for this user
//       const q = query(
//         collection(db, "sales_pipeline"),
//         where("userId", "==", user.email)
//       );
//       const snap = await getDocs(q);

//       let won = 0;
//       let lost = 0;
//       const byDate: Record<string, { WON: number; LOST: number }> = {};

//       snap.forEach(doc => {
//         const d = doc.data() as Deal;
//         const amt = Number(d.amount) || 0;
//         const status = d.status.toUpperCase() === "WON" ? "WON" : "LOST";
//         // accumulate totals
//         if (status === "WON") won += amt;
//         else lost += amt;

//         // normalize date to DD MMM
//         const [m, day, y] = d.date.split("/");
//         const dateKey = new Date(+y, +m - 1, +day).toLocaleDateString("en-GB", {
//           day: "2-digit",
//           month: "short",
//         });

//         if (!byDate[dateKey]) byDate[dateKey] = { WON: 0, LOST: 0 };
//         byDate[dateKey][status] += amt;
//       });

//       // 2) build array sorted by date
//       const rows: ChartRow[] = Object.entries(byDate)
//         .sort(
//           ([a], [b]) =>
//             new Date(a).getTime() - new Date(b).getTime()
//         )
//         .map(([date, vals]) => ({
//           date,
//           WON: vals.WON,
//           LOST: vals.LOST,
//         }));

//       setChartData(rows);
//       setTotalWon(won);
//       setTotalLost(lost);
//       setLoading(false);
//     };

//     fetch();
//   }, []);

//   if (loading) {
//     return (
//       <div style={{ textAlign: "center", marginTop: 80 }}>
//         <Spin size="large" />
//       </div>
//     );
//   }

//   return (
//     <Card
//       title={
//         <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
//           <DollarOutlined />
//           <Text strong>Deals Overview</Text>
//         </div>
//       }
//       style={{ borderRadius: 8 }}
//     >
//       <Row gutter={16} style={{ marginBottom: 24 }}>
//         <Col span={12}>
//           <Statistic
//             title="Total WON"
//             value={totalWon}
//             prefix={<ArrowUpOutlined style={{ color: "#3f8600" }} />}
//             valueStyle={{ color: "#3f8600" }}
//             formatter={(val) => `₹${val}`}
//           />
//         </Col>
//         <Col span={12}>
//           <Statistic
//             title="Total LOST"
//             value={totalLost}
//             prefix={<ArrowDownOutlined style={{ color: "#cf1322" }} />}
//             valueStyle={{ color: "#cf1322" }}
//             formatter={(val) => `₹${val}`}
//           />
//         </Col>
//       </Row>

//       <ResponsiveContainer width="100%" height={300}>
//         <ComposedChart data={chartData} margin={{ top: 10, right: 20, bottom: 5, left: 0 }}>
//           <CartesianGrid stroke="#f5f5f5" />
//           <XAxis dataKey="date" />
//           <YAxis tickFormatter={(v) => `₹${v}`} />
//           <Tooltip formatter={(value: number, name: string) => [`₹${value}`, name]} />
//           <Legend />
//           <Bar dataKey="WON" stackId="a" fill="#22c55e" />
//           <Bar dataKey="LOST" stackId="a" fill="#ef4444" />
//         </ComposedChart>
//       </ResponsiveContainer>
//     </Card>
//   );
// };

// export default DealsChart;


// import React, { useEffect, useState } from "react";
// import { Card, Row, Col, Statistic, Spin, Typography } from "antd";
// import { ArrowUpOutlined, ArrowDownOutlined, DollarOutlined } from "@ant-design/icons";
// import {
//   ResponsiveContainer,
//   LineChart,
//   Line,
//   XAxis,
//   YAxis,
//   Tooltip,
//   Legend,
//   CartesianGrid,
// } from "recharts";
// import { getDocs, collection, query, where } from "firebase/firestore";
// import { auth, db } from "../../firebase/firebase";

// const { Text } = Typography;

// interface Deal {
//   date: string;      // Firestore: "MM/DD/YYYY"
//   status: string;    // "won" or "lost"
//   amount: number;
//   userId: string;
// }

// interface DataPoint {
//   date: string;      // e.g. "17 Apr"
//   WON: number;
//   LOST: number;
// }

// const DealsLineChart: React.FC = () => {
//   const [loading, setLoading] = useState(true);
//   const [data, setData] = useState<DataPoint[]>([]);
//   const [totalWon, setTotalWon] = useState(0);
//   const [totalLost, setTotalLost] = useState(0);

//   useEffect(() => {
//     const fetch = async () => {
//       const user = auth.currentUser;
//       if (!user) return;

//       const q = query(
//         collection(db, "sales_pipeline"),
//         where("userId", "==", user.email)
//       );
//       const snap = await getDocs(q);

//       let wonSum = 0, lostSum = 0;
//       const mapByDate: Record<string, { WON: number; LOST: number }> = {};

//       snap.forEach(doc => {
//         const d = doc.data() as Deal;
//         const amt = Number(d.amount) || 0;
//         if (d.status === "won") wonSum += amt;
//         else if (d.status === "lost") lostSum += amt;

//         const [m, day, y] = d.date.split("/");
//         const key = new Date(+y, +m - 1, +day)
//           .toLocaleDateString("en-GB", { day: "2-digit", month: "short" });

//         if (!mapByDate[key]) mapByDate[key] = { WON: 0, LOST: 0 };
//         mapByDate[key][d.status.toUpperCase() === "WON" ? "WON" : "LOST"] += amt;
//       });

//       const points: DataPoint[] = Object.entries(mapByDate)
//         .sort(([a], [b]) => new Date(a).getTime() - new Date(b).getTime())
//         .map(([date, vals]) => ({ date, WON: vals.WON, LOST: vals.LOST }));

//       setData(points);
//       setTotalWon(wonSum);
//       setTotalLost(lostSum);
//       setLoading(false);
//     };
//     fetch();
//   }, []);

//   if (loading) {
//     return (
//       <div style={{ textAlign: "center", marginTop: 80 }}>
//         <Spin size="large" />
//       </div>
//     );
//   }

//   return (
//     <Card
//       title={
//         <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
//           <DollarOutlined />
//           <Text strong>Deal Trends</Text>
//         </div>
//       }
//       style={{ borderRadius: 8 }}
//     >
//       <Row gutter={16} style={{ marginBottom: 24 }}>
//         <Col span={12}>
//           <Statistic
//             title="Total WON"
//             value={totalWon}
//             prefix={<ArrowUpOutlined style={{ color: "#3f8600" }} />}
//             valueStyle={{ color: "#3f8600" }}
//             formatter={v => `₹${v}`}
//           />
//         </Col>
//         <Col span={12}>
//           <Statistic
//             title="Total LOST"
//             value={totalLost}
//             prefix={<ArrowDownOutlined style={{ color: "#cf1322" }} />}
//             valueStyle={{ color: "#cf1322" }}
//             formatter={v => `₹${v}`}
//           />
//         </Col>
//       </Row>

//       <ResponsiveContainer width="100%" height={300}>
//         <LineChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
//           <CartesianGrid stroke="#f5f5f5" />
//           <XAxis dataKey="date" />
//           <YAxis tickFormatter={v => `₹${v}`} />
//           <Tooltip formatter={(value) => `₹${value}`} />
//           <Legend verticalAlign="top" height={36}/>
//           <Line
//             type="monotone"
//             dataKey="WON"
//             stroke="#22c55e"
//             strokeWidth={2}
//             dot={{ r: 4 }}
//           />
//           <Line
//             type="monotone"
//             dataKey="LOST"
//             stroke="#ef4444"
//             strokeWidth={2}
//             dot={{ r: 4 }}
//           />
//         </LineChart>
//       </ResponsiveContainer>
//     </Card>
//   );
// };

// export default DealsLineChart;

// import React, { useEffect, useState, useMemo } from "react";
// import { Card, Row, Col, Statistic, Typography } from "antd";
// import { Line } from "@ant-design/plots";
// import {
//   DollarOutlined,
//   ArrowUpOutlined,
//   ArrowDownOutlined,
// } from "@ant-design/icons";
// import { collection, getDocs, query, where } from "firebase/firestore";
// import { auth, db } from "../../firebase/firebase";
// // At the top:
// import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";


// const { Text } = Typography;

// interface Deal {
//   date: string;            // ex: "4/17/2025"
//   status: "won" | "lost";
//   amount: number;
// }

// interface Point {
//   timeText: string;        // "2025-04-17"
//   state: "WON" | "LOST";
//   value: number;
// }

// const DealsFlowChart: React.FC = () => {
//   const [deals, setDeals] = useState<Deal[]>([]);
//   const [wonTotal, setWonTotal] = useState(0);
//   const [lostTotal, setLostTotal] = useState(0);

//   // 1) load all deals for the signed‑in user
//   useEffect(() => {
//     (async () => {
//       const u = auth.currentUser;
//       if (!u) return;

//       const q = query(
//         collection(db, "sales_pipeline"),
//         where("userId", "==", u.email)
//       );
//       const snap = await getDocs(q);

//       let w = 0,
//         l = 0;
//       const arr: Deal[] = [];

//       snap.forEach((d) => {
//         const data = d.data() as any;
//         const amt = Number(data.amount) || 0;
//         const st = data.status.toLowerCase() === "won" ? "won" : "lost";
//         arr.push({ date: data.date, status: st, amount: amt });
//         st === "won" ? (w += amt) : (l += amt);
//       });

//       setDeals(arr);
//       setWonTotal(w);
//       setLostTotal(l);
//     })();
//   }, []);

//   // 2) group by ISO date, split into WON/LOST series
//   const flowData: Point[] = useMemo(() => {
//     const grouped: Record<string, { WON: number; LOST: number }> = {};

//     for (const { date, status, amount } of deals) {
//       const dt = new Date(date);
//       if (isNaN(dt.getTime())) continue;
//       const day = dt.toISOString().slice(0, 10);
//       if (!grouped[day]) grouped[day] = { WON: 0, LOST: 0 };
//       grouped[day][status.toUpperCase() as "WON" | "LOST"] += amount;
//     }

//     return Object.keys(grouped)
//       .sort()
//       .flatMap((day) => [
//         { timeText: day, state: "WON", value: grouped[day].WON },
//         { timeText: day, state: "LOST", value: grouped[day].LOST },
//       ]);
//   }, [deals]);

//   // 3) line config for a free‑flow curve
//   const config = {
//     data: flowData,
//     xField: "timeText",
//     yField: "value",
//     seriesField: "state",
//     smooth: true,              // smooth, flowing line
//     startOnZero: true,         // always starts Y axis at 0
//     xAxis: {
//       label: {
//         formatter: (t: string) => new Date(t).toLocaleDateString(),
//       },
//     },
//     yAxis: {
//       min: 0,
//       label: {
//         formatter: (v: number) => `₹${v}`,
//       },
//     },
//     tooltip: {
//       formatter: (d: Point) => ({
//         name: d.state,
//         value: `₹${d.value}`,
//       }),
//     },
//     interactions: [{ type: "marker-active" }],
//     legend: { position: "top" },
//   };

//   return (
//     <Card
//       title={
//         <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
//           <DollarOutlined />
//           <Text>Deal Flow</Text>
//         </div>
//       }
//       style={{ borderRadius: 8 }}
//       bodyStyle={{ padding: 24 }}
//     >
//       {/* Totals */}
//       <Row gutter={16} style={{ marginBottom: 24 }}>
//         <Col span={12}>
//           <Statistic
//             title="Total WON"
//             value={wonTotal}
//             prefix={<ArrowUpOutlined style={{ color: "#3f8600" }} />}
//             valueStyle={{ color: "#3f8600" }}
//             formatter={(v) => `₹${v}`}
//           />
//         </Col>
//         <Col span={12}>
//           <Statistic
//             title="Total LOST"
//             value={lostTotal}
//             prefix={<ArrowDownOutlined style={{ color: "#cf1322" }} />}
//             valueStyle={{ color: "#cf1322" }}
//             formatter={(v) => `₹${v}`}
//           />
//         </Col>
//       </Row>

//       {/* Free‑flow line chart */}
//       <Line {...config} height={300} />
//     </Card>
//   );
// };

// export default DealsFlowChart;


import React, { useEffect, useState } from "react";
import { Card, Row, Col, Statistic, Typography, Spin, Badge, Divider } from "antd";
import { ArrowUpOutlined, ArrowDownOutlined, DollarOutlined, TrophyOutlined, FileExclamationOutlined } from "@ant-design/icons";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from "recharts";
import { collection, getDocs, query, where } from "firebase/firestore";
import { auth, db } from "../../firebase/firebase";

const { Text, Title } = Typography;

interface Deal {
  date: string;
  status: string;
  amount: number;
}

interface ChartData {
  date: string;
  fullDate: Date;
  WON: number;
  LOST: number;
}

const DealsAnalyticsDashboard: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [totalWon, setTotalWon] = useState(0);
  const [totalLost, setTotalLost] = useState(0);
  const [totalDeals, setTotalDeals] = useState(0);
  const [winRate, setWinRate] = useState(0);

  useEffect(() => {
    const fetchDeals = async () => {
      const user = auth.currentUser;
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        const q = query(
          collection(db, "sales_pipeline"),
          where("userId", "==", user.email)
        );
        
        const snap = await getDocs(q);
        
        let wonTotal = 0;
        let lostTotal = 0;
        let wonCount = 0;
        let lostCount = 0;
        const dealsByDate: Record<string, { WON: number; LOST: number, date: Date }> = {};

        snap.forEach(doc => {
          const deal = doc.data() as Deal;
          const amount = Number(deal.amount) || 0;
          const status = deal.status.toUpperCase() === "WON" ? "WON" : "LOST";
          
          // Update totals
          if (status === "WON") {
            wonTotal += amount;
            wonCount++;
          } else {
            lostTotal += amount;
            lostCount++;
          }

          try {
            // Parse date "MM/DD/YYYY"
            const [month, day, year] = deal.date.split('/').map(Number);
            const dateObj = new Date(year, month - 1, day);
            
            if (isNaN(dateObj.getTime())) return;
            
            // Format as "DD MMM" for display
            const displayDate = dateObj.toLocaleDateString("en-GB", {
              day: "2-digit",
              month: "short",
            });
            
            if (!dealsByDate[displayDate]) {
              dealsByDate[displayDate] = { WON: 0, LOST: 0, date: dateObj };
            }
            
            dealsByDate[displayDate][status] += amount;
          } catch (e) {
            console.error("Error parsing date:", deal.date, e);
          }
        });

        // Calculate win rate
        const totalCount = wonCount + lostCount;
        const calculatedWinRate = totalCount > 0 ? (wonCount / totalCount) * 100 : 0;
        
        // Convert to array and sort by date
        const formattedData = Object.entries(dealsByDate)
          .map(([date, data]) => ({
            date,
            fullDate: data.date,
            WON: data.WON,
            LOST: data.LOST
          }))
          .sort((a, b) => a.fullDate.getTime() - b.fullDate.getTime());

        setChartData(formattedData);
        setTotalWon(wonTotal);
        setTotalLost(lostTotal);
        setTotalDeals(totalCount);
        setWinRate(Math.round(calculatedWinRate));
      } catch (error) {
        console.error("Error fetching deals:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDeals();
  }, []);

  const formatCurrency = (value: number) => {
    if (value >= 100000) {
      return `₹${(value / 100000).toFixed(1)}L`;
    }
    return `₹${(value / 1000).toFixed(0)}k`;
  };

  const getStatusColor = (status: string) => {
    return status === "WON" ? "#22c55e" : "#ef4444";
  };

  const pieData = [
    { name: "Won Deals", value: totalWon, color: "#22c55e" },
    { name: "Lost Deals", value: totalLost, color: "#ef4444" }
  ];

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="custom-tooltip" style={{ 
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          padding: '10px',
          border: '1px solid #f0f0f0',
          borderRadius: '4px',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)'
        }}>
          <p className="label" style={{ margin: 0, fontWeight: 500 }}>{`Date: ${label}`}</p>
          <div style={{ height: '1px', backgroundColor: '#f0f0f0', margin: '5px 0' }} />
          {payload.map((entry: any, index: number) => (
            <p key={`item-${index}`} style={{ 
              color: entry.color,
              margin: '3px 0',
              display: 'flex',
              justifyContent: 'space-between'
            }}>
              <span style={{ marginRight: '20px' }}>{entry.name}:</span>
              <span style={{ fontWeight: 500 }}>{formatCurrency(entry.value)}</span>
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  if (loading) {
    return (
      <Card style={{ borderRadius: 12, boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)', height: "100%" }}>
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: 400 }}>
          <Spin size="large" tip="Loading your deals data..." />
        </div>
      </Card>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Header Stats */}
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={6}>
          <Card 
            style={{ 
              borderRadius: 12, 
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)', 
              height: '100%' 
            }}
            bodyStyle={{ padding: '24px' }}
          >
            <Statistic
              title={<Text style={{ fontSize: '14px', color: '#6b7280' }}>TOTAL REVENUE</Text>}
              value={totalWon + totalLost}
              prefix={<DollarOutlined />}
              valueStyle={{ color: '#334155', fontWeight: 600 }}
              formatter={(val) => formatCurrency(Number(val))}
            />
            <div style={{ marginTop: '8px' }}>
              <Text type="secondary">From {totalDeals} deals</Text>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card 
            style={{ 
              borderRadius: 12, 
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)', 
              height: '100%',
              background: 'linear-gradient(120deg, #f0fdf4 0%, #d1fae5 100%)'
            }}
            bodyStyle={{ padding: '24px' }}
          >
            <Statistic
              title={<Text style={{ fontSize: '14px', color: '#15803d' }}>WON DEALS</Text>}
              value={totalWon}
              prefix={<ArrowUpOutlined />}
              valueStyle={{ color: '#15803d', fontWeight: 600 }}
              formatter={(val) => formatCurrency(Number(val))}
            />
            <div style={{ marginTop: '8px' }}>
              <Badge color="#22c55e" text={<Text style={{ color: '#15803d' }}>Success rate: {winRate}%</Text>} />
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card 
            style={{ 
              borderRadius: 12, 
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)', 
              height: '100%',
              background: 'linear-gradient(120deg, #fef2f2 0%, #fee2e2 100%)'
            }}
            bodyStyle={{ padding: '24px' }}
          >
            <Statistic
              title={<Text style={{ fontSize: '14px', color: '#b91c1c' }}>LOST DEALS</Text>}
              value={totalLost}
              prefix={<ArrowDownOutlined />}
              valueStyle={{ color: '#b91c1c', fontWeight: 600 }}
              formatter={(val) => formatCurrency(Number(val))}
            />
            <div style={{ marginTop: '8px' }}>
              <Badge color="#ef4444" text={<Text style={{ color: '#b91c1c' }}>Loss rate: {100 - winRate}%</Text>} />
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card 
            style={{ 
              borderRadius: 12, 
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)', 
              height: '100%',
              background: 'linear-gradient(120deg, #f0f9ff 0%, #e0f2fe 100%)'
            }}
            bodyStyle={{ padding: '24px' }}
          >
            <Statistic
              title={<Text style={{ fontSize: '14px', color: '#0369a1' }}>WIN RATIO</Text>}
              value={winRate}
              suffix="%"
              prefix={<TrophyOutlined />}
              valueStyle={{ color: '#0369a1', fontWeight: 600 }}
            />
            <div style={{ marginTop: '8px' }}>
              <Text type="secondary">Based on {totalDeals} total deals</Text>
            </div>
          </Card>
        </Col>
      </Row>

      {/* Main Chart */}
      

      {/* Bottom Charts */}
      <Row gutter={[16, 16]}>
        
        <Col xs={24} lg={12}>
          <Card
            title={
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <TrophyOutlined style={{ color: '#334155' }} />
                <Text strong style={{ fontSize: '16px', margin: 0 }}>Revenue Distribution</Text>
              </div>
            }
            style={{ borderRadius: 12, boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)', height: '100%' }}
            bodyStyle={{ padding: "24px" }}
          >
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '300px' }}>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={100}
                    innerRadius={60}
                    fill="#8884d8"
                    dataKey="value"
                    nameKey="name"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value) => formatCurrency(Number(value))}
                  />
                  <Legend 
                    layout="horizontal" 
                    verticalAlign="bottom" 
                    align="center"
                    iconType="circle"
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card
            title={
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <FileExclamationOutlined style={{ color: '#334155' }} />
                <Text strong style={{ fontSize: '16px', margin: 0 }}>Monthly Performance</Text>
              </div>
            }
            style={{ borderRadius: 12, boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)', height: '100%' }}
            bodyStyle={{ padding: "24px" }}
          >
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={chartData}
                margin={{ top: 10, right: 30, left: 0, bottom: 5 }}
                barGap={0}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f5f5f5" />
                <XAxis 
                  dataKey="date" 
                  tick={{ fontSize: 12, fill: '#64748b' }}
                  axisLine={{ stroke: '#e2e8f0' }}
                  tickLine={{ stroke: '#e2e8f0' }}
                />
                <YAxis 
                  tickFormatter={formatCurrency} 
                  tick={{ fontSize: 12, fill: '#64748b' }}
                  axisLine={{ stroke: '#e2e8f0' }}
                  tickLine={{ stroke: '#e2e8f0' }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend 
                  wrapperStyle={{ paddingTop: 15 }}
                  iconType="circle"
                />
                <Bar 
                  dataKey="WON" 
                  name="Won Deals" 
                  fill="#22c55e" 
                  radius={[4, 4, 0, 0]} 
                />
                <Bar 
                  dataKey="LOST" 
                  name="Lost Deals" 
                  fill="#ef4444" 
                  radius={[4, 4, 0, 0]} 
                />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </Col>
      </Row>
      <Card
        title={
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <DollarOutlined style={{ color: '#334155' }} />
            <Text strong style={{ fontSize: '16px', margin: 0 }}>Deals Performance Analysis</Text>
          </div>
        }
        style={{ borderRadius: 12, boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)' }}
        bodyStyle={{ padding: "24px" }}
        extra={
          <Badge 
            count={`${totalDeals} deals`} 
            style={{ backgroundColor: '#334155', borderRadius: '12px' }} 
          />
        }
      >
        <ResponsiveContainer width="100%" height={350}>
          <AreaChart
            data={chartData}
            margin={{ top: 10, right: 30, left: 0, bottom: 5 }}
          >
            <defs>
              <linearGradient id="colorWon" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#22c55e" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#22c55e" stopOpacity={0.1}/>
              </linearGradient>
              <linearGradient id="colorLost" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ef4444" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#ef4444" stopOpacity={0.1}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f5f5f5" />
            <XAxis 
              dataKey="date" 
              tick={{ fontSize: 12, fill: '#64748b' }}
              axisLine={{ stroke: '#e2e8f0' }}
              tickLine={{ stroke: '#e2e8f0' }}
            />
            <YAxis 
              tickFormatter={formatCurrency} 
              tick={{ fontSize: 12, fill: '#64748b' }}
              axisLine={{ stroke: '#e2e8f0' }}
              tickLine={{ stroke: '#e2e8f0' }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend 
              wrapperStyle={{ paddingTop: 15 }}
              iconType="circle"
            />
            <Area 
              type="monotone" 
              dataKey="WON" 
              name="Won Deals" 
              stroke="#22c55e" 
              fillOpacity={1} 
              fill="url(#colorWon)" 
              strokeWidth={2}
              activeDot={{ r: 6, strokeWidth: 0 }}
            />
            <Area 
              type="monotone" 
              dataKey="LOST" 
              name="Lost Deals" 
              stroke="#ef4444" 
              fillOpacity={1} 
              fill="url(#colorLost)" 
              strokeWidth={2}
              activeDot={{ r: 6, strokeWidth: 0 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </Card>
    </div>
  );
};

export default DealsAnalyticsDashboard; 