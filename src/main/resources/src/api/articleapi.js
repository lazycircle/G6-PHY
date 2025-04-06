import axios from 'axios'
// 创建 axios 实例
const api = axios.create({
    baseURL: '/api', // 直接使用相对路径，让 Mock.js 能够正确拦截
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
  
  export const articleApi = {
    // 获取文章详情
    getArticle: (articleId) => {
        return api.get(`/articles/${articleId}`)
    },
    // 获取相似文章
    getSimilarArticles: (articleId) => {
      return api.get(`/articles/${articleId}/similar`)
    },
    // 获取文章列表
    getArticles: (params) => {
      return api.get('/articles', {
        params: {
          keyword: params.keyword || '',
          page: params.page || 1,
          tags: params.tags ? JSON.stringify(params.tags) : undefined
        }
      })
    },
    // 发布文章
    publishArticle: (data) => {
      return api.post('/articles', data)
    }
  }

  export default articleApi
