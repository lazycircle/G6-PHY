import axios from 'axios'

// 创建 axios 实例
const api = axios.create({
  baseURL: '/api',
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// 响应拦截器
api.interceptors.response.use(
  response => {
    return response.data
  },
  error => {
    console.error('API Error:', error)
    if (error.response) {
      throw new Error(error.response.data.message || '请求失败')
    }
    throw error
  }
)

export const userApi = {
  // 获取用户信息
  getUserInfo: (userId) => {
    return api.get(`/users/${userId}`)
  },

  // 更新用户信息
  updateUserInfo: (userId, data) => {
    return api.patch(`/users/${userId}`, data)
  },

  // 修改密码
  changePassword: (userId, data) => {
    return api.post(`/users/${userId}/password`, data)
  }
}

export default userApi 