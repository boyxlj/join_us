import { createApp } from 'vue'
import './assets/css/reset.css'
import './style.css'
import App from './App.vue'
import router from './router'
import './assets/theme/theme.less'

const app = createApp(App)
app.use(router)
app.mount('#app') 
