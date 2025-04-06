import { defineStore } from 'pinia'
import auth from '@/api/auth'

// 在开发环境中引入 mock
// if (process.env.NODE_ENV === 'development') {
//   require('@/mock')
// }

export const useAuthStore = defineStore('auth', {
  state: () => ({
    id: localStorage.getItem('id') || null,
    token: localStorage.getItem('token') || null,
    role: localStorage.getItem('role') || null,
    username: localStorage.getItem('username') || null
  }),

  getters: {
    isLoggedIn: (state) => !!state.token,
    currentUser: (state) => state.id
  },

  actions: {
    async login(credentials) {
      try {
        const response = await auth.login(credentials.id, credentials.password)
        if (response.status === 200) {
          this.id = response.id
          this.token = response.token
          this.role = response.role
          this.username = credentials.id
          localStorage.setItem('username', credentials.id)
          localStorage.setItem('id', response.id)
          localStorage.setItem('token', response.token)
          localStorage.setItem('role', response.role)
          return response
        }
        throw new Error(response.message || '登录失败')
      } catch (error) {
        console.error('Login error:', error)
        throw error
      }
    },

    async adminLogin(credentials) {
      try {
        const response = await auth.adminLogin(credentials.id, credentials.password)
        if (response.status === 200) {
          this.id = credentials.id
          this.token = response.token
          this.role = response.role
          this.username = credentials.id
          localStorage.setItem('username', credentials.id)
          localStorage.setItem('id', credentials.id)
          localStorage.setItem('token', response.token)
          localStorage.setItem('role', response.role)
          return response
        }
        throw new Error(response.message || '登录失败')
      } catch (error) {
        console.error('Login error:', error)
        throw error
      }
    },

    async register(userData) {
      try {
        const response = await auth.register(userData)
        console.log('Register response:', response) // 添加调试日志
        
        if (response.status === 200 && response.token) {
          this.id = response.id
          this.token = response.token
          this.role = response.role
          this.username = userData.username
          localStorage.setItem('id', response.id)
          localStorage.setItem('token', response.token)
          localStorage.setItem('role', response.role)
          localStorage.setItem('username', userData.username)
          return response
        }
        throw new Error(response.message || '注册失败')
      } catch (error) {
        console.error('Register store error:', error)
        throw error
      }
    },

    logout() {
      this.id = null
      this.token = null
      this.role = null
      this.username = null
      localStorage.removeItem('id')
      localStorage.removeItem('token')
      localStorage.removeItem('role')
      localStorage.removeItem('username')
    }
  }
})