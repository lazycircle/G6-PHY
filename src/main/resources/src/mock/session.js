import Mock from 'mockjs'

// 创建会话
Mock.mock(/\/api\/sessions/, 'post', (options) => {
  const params = new URLSearchParams(options.url.split('?')[1])
  console.log(params)
  return {
    code: 200,
    data: {
      session_id: Mock.Random.integer(1, 100),
      start_time: Mock.Random.datetime('yyyy-MM-dd HH:mm:ss')
    }
  }
})

// 获取会话列表
Mock.mock(/\/api\/sessions/, 'get', (options) => {
  const params = new URLSearchParams(options.url.split('?')[1])
  const userId = params.get('user_id')
  const userType = params.get('user_type')
  console.log(userId, userType)
  // 模拟会话列表数据
  const sessions = []
  const count = Mock.Random.integer(1, 5)
  
  for (let i = 0; i < count; i++) {
    sessions.push({
      session_id: Mock.Random.integer(1, 100).toString(),
      username: [Mock.Random.cname()],
      end_time: Mock.Random.datetime('yyyy-MM-dd HH:mm:ss')
    })
  }

  return {
    code: 200,
    data: sessions
  }
}) 