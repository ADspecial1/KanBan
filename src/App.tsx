
// import {
//   Authenticated,
//   GitHubBanner,
//   Refine,
//   WelcomePage,
// } from "@refinedev/core";
// import { DevtoolsPanel, DevtoolsProvider } from "@refinedev/devtools";
// import { RefineKbar, RefineKbarProvider } from "@refinedev/kbar";

// import { useNotificationProvider } from "@refinedev/antd";
// import "@refinedev/antd/dist/reset.css";

// import { authProvider, dataProvider, liveProvider } from "./providers";

// import { Home, ForgotPassword, Login, Register } from "./pages";

// import routerBindings, {
//   CatchAllNavigate,
//   DocumentTitleHandler,
//   UnsavedChangesNotifier,
// } from "@refinedev/react-router-v6";
// import { App as AntdApp } from "antd";
// import { BrowserRouter, Outlet, Route, Routes } from "react-router-dom";
// import Layout from "./components/layout";
// import { resources } from "./confiq/resources";
// import { ThemedLayoutV2 } from "@refinedev/antd";
// import { AuthPage } from "@refinedev/antd";
// import Contacts from "./pages/contact/contact";
// import Events from "./pages/events/Events";
// import { SalesPipeline } from "./pages/salespine/salesPipeline";
// import CompanyList from "./pages/company/CompanyList";
// import "@refinedev/antd/dist/reset.css";
// import KanbanBoard from "./pages/kanban/kanban";
// // import { KanbanBoard } from "./pages/kanban/kanban";
// import "./leaflet.css";
// import DeveloperPanel from './Dev/DeveloperPanel'




// function App() {
//   return (
//     <BrowserRouter>
//       <GitHubBanner />
//       <RefineKbarProvider>
//         <AntdApp>
//           <DevtoolsProvider>
//             <Refine
//               dataProvider={dataProvider}
//               liveProvider={liveProvider}
//               notificationProvider={useNotificationProvider}
//               routerProvider={routerBindings}
//               authProvider={authProvider}
//               Layout={ThemedLayoutV2}
//               resources={resources}
//               Layout={(props) => (
//                 <ThemedLayoutV2 {...props} Title={CustomTitle} />
//               )}
//               options={{
//                 syncWithLocation: true,
//                 warnWhenUnsavedChanges: true,
//                 useNewQueryKeys: true,
//                 projectId: "eRpdf5-Wq2WUG-NrE0J8",
//                 liveMode: "auto",
//               }}
//             >
//               <Routes>
//                 <Route
//                   path="/register"
//                   element={<Register/>}
//                 />
//                 <Route path="/login" element={<Login />} />
//                 <Route path="/forget-password" element={<ForgotPassword />} />
//                 <Route
//                   element={
//                     <Authenticated
//                       key="authenticated-layout"
//                       fallback={<CatchAllNavigate to="/login" />}
//                     >
//                       <Layout>
//                         <Outlet />
//                       </Layout>
//                     </Authenticated>
//                   }
//                 >
//                   <Route path="/" element={<Home />} />
//                   <Route path="developer-dashboard" element={<DeveloperPanel />} />

//                   <Route path="contacts" element={<Contacts />} />
//                   <Route path="calender" element={<Events />} />
//                   <Route path="salespipeline" element={<SalesPipeline />} />
//                   <Route path="companies" element={<CompanyList />} />
//                   <Route path="kanbanboard" element={<KanbanBoard />} />
//                 </Route>
//               </Routes>

//               <RefineKbar />
//               <UnsavedChangesNotifier />
//               <DocumentTitleHandler />
//             </Refine>
//             <DevtoolsPanel />
//           </DevtoolsProvider>
//         </AntdApp>
//       </RefineKbarProvider>
//     </BrowserRouter>
//   );
// }

// export default App;


import {
  Authenticated,
  GitHubBanner,
  Refine,
  WelcomePage,
} from "@refinedev/core";
import { DevtoolsPanel, DevtoolsProvider } from "@refinedev/devtools";
import { RefineKbar, RefineKbarProvider } from "@refinedev/kbar";
import { useNotificationProvider } from "@refinedev/antd";
import "@refinedev/antd/dist/reset.css";

import { authProvider, dataProvider, liveProvider } from "./providers";

import { Home, ForgotPassword, Login, Register } from "./pages";
import routerBindings, {
  CatchAllNavigate,
  DocumentTitleHandler,
  UnsavedChangesNotifier,
} from "@refinedev/react-router-v6";
import { App as AntdApp } from "antd";
import { BrowserRouter, Outlet, Route, Routes } from "react-router-dom";
import Layout from "./components/layout";
import { resources } from "./confiq/resources";
import { ThemedLayoutV2 } from "@refinedev/antd";
import { AuthPage } from "@refinedev/antd";
import Contacts from "./pages/contact/contact";
import Events from "./pages/events/Events";
import { SalesPipeline } from "./pages/salespine/salesPipeline";
import CompanyList from "./pages/company/CompanyList";
import KanbanBoard from "./pages/kanban/kanban";



function App() {
  return (
    <BrowserRouter>
      <GitHubBanner />
      <RefineKbarProvider>
        <AntdApp>
          <DevtoolsProvider>
            <Refine
              dataProvider={dataProvider}
              liveProvider={liveProvider}
              notificationProvider={useNotificationProvider}
              routerProvider={routerBindings}
              authProvider={authProvider}
              Layout={ThemedLayoutV2}
              resources={resources}
              Layout={(props) => (
                <ThemedLayoutV2 {...props} Title={CustomTitle} />
              )}
              options={{
                syncWithLocation: true,
                warnWhenUnsavedChanges: true,
                useNewQueryKeys: true,
                projectId: "eRpdf5-Wq2WUG-NrE0J8",
                liveMode: "auto",
              }}
            >
              <Routes>
                <Route path="/register" element={<Register />} />
                <Route path="/login" element={<Login />} />
                <Route path="/forget-password" element={<ForgotPassword />} />
                
                {/* Authenticated Route */}
                <Route
                  element={
                    <Authenticated
                      key="authenticated-layout"
                      fallback={<CatchAllNavigate to="/login" />}
                    >
                      <Layout>
                        <Outlet />
                      </Layout>
                    </Authenticated>
                  }
                >
                  <Route path="/" element={<Home />} />
                  <Route path="contacts" element={<Contacts />} />
                  <Route path="calender" element={<Events />} />
                  <Route path="salespipeline" element={<SalesPipeline />} />
                  <Route path="companies" element={<CompanyList />} />
                  <Route path="kanbanboard" element={<KanbanBoard />} />
                </Route>
              </Routes>

              <RefineKbar />
              <UnsavedChangesNotifier />
              <DocumentTitleHandler />
            </Refine>
            <DevtoolsPanel />
          </DevtoolsProvider>
        </AntdApp>
      </RefineKbarProvider>
    </BrowserRouter>
  );
}

export default App;
