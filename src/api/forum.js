// src/api/forumApi.js
import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:8888/api', // 直接使用相对路径，让 Mock.js 能够正确拦截
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// 请求拦截器：统一加上 token
api.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  error => Promise.reject(error)
)


// 响应拦截器
api.interceptors.response.use(
  response => {
    if (response.status === 200) {
      return response.data;  // 只返回数据部分
    } else {
      return Promise.reject(new Error('请求失败，状态码：' + response.status));
    }
  },
  error => {
    console.error('API Error:', error);
    return Promise.reject(error);
  }
);

/**
 * 获取论坛列表
 * @param {Object} params - 查询参数
 * @param {number} params.page - 页码
 * @param {string} params.keyword - 搜索关键词
 * @param {string} params.tags - 标签字符串，例如 "1,3,5"
 */
export function getForumList({ page = 1, keyword = '', tags = '' }) {
  return api.get('/forums', {
    params: {
      page,
      keyword,
      tags
    }
  })
}

/**
 * 创建新论坛
 * @param {Object} data - 论坛数据
 * @param {string} data.title - 标题
 * @param {string} data.content - 内容
 * @param {number[]} data.tags - 标签ID数组
 */
export function createForum(data) {
  return axios.post('/forums', data);
}

/**
 * 获取我创建的论坛列表
 * @param {Object} params - 查询参数
 * @param {number} params.page - 页码
 */
export function getMyCreatedForums({ page = 1 }) {
  return api.get('/forums/create', {
    params: { page }
  });
}

/**
 * 获取我加入的论坛列表
 * @param {Object} params - 查询参数
 * @param {number} params.page - 页码
 */
export function getMyJoinedForums({ page = 1 }) {
  return api.get('/forums/join', {
    params: { page }
  });
}
