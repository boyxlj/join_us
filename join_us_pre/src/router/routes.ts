import { RouteRecordRaw } from "vue-router"

function lazyLoad(path:string){
  return () => import(`@/views/${path}/index.vue`)
}

export const routes: RouteRecordRaw[] = [
  {
    path: "/",
    redirect: '/home',
  },
  {
    path: "/home",
    component: lazyLoad('home'),
  },
  {
    path: "/login",
    component: lazyLoad('login'),
  },
  {
    path: "/notfound",
    component: lazyLoad('notfound'),
  },
  {
    path: "/:pathMatch(.*)*",
    redirect: '/notfound',
  },
]