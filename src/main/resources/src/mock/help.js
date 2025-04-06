import Mock from 'mockjs'

// 模拟求助列表数据
Mock.mock(/\/api\/help(\?help_id=\d+)?$/, 'get', (options) => {
  // 解析请求参数
  const url = new URL(options.url, window.location.origin)
  const helpId = url.searchParams.get('help_id')

  // 生成模拟数据
  const generateHelp = () => ({
    help_id: Mock.Random.integer(1, 100),
    consultant_name: Mock.Random.cname(),
    session_id: Mock.Random.integer(1, 100),
    content: Mock.Random.sentence(3, 10)
  })

  // 如果指定了 help_id，返回单个数据
  if (helpId) {
    return {
      data: [generateHelp()]
    }
  }

  // 否则返回多个数据
  return {
    data: Array(5).fill().map(generateHelp)
  }
})

// 模拟接受求助
Mock.mock(/\/api\/help\/\d+$/, 'post', () => {
  return {
    code: 200,
    message: '接受求助成功'
  }
})