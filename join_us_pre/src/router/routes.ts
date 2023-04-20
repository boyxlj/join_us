import { RouteRecordRaw } from "vue-router"
const Login = () => import("@/views/login/index.vue")
export const routes: RouteRecordRaw[] = [
  {
    path: "/login",
    component: Login,
  }
]