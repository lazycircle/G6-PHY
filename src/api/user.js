import axios from 'axios'
// 创建 axios 实例
const api = axios.create({
    baseURL: 'http://localhost:8888/api', // 直接使用相对路径，让 Mock.js 能够正确拦截
    timeout: 5000,
    headers: {
      'Content-Type': 'application/json'
    }
  })
  
// 请求拦截器：统一加上 token
api.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  error => Promise.reject(error)
)
  
// 响应拦截器
api.interceptors.response.use(
  response => response.data,
  error => {
    if (error.response) {
      throw new Error(error.response.data.message || '请求失败')
    }
    throw error
  }
)

// 获取用户个人资料
export function getUserProfile(id) {
  return api.get(`/users/${id}`)
}

// 修改用户资料
export function updateUserProfile(id, data) {
  return api.patch(`/users/${id}`, data, {
    headers: {
      'Content-Type': 'application/json'
    }
  })
}

// 修改密码
export function updatePassword(id, data) {
  return api.post(`/users/${id}/password`, data)
}

export default {
  getUserProfile,
  updateUserProfile,
  updatePassword
} 