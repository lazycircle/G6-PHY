import Mock from 'mockjs'

// 生成评论的mock数据
Mock.mock(/\/api\/articles\/\d+\/comments/, 'get', (options) => {
  console.log('Mock intercepted comments request:', options.url)

  // 生成固定的评论数据
  const comments = [
    {
      id: 16,
      user_id: 96,
      username: "曹雅鑫",
      content: "真不想上课",
      time: "2024-08-28 20:13:50",
      is_liked: false,
      liked_count: 32,
      reply_count: 1,
      reply: [
        {
          id: 61,
          user_id: 29,
          username: "倪国珍",
          content: "上课把我害惨了",
          time: "2026-03-26 12:43:44",
          is_liked: false,
          liked_count: 59
        }
      ]
    },
    {
      id: 19,
      user_id: 33,
      username: "妲雨涵",
      content: "劳工为了瓦西大出走的那个软开实践课的雨夜",
      time: "2025-07-20 11:10:41",
      is_liked: false,
      liked_count: 67,
      reply_count: 2,
      reply: [
        {
          id: 66,
          user_id: 47,
          username: "巴宇",
          content: "回复 妲雨涵 ：我呆呆地坐在理科大楼B226，听着键盘声。",
          time: "2024-04-26 11:33:12",
          is_liked: false,
          liked_count: 37
        },
        {
          id: 54,
          user_id: 63,
          username: "阮凯",
          content: "回复 巴宇 ：我知道一切都已结束，我不能再自欺欺人。我一开始就知道他从来没爱过我，在一起的时候他用代码和文档对我无尽折磨。我只不过是为了学分才委曲求全，夜不能寐...为了让工作完成我可以出卖自己的睡眠，改变自己的性格，迁就他的ddl...但是我的工作还是做不完，灯火烧断了锁，大疯吹进了滴水湖，我醒来了，我还坐在理科大楼B226...",
          time: "2024-08-05 22:29:16",
          is_liked: true,
          liked_count: 36
        }
      ]
    }
  ]

  const response = {
    code: 200,
    data: {
      total: comments.length,
      comments: comments
    }
  }
  
  console.log('Mock response:', response)
  return response
})

// 点赞评论
Mock.mock(/\/api\/comments\/\d+\/like/, 'post', () => {
  return {
    code: 200,
    message: '点赞成功'
  }
})

// 取消点赞评论
Mock.mock(/\/api\/comments\/\d+\/unlike/, 'post', () => {
  return {
    code: 200,
    message: '取消点赞成功'
  }
})

// 统一的评论接口
Mock.mock(/\/api\/comments/, 'post', (options) => {
  const body = JSON.parse(options.body)
  console.log('Mock intercepted comment request:', body)

  // 生成新的评论ID
  const commentId = Mock.Random.integer(100, 1000)
  const createTime = Mock.Random.datetime()

  // 根据type返回不同的响应
  if (body.type === 0) {
    return {
      code: 200,
      data: {
        comment_id: commentId,
        create_time: createTime
      }
    }
  } else if (body.type === 1) {
    return {
      code: 200,
      data: {
        comment_id: commentId,
        create_time: createTime
      }
    }
  } else if (body.type === 2) {
    return {
      code: 200,
      data: {
        comment_id: commentId,
        create_time: createTime
      }
    }
  } else if (body.type === 3) {
    return {
      code: 200,
      data: {
        comment_id: commentId,
        create_time: createTime
      }
    }
  } else {
    return {
      code: 400,
      message: '无效的评论类型'
    }
  }
}) 