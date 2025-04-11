import Mock from 'mockjs'

// 模拟用户数据
const userData = {
  id: 82,
  username: '宏虚倩',
  phone: '15360822872',
  email: 'lzbmd2.pp89@outlook.com',
  password: '********',
  type: 0,
  profile: '精通情绪管理，擅长利用先人智慧答疑解惑',
  theme_preference: 'dark',
  preference: ['老子思维', '量子思维', '小熊维尼思维'],
  expertise: ['佛系精神胜利法']
}

// 获取用户信息
Mock.mock(/\/api\/users\/\d+$/, 'get', () => {
  return {
    code: 200,
    data: userData
  }
})

// 更新用户信息
Mock.mock(/\/api\/users\/\d+$/, 'patch', (options) => {
  const body = JSON.parse(options.body)
  Object.assign(userData, body)
  return {
    code: 200,
    message: '修改成功'
  }
})

// 修改密码
Mock.mock(/\/api\/users\/\d+\/password$/, 'post', (options) => {
  const { current_password, new_password } = JSON.parse(options.body)
  if (current_password && new_password) {
    return {
      code: 200,
      message: '密码修改成功'
    }
  }
  return {
    code: 400,
    message: '密码修改失败，请检查输入'
  }
}) 