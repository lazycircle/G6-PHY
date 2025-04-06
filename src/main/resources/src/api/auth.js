import axios from 'axios'
import md5 from 'md5'

// 创建 axios 实例
const api = axios.create({
  baseURL: '/api', // 直接使用相对路径，让 Mock.js 能够正确拦截
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json'
  }
})
// 验证手机号
const isValidPhone = (phone) => {
  return /^1[3-9]\d{9}$/.test(phone)
}

// 验证邮箱
const isValidEmail = (email) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}


// 响应拦截器
api.interceptors.response.use(
  response => response.data,
  error => {
    if (error.response) {
      throw new Error(error.response.message)
    }
    throw error
  }
)

export const authApi = {
  // 登录
  login: async (id, password) => {
    // 验证 id 格式
    if (!isValidPhone(id) && !isValidEmail(id)) {
      throw new Error('请输入有效的手机号或邮箱地址')
    }
    const hashedPassword = md5(password)
    return api.post('/user/login', { 
      id, 
      password: hashedPassword 
    })
  },

  // admin登录
  adminLogin: async (id, password) => {
    const hashedPassword = md5(password)
    return api.post('/admin/login', { 
      id, 
      password: hashedPassword 
    })
  },

  // 注册
  register: async (userData) => {
    // 验证手机号
    if (!isValidPhone(userData.phone)) {
      throw new Error('请输入有效的手机号')
    }

    // 验证邮箱（如果提供）
    if (userData.email && !isValidEmail(userData.email)) {
      throw new Error('请输入有效的邮箱地址')
    }

    const hashedPassword = md5(userData.password)
    try {
      const response = await api.post('/register', {
        username: userData.username,
        phone: userData.phone,
        email: userData.email || '',
        password: hashedPassword
      })
      return response
    } catch (error) {
      console.error('Registration API error:', error)
      throw error
    }
  }
}

export default authApi
