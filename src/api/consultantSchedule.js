import api from '@/utils/axios'

// const api = axios.create({
//   baseURL: 'http://localhost:8888/api',
//   timeout: 5000,
//   headers: {
//     'Content-Type': 'application/json'
//   }
// })

// // 响应拦截器
// api.interceptors.response.use(
//   response => response.data,
//   error => {
//     if (error.response) {
//       throw new Error(error.response.data.message || '请求失败')
//     }
//     throw error
//   }
// )

export default {
  // 获取咨询师的预约请求列表
  getSchedules(consultantId) {
    return api.get(`/consultants/${consultantId}/schedules`)
  },

  // 处理预约请求(接受/拒绝)
  handleSchedule(scheduleId, agree) {
    return api.post(`/api/schedules/${scheduleId}`,null, { params:{agree: agree} })
  }
} 