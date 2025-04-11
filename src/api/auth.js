import axios from 'axios'
import md5 from 'md5'

// 创建 axios 实例
const api = axios.create({
  baseURL: 'http://localhost:8888/api', // 直接使用相对路径，让 Mock.js 能够正确拦截
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
    response => {
      if (response.status === 200) {
        return response.data;  // 只返回数据部分
      } else {
        return Promise.reject(new Error('请求失败，状态码：' + response.status));
      }
    },
    error => {
      console.error('API Error:', error);
      return Promise.reject(error);
    }
);

export const authApi = {
  // 登录
  login: async (id, password, role) => {
    // 验证 id 格式
    if (!isValidPhone(id) && !isValidEmail(id)) {
      throw new Error('请输入有效的手机号或邮箱地址')
    }
    //const hashedPassword = md5(password)
    console.log(id, password, role)

    return api.post('/user/login', null, {params: {id, password, role}});
  },

  // admin登录
  adminLogin: async (id, password) => {
    const hashedPassword = md5(password)
    return api.post('/admin/login', null, {
      params: {
        id: id,
        password: hashedPassword
      }}
  )
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
      const response = await api.post('user/register', null, {
        params:{
          username: userData.username,
          phone: userData.phone,
          email: userData.email || '',
          password: hashedPassword,
          auth_code: userData.auth_code,
        }
      })
      return response
    } catch (error) {
      console.error('Registration API error:', error)
      throw error
    }
  }
}

export default authApi
