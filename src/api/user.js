import request from '@/utils/request'

// 获取用户个人资料
export function getUserProfile(id) {
  return request({
    url: `/api/users/${id}`,
    method: 'get'
  })
}

// 修改用户资料
export function updateUserProfile(id, data) {
  return request({
    url: `/api/users/${id}`,
    method: 'patch',
    data
  })
}

// 修改密码
export function updatePassword(id, data) {
  return request({
    url: `/api/users/${id}/password`,
    method: 'post',
    data
  })
}

export default {
  getUserProfile,
  updateUserProfile,
  updatePassword
} 