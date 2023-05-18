import { createRouter, createWebHistory } from "vue-router"
import { routes } from "./routes"
import { message } from "ant-design-vue"
const router = createRouter({
  history: createWebHistory(),
  routes
})
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token')
  const companyToken = localStorage.getItem('companyToken')
  
  if (token && (to.path.includes('/login') && !to.fullPath.includes('boss') )) {
    return next('/')
  }
  if(!token && to.fullPath.includes('/home/user')){
     message.warning("请登录后进行访问")
    return next('/login')
  }
  
  if(!companyToken && to.fullPath.includes('/company')){
     message.warning("请登录后进行访问")
    return next('/login')
  }
  
  next()
  window.scroll({
    top: 0,
    behavior: "auto"
  })
})
router.afterEach((to,from)=>{
  if(to.meta.title){
    document.title = to.meta.title as string
  }
})
export default router
