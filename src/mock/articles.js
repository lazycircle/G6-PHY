import Mock from 'mockjs'


// 设置响应时间
Mock.setup({
  timeout: '200-600'
})

// 模拟文章列表数据
const articles = [
  {
    id: 1,
    title: '如何缓解焦虑情绪',
    author: {
      name: '张医生',
      title: '资深心理咨询师',
      avatar: 'https://randomuser.me/api/portraits/men/1.jpg'
    },
    tags: ['心理健康', '焦虑', '情绪管理'],
    publishTime: '2024-03-15',
    content: `
      焦虑是现代人常见的心理问题。本文将从以下几个方面为大家介绍缓解焦虑的方法：

      1. 规律作息
      保持规律的作息时间对缓解焦虑非常重要。每天固定时间起床和睡觉，让身体建立稳定的生理节律。

      2. 呼吸练习
      当感到焦虑时，可以尝试进行深呼吸练习。吸气4秒，屏息4秒，呼气6秒，重复这个过程可以帮助平静心情。

      3. 运动放松
      适度运动能够释放压力，建议每周进行3-4次有氧运动，每次30分钟以上。

      4. 寻求支持
      与家人朋友倾诉，必要时寻求专业心理咨询师的帮助。
    `
  },
  {
    id: 2,
    title: '保持积极心态的方法',
    author: {
      name: '李医生',
      title: '心理治疗师',
      avatar: 'https://randomuser.me/api/portraits/women/2.jpg'
    },
    tags: ['心理健康', '积极心理学', '心态调节'],
    publishTime: '2024-03-16',
    content: `
      积极心态对心理健康至关重要。以下是培养积极心态的几个建议：

      1. 感恩练习
      每天记录3件值得感恩的事情，培养感恩的心态。

      2. 设定目标
      制定切实可行的短期和长期目标，逐步实现带来成就感。

      3. 正向思维
      学会用积极的角度看待问题，找出困境中的机会。

      4. 健康的生活方式
      保持规律运动、均衡饮食和充足睡眠。
    `
  }
]

// Mock API 接口 - 获取文章详情
Mock.mock(/\/api\/article\/context\?articleId=\d+/, 'get', (options) => {
  console.log('Mock intercepted:', options.url)
  const articleId = parseInt(options.url.split('articleId=')[1])
  console.log('Article ID:', articleId)
  
  const article = articles.find(a => a.id === articleId)
  console.log('Found article:', article)
  
  if (article) {
    return {
      code: 200,
      data: article,
      message: 'success'
    }
  }
  return {
    code: 404,
    message: '文章不存在'
  }
})

// 模拟评论数据
const comments = {
  1: [ // articleId: 1 的评论
    {
      id: 1,
      content: '这篇文章写得很好，对我帮助很大！',
      createTime: '2024-03-20 14:30:00',
      likeCount: 25,
      isLiked: false,
      user: {
        id: 101,
        name: '阳光',
        avatar: 'https://randomuser.me/api/portraits/men/11.jpg'
      },
      replies: [
        {
          id: 11,
          content: '感谢分享，我也觉得很有帮助',
          createTime: '2024-03-20 15:00:00',
          likeCount: 5,
          isLiked: false,
          user: {
            id: 102,
            name: '微风',
            avatar: 'https://randomuser.me/api/portraits/women/12.jpg'
          }
        }
      ]
    },
    // 更多评论...
  ]
}

// Mock 获取评论列表
Mock.mock(/\/api\/article\/comments\?articleId=\d+/, 'get', (options) => {
  console.log('Mock intercepted comments request:', options.url)
  const articleId = parseInt(options.url.match(/articleId=(\d+)/)[1])
  const page = parseInt(options.url.match(/page=(\d+)/)?.[1] || 1)
  const pageSize = parseInt(options.url.match(/pageSize=(\d+)/)?.[1] || 20)
  
  const articleComments = comments[articleId] || []
  const start = (page - 1) * pageSize
  const end = start + pageSize
  
  return {
    code: 200,
    data: {
      items: articleComments.slice(start, end),
      total: articleComments.length,
      page,
      pageSize
    },
    message: 'success'
  }
})

// Mock 发表评论
Mock.mock('/api/article/comments', 'post', (options) => {
  const { articleId, content } = JSON.parse(options.body)
  const newComment = {
    id: Date.now(),
    content,
    createTime: Mock.Random.datetime(),
    likeCount: 0,
    isLiked: false,
    user: {
      id: 103,
      name: Mock.Random.cname(),
      avatar: `https://randomuser.me/api/portraits/men/${Mock.Random.integer(1, 99)}.jpg`
    },
    replies: []
  }
  
  if (!comments[articleId]) {
    comments[articleId] = []
  }
  comments[articleId].unshift(newComment)
  
  return {
    code: 200,
    data: newComment,
    message: '评论发布成功'
  }
})

// Mock 回复评论
Mock.mock(/\/api\/article\/comments\/\d+\/reply/, 'post', (options) => {
  //const commentId = parseInt(options.url.match(/comments\/(\d+)/)[1])
  const { content } = JSON.parse(options.body)
  
  const newReply = {
    id: Date.now(),
    content,
    createTime: Mock.Random.datetime(),
    likeCount: 0,
    isLiked: false,
    user: {
      id: 104,
      name: Mock.Random.cname(),
      avatar: `https://randomuser.me/api/portraits/women/${Mock.Random.integer(1, 99)}.jpg`
    }
  }
  
  return {
    code: 200,
    data: newReply,
    message: '回复发布成功'
  }
})

// Mock 点赞/取消点赞
Mock.mock(/\/api\/article\/comments\/\d+\/like/, 'post', () => {
  return {
    code: 200,
    message: '点赞成功'
  }
})

Mock.mock(/\/api\/article\/comments\/\d+\/like/, 'delete', () => {
  return {
    code: 200,
    message: '取消点赞成功'
  }
})

export default articles