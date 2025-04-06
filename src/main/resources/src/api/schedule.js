// 用户预约信息的处理
import axios from 'axios'

const api = axios.create({
  baseURL: '/api',
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json'
  }
})

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

export const scheduleApi = {
  // 获取用户的预约列表
  getSchedules: (clientId) => {
    return api.get(`/schedules?client_id=${clientId}`)
  },
  // 取消预约
  cancelSchedule: (scheduleId) => {
    return api.post(`/schedules/${scheduleId}/cancel`)
  },
  // 获取咨询师可预约时间
  getAvailableTimes(consultantId, date) {
    return api.get(`/consultants/${consultantId}/available-times`,{
      params:{date}
    })
  },
  // 提交预约请求
  createSchedule(data) {
    return api.post('/schedules',{
      data
    })
  }
}

export default scheduleApi