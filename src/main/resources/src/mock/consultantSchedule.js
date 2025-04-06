import Mock from 'mockjs'

// 模拟获取咨询师预约请求列表
Mock.mock(/\/api\/consultants\/\d+\/schedules/, 'get', () => {
  return {
    code: 200,
    data: [
      {
        schedule_id: 7,
        username: '莘婷',
        date: '2025-12-21',
        time: '21:00',
        agree: 0
      },
      {
        schedule_id: 47,
        username: '富悦',
        date: '2025-05-02',
        time: '15:30',
        agree: 0
      },
      {
        schedule_id: 52,
        username: '荣娜',
        date: '2024-12-29',
        time: '17:00',
        agree: 1
      }
    ]
  }
})

// 模拟处理预约请求
Mock.mock(/\/api\/schedules\/\d+/, 'post', (options) => {
  const { agree } = JSON.parse(options.body)
  
  if (agree !== undefined) {
    return {
      code: 200,
      message: '修改成功'
    }
  }
  
  return {
    code: 400,
    message: '参数错误'
  }
}) 