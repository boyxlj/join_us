import { createApp } from 'vue'
import 'animate.css';
import './assets/css/reset.css'
import './style.css'
import App from './App.vue'
import router from './router'
import pinia from "./store"
import './assets/theme/theme.less'

const app = createApp(App)
app.use(pinia)
app.use(router)
app.mount('#app')
