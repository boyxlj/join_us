import { createRouter, createWebHistory } from "vue-router"
import { routes } from "./routes"
const router = createRouter({
  history: createWebHistory(),
  routes
})
router.beforeEach((to, from, next) => {
  // const token = localStorage.getItem('token')
  // if (token && to.path.includes('/login')) {
  //   return next('/')
  // }
  next()
})

export default router