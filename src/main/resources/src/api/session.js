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

// 创建会话
export const createSession = async (clientId, consultantId, scheduleId) => {
  try {
    console.log(clientId, consultantId, scheduleId)
    const response = await api.post('/sessions',{
      params: {
        client_id: clientId,
        consultant_id: consultantId,
        schedule_id: scheduleId
      }
    })
    return response
  } catch (error) {
    console.error('创建会话失败:', error)
    throw error
  }
}

// 获取会话列表
export const getSessionList = async (userId, userType) => {
  try {
    const response = await api.get('/sessions', {
      params: {
        user_id: userId,
        user_type: userType
      }
    })
    return response
  } catch (error) {
    console.error('获取会话列表失败:', error)
    throw error
  }
}

export default {
  createSession,
  getSessionList
} 