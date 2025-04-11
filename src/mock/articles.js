import Mock from 'mockjs'


// 设置响应时间
Mock.setup({
  timeout: '200-600'
})
// 预设的文章数据
const articlesList = [
  {
    article_id: 1,
    title: "如何应对焦虑：实用的自我调节技巧",
    writer_name: "张心理",
    preview: "在现代生活中，焦虑已成为一个普遍的心理问题。本文将为您介绍几种实用的焦虑调节方法，帮助您更好地应对日常生活中的焦虑情绪...",
    views_count: 1562,
    liked_count: 428,
    create_time: "2024-03-15T08:30:00.000Z",
    tags: ["焦虑", "情绪管理"]
  },
  {
    article_id: 2,
    title: "建立健康的人际关系：从自我认知开始",
    writer_name: "李咨询师",
    preview: "良好的人际关系是心理健康的重要基础。本文将从自我认知的角度出发，探讨如何建立和维护健康的人际关系...",
    views_count: 2341,
    liked_count: 892,
    create_time: "2024-03-14T10:15:00.000Z",
    tags: ["人际关系", "自我认知"]
  },
  {
    article_id: 3,
    title: "走出抑郁的阴霾：专业观点与建议",
    writer_name: "王医生",
    preview: "抑郁症不仅影响心理健康，还会影响日常生活质量。本文将从专业角度分析抑郁症的表现、成因及治疗方法...",
    views_count: 3127,
    liked_count: 1045,
    create_time: "2024-03-13T14:20:00.000Z",
    tags: ["抑郁", "心理健康"]
  },
  {
    article_id: 4,
    title: "职场压力管理：平衡工作与生活",
    writer_name: "陈顾问",
    preview: "在竞争激烈的职场中，压力管理显得尤为重要。本文将分享一些实用的压力管理技巧，帮助您在工作中保持良好的心理状态...",
    views_count: 1893,
    liked_count: 567,
    create_time: "2024-03-12T16:45:00.000Z",
    tags: ["职场压力", "生活"]
  },
  {
    article_id: 5,
    title: "亲子关系的维护与改善",
    writer_name: "刘老师",
    preview: "良好的亲子关系是家庭幸福的基础。本文将探讨如何通过有效沟通、情感交流等方式，建立和维护健康的亲子关系...",
    views_count: 2756,
    liked_count: 934,
    create_time: "2024-03-11T09:30:00.000Z",
    tags: ["亲子关系", "家庭"]
  },
  {
    article_id: 6,
    title: "亲子关系的维护与改善",
    writer_name: "刘老师",
    preview: "良好的亲子关系是家庭幸福的基础。本文将探讨如何通过有效沟通、情感交流等方式，建立和维护健康的亲子关系...",
    views_count: 2756,
    liked_count: 934,
    create_time: "2024-03-11T09:30:00.000Z",
    tags: ["亲子关系", "家庭"]
  },
  {
    article_id: 7,
    title: "亲子关系的维护与改善",
    writer_name: "刘老师",
    preview: "良好的亲子关系是家庭幸福的基础。本文将探讨如何通过有效沟通、情感交流等方式，建立和维护健康的亲子关系...",
    views_count: 2756,
    liked_count: 934,
    create_time: "2024-03-11T09:30:00.000Z",
    tags: ["亲子关系", "家庭"]
  },
  {
    article_id: 8,
    title: "亲子关系的维护与改善",
    writer_name: "刘老师",
    preview: "良好的亲子关系是家庭幸福的基础。本文将探讨如何通过有效沟通、情感交流等方式，建立和维护健康的亲子关系...",
    views_count: 2756,
    liked_count: 934,
    create_time: "2024-03-11T09:30:00.000Z",
    tags: ["亲子关系", "家庭"]
  },
  {
    article_id: 9,
    title: "亲子关系的维护与改善",
    writer_name: "刘老师",
    preview: "良好的亲子关系是家庭幸福的基础。本文将探讨如何通过有效沟通、情感交流等方式，建立和维护健康的亲子关系...",
    views_count: 2756,
    liked_count: 934,
    create_time: "2024-03-11T09:30:00.000Z",
    tags: ["亲子关系", "家庭"]
  },
  {
    article_id: 10,
    title: "亲子关系的维护与改善",
    writer_name: "刘老师",
    preview: "良好的亲子关系是家庭幸福的基础。本文将探讨如何通过有效沟通、情感交流等方式，建立和维护健康的亲子关系...",
    views_count: 2756,
    liked_count: 934,
    create_time: "2024-03-11T09:30:00.000Z",
    tags: ["亲子关系", "家庭"]
  },
  {
    article_id: 11,
    title: "亲子关系的维护与改善",
    writer_name: "刘老师",
    preview: "良好的亲子关系是家庭幸福的基础。本文将探讨如何通过有效沟通、情感交流等方式，建立和维护健康的亲子关系...",
    views_count: 2756,
    liked_count: 934,
    create_time: "2024-03-11T09:30:00.000Z",
    tags: ["亲子关系", "家庭"]
  },
  // ... 可以继续添加更多文章
]
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

