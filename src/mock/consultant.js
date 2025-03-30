import Mock from 'mockjs'

// 模拟咨询师数据
const consultants = [
  {
    id: "1",
    username: "及成",
    profile: "资深老医生",
    tags: ["学业焦虑", "就业焦虑"]
  },
  {
    id: "2",
    username: "敛静怡",
    profile: "初出茅庐小年轻",
    tags: ["情感", "成长", "抑郁"]
  },
  {
    id: "3",
    username: "游萍",
    profile: "帅哥",
    tags: ["家庭关系", "npd"]
  },
  {
    id: "4",
    username: "王医生",
    profile: "心理治疗专家，擅长处理焦虑抑郁",
    tags: ["焦虑", "抑郁", "心理治疗"]
  },
  {
    id: "5",
    username: "李咨询师",
    profile: "婚姻家庭咨询专家",
    tags: ["婚姻", "家庭", "亲子关系"]
  },
  {
    id: "6",
    username: "张心理师",
    profile: "青少年心理辅导专家",
    tags: ["青少年", "学习压力", "成长"]
  },
  {
    id: "7",
    username: "李心理师",
    profile: "青少年心理辅导专家",
    tags: ["青少年", "学习压力", "成长"]
  },
  {
    id: "8",
    username: "赖心理师",
    profile: "青少年心理辅导专家",
    tags: ["青少年", "学习压力", "成长"]
  },
]

// Mock API - 获取推荐咨询师
Mock.mock(/\/api\/consultants\/recommended(\?.*)?$/, 'get', (options) => {
  console.log('Mock intercepted:', options.url)
  
  // 解析页码和每页数量
  const url = new URL(options.url, 'http://dummy.com')
  const page = parseInt(url.searchParams.get('page')) || 1
  const pageSize = parseInt(url.searchParams.get('pageSize')) || 6
  
  const start = (page - 1) * pageSize
  const end = start + pageSize
  const paginatedData = consultants.slice(start, end)

  return {
    code: 200,
    data: paginatedData,
    total: consultants.length,
    page,
    pageSize
  }
})

// 模拟咨询师详细信息
Mock.mock(/\/api\/consultants\/\d+$/, 'get', (options) => {
  const id = options.url.match(/\/api\/consultants\/(\d+)/)[1]
  const consultant = consultants.find(c => c.id === id)
  return {
    code: 200,
    data: consultant
  }
})

// 模拟相似咨询师数据
Mock.mock(/\/api\/consultants\/\d+\/similar$/, 'get', () => {
  return {
    code: 200,
    data: [
      {
        id: "23",
        username: "香馥君",
        profile: "hghfytdgcd",
        tags: ["抑郁", "焦虑", "情感"]
      },
      {
        id: "55",
        username: "乔佳琪",
        profile: "cupidatat",
        tags: ["抑郁"]
      }
    ]
  }
})

// 模拟咨询师当前状态
Mock.mock(/\/api\/consultants\/\d+\/availability$/, 'get', () => {
  return {
    code: 200,
    data: {
      isAvailable: true
    }
  }
})

export default consultants 