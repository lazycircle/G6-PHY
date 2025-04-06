import Mock from 'mockjs'

// 获取用户信息
Mock.mock(/\/api\/users\/\d+/, 'get', () => {
  return {
    code: 200,
    data: {
      id: 82,
      username: "宏虚倩",
      phone: "15360822872",
      email: "lzbmd2.pp89@outlook.com",
      password: "N_53gMbRiqNawmi",
      type: 0,
      profile: "精通情绪管理，擅长利用先人",
      theme_preference: "black",
      preference: [
        "老子思维",
        "量子思维",
        "小熊维尼思维"
      ],
      expertise: [
        "佛系精神胜利法"
      ]
    }
  }
})

// 更新用户信息
Mock.mock(/\/api\/users\/\d+/, 'patch', (options) => {
  const body = JSON.parse(options.body)
  console.log('Mock intercepted update user request:', body)
  
  return {
    code: 200,
    message: '更新成功'
  }
})

// 修改密码
Mock.mock(/\/api\/users\/\d+\/password/, 'post', (options) => {
  const body = JSON.parse(options.body)
  console.log('Mock intercepted change password request:', body)
  
  if (body.current_password === 'wrong_password') {
    return {
      code: 400,
      message: '原密码错误'
    }
  }
  
  return {
    code: 200,
    message: '密码修改成功'
  }
}) 