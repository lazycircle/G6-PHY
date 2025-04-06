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
    if (error.response) {
      throw new Error(error.response.data.message || '请求失败')
    }
    throw error
  }
)

export const commentApi = {
  // 对论坛帖子进行评论
  commentPost: (postId, content) => {
    return api.post('/comments', {
      type: 0,
      target_id: postId,
      content
    })
  },

  // 对文章进行评论
  commentArticle: (articleId, content) => {
    return api.post('/comments', {
      type: 1,
      target_id: articleId,
      content
    })
  },

  // 对评论进行回复
  replyComment: (commentId, content) => {
    return api.post('/comments', {
      type: 2,
      target_id: commentId,
      content
    })
  },

  // 获取评论列表
  getComments: (articleId, page = 1) => {
    return api.get(`/articles/${articleId}/comments`, {
      params: { page }
    })
  },

  // 点赞评论
  likeComment: (commentId) => {
    return api.post(`/comments/${commentId}/like`)
  },

  // 取消点赞评论
  unlikeComment: (commentId) => {
    return api.post(`/comments/${commentId}/unlike`)
  }
}

export default commentApi 