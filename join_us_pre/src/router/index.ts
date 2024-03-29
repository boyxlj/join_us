import { createRouter, createWebHashHistory } from "vue-router"
import { routes } from "./routes"
import { message } from "ant-design-vue"
const router = createRouter({
  history: createWebHashHistory(),
  routes
})
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token')
  const companyToken = localStorage.getItem('companyToken')
  
  if (token && (to.path.includes('/login') && !to.fullPath.includes('boss') )) {
    return next('/')
  }
  if (companyToken &&  to.fullPath=='/login?query=boss' ) {
    return next('/company')
  }
  if(!token && to.fullPath.includes('/home/user')){
     message.warning("请登录后进行访问")
    return next('/login')
  }
  if(!companyToken && to.path?.split('/')[1]==='company'){
     message.warning("请登录后进行访问")
    return next('/login?query=boss')
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
