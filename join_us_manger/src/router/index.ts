import { createRouter, createWebHistory,createWebHashHistory } from "vue-router"
import { routes } from "./routes"
const router = createRouter({
  history: createWebHashHistory(),
  routes
})
router.beforeEach((to, _from, next) => {
  const token = localStorage.getItem('mangerToken')
  if (!token && !to.path.includes('/login') ) {
   return next('/login')
  }
  if (token && to.path.includes('/login')) {
    return next('/')
  }
  next()
  window.scroll({
    top: 0,
    behavior: "smooth"
  })
})
router.afterEach((to,_from)=>{
  if(to.meta.title){
    document.title = to.meta.title as string
  }
})
export default router