// 修改 Mock API 接口 - 获取文章详情
Mock.mock(/\/api\/article\/articleId=\d+/, 'get', (options) => {
  console.log('Mock intercepted:', options.url)
  
  // 从 URL 查询参数中提取文章 ID
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

Mock.mock(/\/api\/articles(\?.*)?$/, 'get', (options) => {
  // 解析请求参数
  const url = new URL(options.url, window.location.origin)
  const keyword = url.searchParams.get('keyword') || ''
  const page = parseInt(url.searchParams.get('page')) || 1
  const tags = url.searchParams.get('tags') ? JSON.parse(url.searchParams.get('tags')) : []

  // 根据关键字和标签筛选文章
  let filteredArticles = [...articlesList]

  if (keyword) {
    filteredArticles = filteredArticles.filter(article => 
      article.title.toLowerCase().includes(keyword.toLowerCase()) || 
      article.preview.toLowerCase().includes(keyword.toLowerCase())
    )
  }

  if (tags.length > 0) {
    filteredArticles = filteredArticles.filter(article => 
      tags.some(tag => article.tags.includes(tag))
    )
  }

  // 分页处理
  const pageSize = 10
  const total = filteredArticles.length
  const start = (page - 1) * pageSize
  const end = start + pageSize
  const pagedArticles = filteredArticles.slice(start, end)

  return {
    data: {
      total,
      articles: pagedArticles
    }
  }
})

// 添加文章详情的 mock
Mock.mock(/\/api\/articles\/\d+$/, 'get', (options) => {
  const articleId = parseInt(options.url.match(/\/articles\/(\d+)/)[1])
  
  // 预设的文章详情数据
  const articleDetails = {
    1: {
      title: "如何克服开学焦虑：实用指南",
      content: `开学焦虑是许多学生在新学期开始时常见的心理问题。本文将从以下几个方面为大家提供一些实用的建议：

1. 认识开学焦虑
开学焦虑通常表现为对新环境、新课程的担忧，以及对学业表现的过度紧张。这是一种正常的心理反应，但需要适当调节。

2. 调适方法
- 提前规划：制定详细的学习计划和日程安排
- 渐进适应：提前几天调整作息时间
- 寻求支持：与家人、朋友分享感受
- 适度运动：保持规律的运动习惯

3. 积极心态的重要性
保持积极心态不仅有助于缓解焦虑，还能帮助我们更好地适应新学期的生活。试着关注学习中的乐趣，而不是过分关注结果。

4. 寻求帮助
如果焦虑感持续影响到日常生活，建议及时寻求心理咨询师的帮助。记住，寻求帮助是一种智慧的选择。`,
      writer_name: "张心理",
      create_time: "2024-03-15 14:30:00",
      views_count: 2451,
      liked_count: 892,
      tags: ["焦虑", "学校生活", "心理健康"]
    },
    2: {
      title: "人际交往中的自我认知与成长",
      content: `在现代社会中，良好的人际关系对于个人发展至关重要。本文将探讨如何通过提升自我认知来改善人际交往。

1. 自我认知的重要性
了解自己的性格特点、情绪模式和行为习惯，是建立健康人际关系的第一步。

2. 常见的交往障碍
- 过度自我中心
- 沟通技巧欠缺
- 情绪管理不当
- 边界感模糊

3. 改善建议
- 学会倾听
- 培养同理心
- 适度表达
- 建立边界

4. 持续成长
人际关系的改善是一个持续的过程，需要我们不断学习和调整。`,
      writer_name: "李咨询师",
      create_time: "2024-03-14 09:15:00",
      views_count: 1832,
      liked_count: 567,
      tags: ["人际关系", "自我成长", "心理健康"]
    },
    3: {
      title: "愚人节快乐",
      content: "狗屎软开，狗都不学",
      writer_name: "赖咨询师",
      create_time: "2024-03-14 09:15:00",
      views_count: 1832,
      liked_count: 567,
      tags: ["心理健康"]
    }
  }

  // 返回对应文章的详情
  if (articleDetails[articleId]) {
    return {
      code: 200,
      data: articleDetails[articleId]
    }
  }

  // 如果找不到文章，返回404
  return {
    code: 404,
    message: '文章不存在'
  }
})

// 添加相似文章的 mock
Mock.mock(/\/api\/articles\/\d+\/similar$/, 'get', (options) => {
  const articleId = parseInt(options.url.match(/\/articles\/(\d+)\/similar/)[1])

  // 预设的相似文章数据
  const similarArticles = {
    1: [
      {
        article_id: 2,
        title: "如何克服不想上班的心理",
        preview: "在职场中，许多人都会遇到不想上班的心理状态..."
      },
      {
        article_id: 2,
        title: "面对领导pua你该知道这几件事",
        preview: "在职场中，领导的pua行为可能会对员工造成心理压力..."
      },
      {
        article_id: 2,
        title: "职场生存法则",
        preview: "在职场中生存需要掌握一些基本的法则和技巧..."
      }
    ],
    2: [
      {
        article_id: 1,
        title: "如何克服不想上班的心理",
        preview: "在职场中，许多人都会遇到不想上班的心理状态..."
      },
      {
        article_id: 1,
        title: "面对领导pua你该知道这几件事",
        preview: "在职场中，领导的pua行为可能会对员工造成心理压力..."
      },
      {
        article_id: 1,
        title: "职场生存法则",
        preview: "在职场中生存需要掌握一些基本的法则和技巧..."
      }
    ]
  }

  // 返回对应文章的相似文章
  if (similarArticles[articleId]) {
    return {
      code: 200,
      data: {
        articles: similarArticles[articleId]
      }
    }
  }

  // 如果找不到相似文章，返回400
  return {
    code: 400,
    message: '请求有误'
  }
})

// 添加发布文章的 mock
Mock.mock('/api/articles', 'post', (options) => {
  const requestData = JSON.parse(options.body)
  
  // 验证必填字段
  if (!requestData.title || !requestData.content) {
    return {
      code: 400,
      message: '标题和内容不能为空'
    }
  }

  // 验证标签数量
  if (requestData.tags && requestData.tags.length > 3) {
    return {
      code: 400,
      message: '标签数量不能超过3个'
    }
  }

  // 生成文章ID和创建时间
  const articleId = 3
  const createTime = Mock.Random.datetime()

  return {
    code: 200,
    data: {
      article_id: articleId,
      create_time: createTime
    }
  }
})

// Mock API - 获取推荐文章
Mock.mock(/\/api\/articles\/recommended/, 'get', (options) => {
  console.log('Mock intercepted recommended articles:', options)
  
  // 检查是否有token（是否登录）
  const token = options.headers?.Authorization
  
  let recommendedArticles
  if (token) {
    // 已登录用户 - 根据用户标签推荐（这里模拟用户喜欢"焦虑"相关的文章）
    recommendedArticles = articlesList
      .filter(article => article.tags.includes('焦虑'))
      .sort(() => 0.5 - Math.random()) // 随机排序
      .slice(0, 3)
  } else {
    // 未登录用户 - 随机推荐
    recommendedArticles = [...articlesList]
      .sort(() => 0.5 - Math.random())
      .slice(0, 3)
  }

  // 确保预览内容不超过50个字符
  const formattedArticles = recommendedArticles.map(article => ({
    article_id: article.article_id,
    title: article.title,
    writer_name: article.writer_name,
    preview: article.preview.substring(0, 50) + (article.preview.length > 50 ? '...' : '')
  }))

  return {
    code: 200,
    data: {
      total: formattedArticles.length,
      articles: formattedArticles
    }
  }
})

export default articles