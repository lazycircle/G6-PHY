import axios from 'axios'

// 创建 axios 实例
const api = axios.create({
  baseURL: 'http://localhost:8888/api',
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
  response => {
    console.log('API Response:', response.data)
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

export const sessionApi = {
  // 创建新会话
  createSession: (clientId, consultantId, scheduleId) => {
    return api.post('/sessions', null, {
      params : {
        client_id: clientId,
        consultant_id: consultantId,
        schedule_id: scheduleId
      }
    })
  },

  // 获取会话列表
  getSessions: (userId, userType) => {
    return api.get('/sessions', {
      params: {
        user_id: userId,
        user_type: userType
      }
    })
  },

  // 获取会话历史消息
  getSessionMessages: (sessionId) => {
    return api.get(`/sessions/${sessionId}/messages`)
  },

  // 结束会话
  endSession: (sessionId) => {
    return api.post(`/sessions/${sessionId}/end`)
  }
}

export default sessionApi 