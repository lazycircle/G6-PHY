import { createApp } from 'vue'
import { createPinia } from 'pinia'
import ElementPlus from 'element-plus'
import App from './App.vue'
import router from './router'
import axios from 'axios'
//import '@fortawesome/fontawesome-free/css/all.css'
//import './assets/main.css'
import './mock/articles'
import Mock from 'mockjs'
import './mock/consultant'
import './mock/schedule'
import './mock/consultantSchedule'

// 设置 axios 默认值
axios.defaults.baseURL = process.env.VUE_APP_API_URL || 'http://localhost:3000'
if (localStorage.getItem('token')) {
  axios.defaults.headers.common['Authorization'] = `Bearer ${localStorage.getItem('token')}`
}

// 只在开发环境使用 mock
if (process.env.NODE_ENV === 'development' && process.env.VUE_APP_USE_MOCK === 'true') {
  require('./mock')
}

// 设置 Mock 的配置
Mock.setup({
  timeout: '200-600'
})


console.log('Mock initialized') // 添加调试日志

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)
app.use(ElementPlus)
app.mount('#app')