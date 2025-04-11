import axios from 'axios'

const request = axios.create({
  baseURL: '/api', // 基础URL
  timeout: 5000    // 请求超时时间
})

// 请求拦截器
request.interceptors.request.use(
  config => {
    // 可以在这里统一添加token等认证信息
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

// 响应拦截器
request.interceptors.response.use(
  response => {
    const res = response.data
    // 这里可以统一处理响应
    if (res.code !== 200) {
      // 处理错误情况
      return Promise.reject(new Error(res.message || '请求失败'))
    }
    return res
  },
  error => {
    // 处理网络错误等
    console.error('请求错误:', error)
    return Promise.reject(error)
  }
)

export default request
