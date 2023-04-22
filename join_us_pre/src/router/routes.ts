import { RouteRecordRaw } from "vue-router"

function lazyLoad(path:string){
  return () => import(`@/views/${path}/index.vue`)
}

export const routes: RouteRecordRaw[] = [
  {
    path: "/",
    redirect: '/home/index',
  },
  {
    path: "/home",
    component: lazyLoad('home'),
    children:[
      {
        path: "/home/index",
        component: lazyLoad('index'),
      },
      {
<<<<<<< HEAD
        path: "/home/job",
        component: lazyLoad('job'),
      },
=======
        name: 'jobDetail',
        path: "/home/jobDetail",
        component: lazyLoad('jobDetail')
      }
>>>>>>> 88f76684550fd9395060d958a09fbae38102b705
    ]
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
