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
    redirect: '/home/index',
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
        path: "about",
        component: lazyLoad('about'),
        meta:{title:'关于'}
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
        path: "user/resume",
        component: lazyLoad('resume'),
        meta:{title:'个人中心'}
      },
      {
        path: "user/jobs/fromChat",
        component: lazyLoad('jobFormChat'),
        meta:{title:'投递记录'}
      },
      {
        path: "corporation",
        component: lazyLoad('corporation'),
        meta:{title:'公司'}
      },
      {
        path: "consult",
        component: lazyLoad('consult'),
        meta:{title:'咨询'}
      },
      {
        path: "companyDetail",
        component: lazyLoad('companyDetail'),
        meta:{title:'公司详情'}
      },
      {
        path: "consultDetail",
        component: lazyLoad('consultDetail'),
        meta:{title:'资讯详情'}
      },
    ]
  },
  {
    path: "/login",
    component: lazyLoad('login'),
    meta:{title:'用户登录'}
  },
  {
    path: "/company",
    component: lazyLoad('company'),
    meta: { title: '企业管理' },
    redirect: '/company/positionManage',
    children: [
      {
        path: '/company/dataAnalysis',
        component: () => import('@/views/company/components/dataAnalysis/index.vue')
      },
      {
        path: '/company/positionManage',
        component: () => import('@/views/company/components/positionManage/index.vue'),
        meta:{title:'职位管理'}
      },
      {
        path: '/company/searchCattle',
        component: () => import('@/views/company/components/searchCattle/index.vue')
      },
      {
        path: '/company/resumeReview',
        component: () => import('@/views/company/components/resumeReview/index.vue'),
        meta:{title:'简历审核'}
      },
      {
        path: '/company/toolBox',
        component: () => import('@/views/company/components/toolBox/index.vue')
      },
      {
        path: '/company/companyInfo',
        component: () => import('@/views/company/components/companyInfo/index.vue'),
        meta:{title:'公司信息'}
      },
      {
        path: '/company/profile',
        component: () => import('@/views/company/components/profile/index.vue'),
        meta:{title:'个人中心'}
      }
    ]
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
