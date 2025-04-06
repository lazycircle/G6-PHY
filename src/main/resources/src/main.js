import { createApp } from 'vue'
import { createPinia } from 'pinia'
//import ElementPlus from 'element-plus'
import App from './App.vue'
import router from './router'
import axios from 'axios'
//import '@fortawesome/fontawesome-free/css/all.css'
//import './assets/main.css'
import Mock from 'mockjs'

// 设置 Mock 的配置
Mock.setup({
  timeout: '200-600'
})

// 设置 axios 默认值
axios.defaults.baseURL = process.env.VUE_APP_API_URL || 'http://localhost:3000'
if (localStorage.getItem('token')) {
  axios.defaults.headers.common['Authorization'] = `Bearer ${localStorage.getItem('token')}`
}

// 导入所有 mock 文件
import './mock/articles'
import './mock/consultant'
import './mock/schedule'
import './mock/consultantSchedule'
import './mock/index'
import './mock/help'
import './mock/comments'
import './mock/user'
import './mock/session'
console.log('Mock initialized with baseURL:', axios.defaults.baseURL)

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)
//app.use(ElementPlus)
app.mount('#app')