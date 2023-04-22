import { createApp } from 'vue'
import 'animate.css';
import './assets/css/reset.css'
import './style.css'
import App from './App.vue'
import router from './router'
import './assets/theme/theme.less'
<<<<<<< HEAD
=======
import { createPinia } from 'pinia'
const pinia = createPinia()
>>>>>>> 88f76684550fd9395060d958a09fbae38102b705
const app = createApp(App)
app.use(pinia)
app.use(router)
app.mount('#app')
