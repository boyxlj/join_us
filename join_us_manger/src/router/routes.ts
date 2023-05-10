import { RouteRecordRaw } from "vue-router"

function lazyLoad(path:string){
  return () => import(`@/views/${path}/index.vue`)
}

export const routes: RouteRecordRaw[] = [
  {
    path:"/",
    component:lazyLoad('layout'),
    children:[
      {
        path:"consult",
        component:lazyLoad('consult'),
        meta:{title:"资讯百科"}
      },
      {
        path:"public/consult",
        component:lazyLoad('publicConsult'),
        meta:{title:"发布资讯"}
      },
    ],
  },
  {
    path:"/login",
    component:lazyLoad('login'),
    meta:{title:"登录"}
  }
  
]