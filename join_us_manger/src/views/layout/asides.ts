import {
  IconHome,
  IconCalendar,
} from "@arco-design/web-vue/es/icon";

type TAside = {
  path: string;
  icon: any;
  name: string;
  children?: TAside[];
};

export const asideList: TAside[] = [
  { path: "/statistics", name: "数据统计", icon: IconHome },
  { path: "/consult", name: "咨讯百科", icon: IconHome },
  {
    path: "/industry",
    name: "行业管理",
    icon: IconCalendar,
    children: [
      { path: "/industry/manger", name: "行业列表", icon: "" },
    ],
  },
  {
    path: "/position",
    name: "职位管理",
    icon: IconCalendar,
    children: [
      { path: "/position/manger", name: "职位列表", icon: "" },
      { path: "/position/audit", name: "职位审核", icon: "" },
    ],
  },
  { path: "/manger", name: "管理员", icon: IconHome },
  { path: "/profile", name: "个人中心", icon: IconHome },
];