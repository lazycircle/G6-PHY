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
    error => Promise.reject(error)
  )
  
  export const articleapi = {
    // 获取文章详情
    getArticle: (articleId) => {
        return api.get(`/article/context?articleId=${articleId}`)
    },
    // 获取文章评论
    getComments: (articleId, page = 1, pageSize = 20) => {
        return api.get(`/article/comments?articleId=${articleId}&page=${page}&pageSize=${pageSize}`)
    },
    // 发表评论
    postComment: (articleId, content) => {
        return api.post(`/article/comments`, { articleId, content })
    },
    // 回复评论
    replyComment: (commentId, content) => {
        return api.post(`/article/comments/${commentId}/reply`, { content })
    },
    // 点赞评论
    likeComment: (commentId) => {
        return api.post(`/article/comments/${commentId}/like`)
    },
    // 取消点赞
    unlikeComment: (commentId) => {
        return api.delete(`/article/comments/${commentId}/like`)
    }
  }

  export default articleapi
