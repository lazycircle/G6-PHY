import axios from 'axios'

// 创建 axios 实例
const api = axios.create({
  baseURL: 'http://localhost:8888/api',
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
  response => {
    console.log('API Response:', response.data)
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




export const commentApi = {

  // 获取论坛帖子评论列表
  getForumComments: (forumId, page = 1) => {
    console.log('nihao')
    return api.get(`/forums/${forumId}/comments`,
      {params: {page: page}}
    )},
  



  // 对论坛帖子进行评论
  postComment: (type, targetId, content) => {
    return api.post('/comments', {
      type: 0,
      target_id: targetId,
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

  // 获取文章评论列表
  getComments: (articleId) => {
    console.log('Fetching comments for article:', articleId)
    return api.get(`/articles/${articleId}/comments`)
  },

  // 点赞/取消点赞评论
  toggleCommentLike: (commentId) => {
    return api.post('/likes', null, {params:{
      type: 'comment',
      target_id: commentId
    }
  })
  },

  // 对评论的回复进行回复
  replyToReply: (replyId, content) => {
    return api.post('/comments', {
      type: 2,
      target_id: replyId,
      content
    })
  }
}

export default commentApi 