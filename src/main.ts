import { createApp } from 'vue'
import { createPinia } from 'pinia'
import VueApexCharts from 'vue3-apexcharts'
import './style.css'
import App from './App.vue'
import router from './router'
import { i18n } from './i18n'

createApp(App)
  .use(createPinia())
  .use(router)
  .use(VueApexCharts)
  .use(i18n)
  .mount('#app')
