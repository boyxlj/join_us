import {
  IconHome,
  IconCalendar,
  IconSettings,
  IconComputer,
  IconCommand,
  IconCommon,
  IconRelation,
  IconThunderbolt,
  IconUser,
  IconIdcard,
  IconBook,
  IconUserGroup,
  IconList,
  IconLayers,
  IconBarChart,
  IconArchive,
  IconUnorderedList,
  IconOrderedList,
} from "@arco-design/web-vue/es/icon";

type TAside = {
  path: string;
  icon: any;
  name: string;
  right?:boolean,
  children?: TAside[];
};

export const asideList: TAside[] = [
  { path: "/statistics", name: "数据统计", icon: IconComputer },
  { path: "/consult", name: "咨讯百科", icon: IconLayers },
  {
    path: "/industry",
    name: "行业管理",
    icon: IconArchive,
    children: [
      { path: "/industry/manger", name: "行业列表", icon: IconList },
    ],
  },
  {
    path: "/positionType",
    name: "职位类型",
    icon: IconBarChart,
    children: [
      { path: "/positionType/category1", name: "一级分类", icon: IconUnorderedList },
      { path: "/positionType/category2", name: "二级分类", icon: IconOrderedList },
    ],
  },
  {
    path: "/position",
    name: "职位管理",
    icon: IconCommon,
    children: [
      { path: "/position/manger", name: "职位列表", icon: IconList },
      { path: "/position/audit", name: "职位审核", icon: IconRelation },
    ],
  },
  {
    path: "/company",
    name: "公司管理",
    icon: IconCommand,
    children: [
      { path: "/company/manger", name: "公司列表", icon: IconList },
      { path: "/company/audit", name: "公司审核", icon: IconRelation },
      { path: "/company/hr", name: "人事管理", icon: IconUserGroup },
    ],
  },
  {
    path: "/setting",
    name: "动态配置",
    icon: IconSettings,
    children: [
      { path: "/setting/swiper", name: "轮播管理", icon: IconBook },
    ],
  },
  { path: "/user", name: "用户管理", icon: IconUser },
  { path: "/manger", name: "管理员", icon: IconThunderbolt,right:true },
  { path: "/profile", name: "个人中心", icon: IconIdcard },
];