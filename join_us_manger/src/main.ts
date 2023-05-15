import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from "./router"
import pinia from "./store"
import '@arco-design/web-vue/dist/arco.css';
import "animate.css"
const app = createApp(App)
app.use(pinia)
app.use(router)
app.mount('#app')
