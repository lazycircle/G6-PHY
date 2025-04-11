import axios from 'axios'

const instance = axios.create({
  baseURL: 'http://localhost:8888/api', // 或者是完整的后端地址，如 http://localhost:5000/api
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// 请求拦截器：统一加上 token
instance.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token') // 或 Vuex 中存的 token
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  error => Promise.reject(error)
)

// 响应拦截器（可选）
instance.interceptors.response.use(
  response => response.data,
  error => {
    // 如果 token 过期或者 401，可以统一跳转登录页
    if (error.response && error.response.status === 401) {
      // 比如跳转登录页
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default instance
