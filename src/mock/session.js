import Mock from 'mockjs'

// 模拟会话数据
const mockSessions = [
  {
    session_id: '1',
    client_id: '101',
    consultant_id: '1',
    username: ['及成', '张三'],
    start_time: '2024-03-20 14:30:00',
    end_time: '2024-03-20 15:30:00',
    status: 1 // 1: 进行中, 2: 已结束
  },
  {
    session_id: '2',
    client_id: '102',
    consultant_id: '1',
    username: ['及成', '李四'],
    start_time: '2024-03-21 10:00:00',
    end_time: '2024-03-21 11:00:00',
    status: 2
  },
  {
    session_id: '3',
    client_id: '101',
    consultant_id: '2',
    username: ['敛静怡', '张三'],
    start_time: '2024-03-22 15:00:00',
    end_time: '2024-03-22 16:00:00',
    status: 1
  }
]

// Mock API - 获取会话列表
Mock.mock(/\/api\/sessions(\?.*)?$/, 'get', (options) => {
  console.log('Mock intercepted:', options.url)
  
  // 解析查询参数
  const url = new URL(options.url, 'http://dummy.com')
  const userId = url.searchParams.get('user_id')
  const userType = parseInt(url.searchParams.get('user_type'))
  
  // 根据用户类型和ID筛选会话
  let filteredSessions = mockSessions.filter(session => {
    if (userType === 0) { // 咨询师
      return session.consultant_id === userId
    } else { // 咨询者
      return session.client_id === userId
    }
  })

  return {
    code: 200,
    message: 'success',
    data: filteredSessions
  }
})

// Mock API - 获取会话消息
Mock.mock(/\/api\/sessions\/\d+\/messages/, 'get', (options) => {
  const sessionId = options.url.match(/\/sessions\/(\d+)\/messages/)[1]
  
  // 生成模拟消息数据
  const messages = new Array(10).fill(null).map((_, index) => ({
    msg_id: `${sessionId}_${index}`,
    session_id: sessionId,
    sender_id: index % 2 === 0 ? mockSessions[0].client_id : mockSessions[0].consultant_id,
    sender_name: index % 2 === 0 ? mockSessions[0].username[1] : mockSessions[0].username[0],
    content: Mock.Random.sentence(5, 20),
    send_time: Mock.Random.datetime('yyyy-MM-dd HH:mm:ss'),
    type: 'text'
  }))

  return {
    code: 200,
    message: 'success',
    data: messages
  }
})

// Mock API - 结束会话
Mock.mock(/\/api\/sessions\/\d+\/end/, 'post', (options) => {
  const sessionId = options.url.match(/\/sessions\/(\d+)\/end/)[1]
  const session = mockSessions.find(s => s.session_id === sessionId)
  
  if (session) {
    session.status = 2
    session.end_time = new Date().toISOString().replace('T', ' ').split('.')[0]
  }

  return {
    code: 200,
    message: 'success'
  }
})

export default mockSessions 