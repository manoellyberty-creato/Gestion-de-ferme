import { createApp } from 'vue'
import { createPinia } from 'pinia'
import './assets/main.css'
import App from './App.vue'
import router from './router'
import VueToastificationPlugin from 'vue-toastification';
import "vue-toastification/dist/index.css"

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.use(VueToastificationPlugin, {
  position: "top-right",
  timeout: 3000,
  closeOnClick: true,
  pauseOnHover: true
})


app.mount('#app')
