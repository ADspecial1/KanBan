import { DashboardOutlined, ProjectOutlined, ShopOutlined,ContactsOutlined,DollarOutlined,FileTextOutlined 
} from "@ant-design/icons";
import { IResourceItem } from "@refinedev/core";

export const resources: IResourceItem[] = [
  {
    name: "dashboard",
    list: "/",
    meta: {
      label: "Dashboard",
      icon: <DashboardOutlined />,
    },
  },
  
  {
    name: "kanban-board",
    list:'/kanbanboard',
    show:'/kanbanboard/:id',
    create:'/kanbanboard/new',
    edit:'/kanbanboard/edit/:id',
    meta: {
      label: "Kanban Board",
      icon: <ProjectOutlined />,
    },
  },
  {
    name: "sales-pipeline",
    list:'/salespipeline',
    show:'/salespipeline/:id',
    create:'/salespipeline/new',
    edit:'/salespipeline/edit/:id',
    meta: {
      label: "Sales Pipeline",
      icon: <DollarOutlined />,
    },
  },
  {
    name: "companies",
    list: "/companies",
    show: "/companies/:id",
    create: "/companies/new",
    edit: "/companies/edit/:id",
    meta: {
      label: "Companies",
      icon: <ShopOutlined />,
    },
  },
  {
    name: "contacts",
    list:'/contacts',
    show:'/contacts/:id',
    create:'/contacts/new',
    edit:'/contacts/edit/:id',
    meta: {
      label: "Contacts",
      icon: <ContactsOutlined />,
    },
  },
  {
    name: "Calender",
    list:'/calender',
    show:'/calender/:id',
    create:'/calender/new',
    edit:'/calender/edit/:id',
    meta: {
      label: "Calender",
      icon: <FileTextOutlined  />,
    },
  },
];
