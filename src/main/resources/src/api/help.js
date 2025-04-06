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

  export const helpApi = {
    // 获取求助列表
    getHelpList: (helpId) => {
        return api.get('/help', {
            params: helpId ? { help_id: helpId } : {}
        })
    },
    
    // 接受求助
    acceptHelp: (helpId) => {
        return api.post(`/help/${helpId}`)
    }
}

export default helpApi;