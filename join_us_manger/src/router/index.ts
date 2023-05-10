import { createRouter, createWebHistory } from "vue-router"
import { routes } from "./routes"
const router = createRouter({
  history: createWebHistory(),
  routes
})
router.beforeEach((to, _from, next) => {
  const token = localStorage.getItem('token')
  // if (token && to.path.includes('/login')) {
  //   return next('/')
  // }
  next()
  window.scroll({
    top: 0,
    behavior: "auto"
  })
})
router.afterEach((to,_from)=>{
  if(to.meta.title){
    document.title = to.meta.title as string
  }
})
export default router
