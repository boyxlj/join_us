import { createApp } from 'vue'
import 'animate.css';
import './assets/css/reset.css'
import './style.css'
import App from './App.vue'
import router from './router'
import pinia from "./store"
import './assets/theme/theme.less'
import lazyPlugin from 'vue3-lazy'
import loading from "./assets/images/loading.gif"
import error from "./assets/images/err.jpeg"
const app = createApp(App)
lazyPlugin.install(app, {
  loading,
  error
})
app.use(pinia)
app.use(router)
app.mount('#app')
