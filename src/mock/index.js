/* eslint-disable no-unused-vars */
import Mock from 'mockjs'
import md5 from 'md5'
// 设置延迟时间
Mock.setup({
  timeout: '200-600'
})

// 模拟用户数据库
// 1 为用户，0 为咨询师，2 为管理员
const users = [
  {
    id: 123,
    username: 'admin1',
    phone: '13800138000',
    email: 'admin@example.com',
    password: '123456', // 存储原始密码，mock 时再进行加密比较
    role: 2
  },
  {
    id: 2,
    username: '用户1',
    phone: '13398111286',
    email: 'user@example.com',
    password: '123456',
    role: 1
  },
  {
    id: 3,
    username: '咨询师1',
    phone: '13398111287',
    password: '123456',
    role: 0
  },
  {
    id: 4,
    username: '咨询师2',
    phone: '13398111286',
    email: 'user@example.com',
    password: '123456',
    role: 0
  },
]

// 登录接口
Mock.mock(new RegExp('/api/user/login'), 'post', (options) => {
  const url = new URL(options.url, window.location.origin);
  const id = url.searchParams.get('id');
  const hashedPassword = url.searchParams.get('hashedPassword');
  const role = parseInt(url.searchParams.get('role'));

  // 查找用户（通过手机号或邮箱）
  const user = users.find(u => (u.phone === id || u.email === id) && u.role === role);

  if (!user) {
    // 直接抛出错误，模拟 HTTP 请求失败
    throw new Error('用户不存在或身份不匹配');
  }

  if (hashedPassword !== md5(user.password)) {
    throw new Error('密码错误');
  }

  // 登录成功
  return {
    token: `mock-jwt-token-${user.id}-${Date.now()}`,
    role: user.role,
    id: user.id,
    username: user.username
  }
})
//admin login
Mock.mock(new RegExp('/api/admin/login'), 'post', (options) => {
  const { id, password } = JSON.parse(options.body)
  
  // 查找用户（通过手机号或邮箱）
  const user = users.find(u => u.id === id )

  if (!user) {
    return {
      status: 400,
      message: '管理员不存在'
    }
  }

  // 比较加密后的密码
  if (password !== md5(user.password)) {
    return {
      status: 400,
      message: '密码错误'
    }
  }

  // 登录成功
  return {
    status: 200,
    data:{
      token: `mock-jwt-token-${user.id}-${Date.now()}`,
      role: user.role,
      id: user.id
    }
  }
})


// 注册接口
Mock.mock(new RegExp('/api/register'), 'post', (options) => {
  //console.log('Mock register received:', options.body) // 添加调试日志
  //const params = new URLSearchParams(options.body);
  const params = new URLSearchParams(options.body)
  // 创建新用户
  const user = {
    id: users.length + 1,
    username: params.get('username'),
    phone: params.get('phone'),
    email: params.get('email') || '',
    password: params.get('password'),
    role: 1,
  }
  users.push(user)

  console.log('New user created:', user) // 添加调试日志

  // 返回成功响应
  return {
      token: `mock-jwt-token-${user.id}-${Date.now()}`,
      role: user.role,
      id: user.id
  }
})

// 模拟获取用户信息接口
Mock.mock(/\/api\/user\/profile/, 'get', (options) => {
  // 简化验证逻辑
  return {
    status: 200,
    data: users[0],
  }
})

// 模拟更新用户信息接口
Mock.mock(/\/api\/user\/profile/, 'put', (options) => {
  const updateData = JSON.parse(options.body)
  const updatedUser = {
    ...users[0],
    ...updateData
  }
  
  return {
    status: 200,
    data: updatedUser
  }
})

// 模拟更新密码接口
Mock.mock(/\/api\/user\/password/, 'put', () => {
  return {
    status: 200,
    message: '密码更新成功'
  }
})

// // 模拟获取预约列表
// Mock.mock(/\/api\/user\/appointments/, 'get', () => {
//   return {
//     status: 200,
//     data: Mock.mock({
//       'list|1-5': [{
//         'id|+1': 1,
//         'therapist': {
//           'id|+1': 1,
//           'name': '@cname',
//           'avatar': '@image("200x200")',
//           'title': '心理咨询师'
//         },
//         'date': '@date("yyyy-MM-dd")',
//         'time': '@time("HH:mm")',
//         'status|1': ['upcoming', 'completed', 'cancelled'],
//         'type|1': ['online', 'offline'],
//         'duration': 50,
//         'price': '@integer(200, 500)'
//       }]
//     }).list
//   }
// })

// // 模拟获取用户帖子列表
// Mock.mock(/\/api\/user\/posts/, 'get', () => {
//   return {
//     status: 200,
//     data: Mock.mock({
//       'list|1-8': [{
//         'id|+1': 1,
//         'title': '@ctitle(10, 20)',
//         'content': '@cparagraph(1, 3)',
//         'createdAt': '@datetime("yyyy-MM-dd HH:mm:ss")',
//         'commentCount|0-50': 0,
//         'viewCount|50-200': 50,
//         'likeCount|0-30': 0
//       }]
//     }).list
//   }
// })

// // 模拟文章列表
// Mock.mock(/\/api\/articles/, 'get', () => {
//   return {
//     status: 200,
//     data: Mock.mock({
//       'list|5-10': [{
//         'id|+1': 1,
//         'title': '@ctitle(10, 30)',
//         'excerpt': '@cparagraph(1, 2)',
//         'coverImage': '@image("800x400")',
//         'author': {
//           'id|+1': 1,
//           'name': '@cname',
//           'avatar': '@image("100x100")'
//         },
//         'category': '@pick(["情感", "压力", "职场", "家庭", "成长"])',
//         'tags|1-3': ['@pick(["焦虑", "抑郁", "恋爱", "亲子", "职场压力", "自我提升"])'],
//         'readCount|100-10000': 100,
//         'likeCount|10-1000': 10,
//         'commentCount|0-100': 0,
//         'createdAt': '@datetime("yyyy-MM-dd HH:mm:ss")'
//       }]
//     }).list
//   }
// })

export default Mock 