import axios from 'axios'

const api = axios.create({
  baseURL: '/api',
  timeout: 5000
})

export const commentApi = {
  // 获取文章评论列表
  getComments: (articleId, page = 1, pageSize = 20) => {
    return api.get(`/articles/${articleId}/comments`, {
      params: { page, pageSize }
    })
  },

  // 发表评论
  createComment: (articleId, content) => {
    return api.post(`/articles/${articleId}/comments`, { content })
  },

  // 获取评论回复列表
  getReplies: (commentId, page = 1, pageSize = 10) => {
    return api.get(`/comments/${commentId}/replies`, {
      params: { page, pageSize }
    })
  },

  // 发表回复
  createReply: (commentId, content, replyToId = null) => {
    return api.post(`/comments/${commentId}/replies`, {
      content,
      replyToId
    })
  },

  // 点赞/取消点赞
  toggleLike: (commentId, isLike = true) => {
    return api[isLike ? 'post' : 'delete'](`/comments/${commentId}/like`)
  }
}

export default commentApi 