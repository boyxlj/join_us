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
        path: "index",
        component: lazyLoad('index'),
        meta:{title:'首页'}
      },
      {
        path: "job",
        component: lazyLoad('job'),
        meta:{title:'职位'}
      },
      {
        name: 'jobDetail',
        path: "/home/jobDetail",
        component: lazyLoad('jobDetail'),
        meta:{title:'详情'}
      },
      {
        path: "user/job",
        component: lazyLoad('user'),
        meta:{title:'用户职位'}
      },
      {
        path: "user/profile",
        component: lazyLoad('profile'),
        meta:{title:'个人中心'}
      }
    ]
  },
  {
    path: "/login",
    component: lazyLoad('login'),
    meta:{title:'用户登录'}
  },
  {
    path: "/notfound",
    component: lazyLoad('notfound'),
  },
  {
    path: "/:pathMatch(.*)*",
    redirect: '/notfound',
    meta:{title:'404'}
  },
]
