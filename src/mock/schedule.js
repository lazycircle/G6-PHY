import Mock from 'mockjs'

// 模拟用户预约数据
Mock.mock(/\/api\/schedules\?client_id=[^&]+$/, 'get', {
  code: 200,
  data: [
    {
      schedule_id: "58",
      consultant_id: "5",
      date: "2025-07-08",
      time: "14:30",
      agree: true
    },
    {
      schedule_id: "86",
      consultant_id: "6",
      date: "2024-03-24",
      time: "22:30",
      agree: false
    }
  ]
})

// 模拟取消预约
Mock.mock(/\/api\/schedules\/\d+\/cancel$/, 'post', {
  code: 200,
  message: '取消成功'
})

// 模拟获取可用时间
Mock.mock(/\/api\/consultants\/\d+\/available-times/, 'get', (options) => {
  // 解析 URL 中的参数
  const url = new URL(options.url, window.location.origin)
  const date = url.searchParams.get('date')
  
  // 根据不同日期返回不同的可用时间
  const today = new Date().toISOString().split('T')[0]
  
  if (date === today) {
    return {
      data: ['14:30', '15:00', '16:30', '17:00']
    }
  } else {
    return {
      data: ['09:00', '10:30', '14:00', '15:30', '16:00', '17:30']
    }
  }
})

// 模拟预约提交
Mock.mock('/api/schedules', 'post', (options) => {
  const body = JSON.parse(options.body)
  
  // 模拟验证逻辑
  if (!body.consultant_id || !body.client_id || !body.date || !body.time) {
    return {
      status: 400,
      message: '请填写完整的预约信息'
    }
  }

  // 随机成功或失败
  if (Math.random() > 0.1) {
    return {
      status: 200,
      message: '预约成功'
    }
  } else {
    return {
      status: 400,
      message: '该时段已被预约'
    }
  }
}) 