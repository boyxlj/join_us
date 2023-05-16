import { RouteRecordRaw } from "vue-router"

function lazyLoad(path: string) {
  return () => import(`@/views/${path}/index.vue`)
}



export const routes: RouteRecordRaw[] = [
  {
    path: "/",
    component: lazyLoad('layout'),
    redirect:"statistics",
    children: [
      {
        path: "statistics",
        component: lazyLoad('statistics'),
        meta: { title: "数据统计" }
      },
      {
        path: "consult",
        component: lazyLoad('consult'),
        meta: { title: "资讯百科" }
      },
      {
        path: "positionType/category1",
        component: () => import("@/views/positionType/category1/index.vue"),
        meta: { title: "职位类型-1" },
      },
      {
        path: "positionType/category2",
        component: () => import("@/views/positionType/category2/index.vue"),
        meta: { title: "职位类型-2" },
      },
      {
        path: "position/manger",
        component: () => import("@/views/position/manger/index.vue"),
        meta: { title: "职位管理" },
      },
      {
        path: "position/audit",
        component: () => import("@/views/position/audit/index.vue"),
        meta: { title: "职位审核" }
      },
      {
        path: "industry/manger",
        component: () => import("@/views/industry/manger/index.vue"),
        meta: { title: "行业管理" }
      },
      {
        path: "company/manger",
        component: () => import("@/views/company/manger/index.vue"),
        meta: { title: "公司列表" }
      },
      {
        path: "company/audit",
        component: () => import("@/views/company/audit/index.vue"),
        meta: { title: "公司审核" }
      },
      {
        path: "manger",
        component: lazyLoad('manger'),
        meta: { title: "后台管理员" }
      },
      {
        path: "user",
        component: lazyLoad('user'),
        meta: { title: "用户管理" }
      },
      {
        path: "profile",
        component: lazyLoad('profile'),
        meta: { title: "个人中心" }
      },
      {
        path: "notFound",
        component: lazyLoad('notFound'),
        meta: { title: "404" }
      },
      {
        path: '/:pathMatch(.*)*',
        redirect:'notFound'
      },
    ],
  },
  {
    path: "/login",
    component: lazyLoad('login'),
    meta: { title: "登录" }
  },
  {
    path: "/login",
    component: lazyLoad('login'),
    meta: { title: "登录" }
  },

  


]