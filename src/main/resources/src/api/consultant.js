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

export const consultantApi = {
  // 获取推荐咨询师列表
  getRecommended: (page = 1, pageSize = 6) => {
    return api.get(`/consultants/recommended?page=${page}&pageSize=${pageSize}`)
  },
  // 获取咨询师详细信息
  getConsultantDetail: (consultantId) => {
    return api.get(`/consultants/${consultantId}`)
  },
  // 获取相似咨询师列表
  getSimilarConsultants: (consultantId) => {
    return api.get(`/consultants/${consultantId}/similar`)
  },
  // 获取咨询师当前状态
  getConsultantAvailability: (consultantId) => {
    return api.get(`/consultants/${consultantId}/availability`)
  },
  // 获取咨询师空闲时间
  getSpareTime: (consultantId) => {
    return api.get(`/consultants/${consultantId}/available-times`)
  }
}

export default consultantApi 