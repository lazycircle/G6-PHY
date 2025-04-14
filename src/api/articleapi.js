import axios from 'axios'
// 创建 axios 实例
const api = axios.create({
    baseURL: 'http://localhost:8888/api', // 直接使用相对路径，让 Mock.js 能够正确拦截
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
  response => response.data,
  error => {
    if (error.response) {
      throw new Error(error.response.data.message || '请求失败')
    }
    throw error
  }
)
  
export const articleApi = {
  // 获取推荐文章
  getRecommendedArticles: () => {
    console.log('hello1')
    return api.get('/articles/recommended')
  },

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
    console.log('here')
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
    console.log(data)
    return api.post('/articles', data)
  },
  // 点赞/取消点赞
  toggleLike: (type, targetId) => {
    return api.post('/likes', null, { params:{
      type,
      target_id: targetId
    }
    })
  }
}

export default articleApi
