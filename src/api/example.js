import request from '@/utils/request'

// GET 请求示例
export function getList(params) {
  return request({
    url: '/items',
    method: 'get',
    params // URL参数，会自动拼接到url后面，如 /items?page=1&size=10
  })
}

// GET 请求带路径参数
export function getDetail(id) {
  return request({
    url: `/items/${id}`,
    method: 'get'
  })
}

// POST 请求示例
export function createItem(data) {
  return request({
    url: '/items',
    method: 'post',
    data // 请求体数据
  })
}

// PUT 请求示例（全量更新）
export function updateItem(id, data) {
  return request({
    url: `/items/${id}`,
    method: 'put',
    data
  })
}

// PATCH 请求示例（部分更新）
export function partialUpdateItem(id, data) {
  return request({
    url: `/items/${id}`,
    method: 'patch',
    data
  })
}

// DELETE 请求示例
export function deleteItem(id) {
  return request({
    url: `/items/${id}`,
    method: 'delete'
  })
}

// 1. 默认 application/json
export function createUser(data) {
  return request({
    url: '/users',
    method: 'post',
    data
  })
}

// 2. application/x-www-form-urlencoded
export function login(data) {
  return request({
    url: '/auth/login',
    method: 'post',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    data: {
      username: data.username,
      password: data.password
    }
  })
}

// 3. multipart/form-data（文件上传）
export function uploadFile(file) {
  const formData = new FormData()
  formData.append('file', file)
  
  return request({
    url: '/upload',
    method: 'post',
    data: formData
    // 不需要手动设置 Content-Type，axios 会自动处理
  })
}

// 4. 混合表单数据和文件
export function updateUserProfile(userId, data, avatar) {
  const formData = new FormData()
  // 添加普通表单数据
  Object.keys(data).forEach(key => {
    formData.append(key, data[key])
  })
  // 添加文件
  if (avatar) {
    formData.append('avatar', avatar)
  }

  return request({
    url: `/users/${userId}/profile`,
    method: 'put',
    data: formData
  })
}

// 带查询参数的复杂请求示例
export function searchItems(params) {
  return request({
    url: '/items/search',
    method: 'post',
    params: {
      // URL参数
      page: params.page,
      size: params.size
    },
    data: {
      // 请求体参数
      keyword: params.keyword,
      filters: params.filters
    }
  })
} 