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
    path: "/positionType",
    name: "职位类型",
    icon: IconCalendar,
    children: [
      { path: "/positionType/category1", name: "一级分类", icon: "" },
      { path: "/positionType/category2", name: "二级分类", icon: "" },
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
  {
    path: "/company",
    name: "公司管理",
    icon: IconCalendar,
    children: [
      { path: "/company/manger", name: "公司列表", icon: "" },
      { path: "/company/audit", name: "公司审核", icon: "" },
    ],
  },
  { path: "/user", name: "用户管理", icon: IconHome },
  { path: "/manger", name: "管理员", icon: IconHome },
  { path: "/profile", name: "个人中心", icon: IconHome },
];