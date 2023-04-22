import { createApp } from 'vue'
import 'animate.css';
import './assets/css/reset.css'
import './style.css'
import App from './App.vue'
import router from './router'
import './assets/theme/theme.less'
import { createPinia } from 'pinia'
const pinia = createPinia()
const app = createApp(App)
app.use(pinia)
app.use(router)
app.mount('#app')
