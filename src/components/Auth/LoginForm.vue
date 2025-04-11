<template>
  <div class="login-container">
    <div class="login-box">
      <div class="login-header">
        <h2>登录心灵之桥</h2>
        <p>开启您的心理健康之旅</p>
      </div>
      
      <form @submit.prevent="handleSubmit" class="login-form">
        <div class="form-group">
          <input
            type="text"
            v-model="id"
            placeholder="手机号/邮箱"
            required
            :class="{ 'error': errors.id }"
          >
          <span class="error-message" v-if="errors.id">{{ errors.id }}</span>
        </div>
        
        <div class="form-group">
          <div class="password-input">
            <input
              :type="showPassword ? 'text' : 'password'"
              v-model="password"
              placeholder="密码"
              required
              :class="{ 'error': errors.password }"
            >
            <button 
              type="button" 
              class="toggle-password"
              @click="showPassword = !showPassword"
            >
              <i :class="showPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
            </button>
          </div>
          <span class="error-message" v-if="errors.password">{{ errors.password }}</span>
        </div>

        <div class="form-group">
          <select v-model="role" required>
            <option value="" disabled>选择身份</option>
            <option value="0">咨询师</option>
            <option value="1">咨询者</option>
          </select>
        </div>
        
        <button type="submit" class="login-button" :disabled="loading">
          {{ loading ? '登录中...' : '登录' }}
        </button>
      </form>
      
      <div class="register-link">
        还没有账号？ <router-link to="/register">立即注册</router-link>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, reactive } from 'vue'
import { useAuthStore } from '@/store/auth'
import { useRouter } from 'vue-router'

export default {
  name: 'LoginForm',
  
  setup() {
    const router = useRouter()
    const authStore = useAuthStore()
    
    const id = ref('')
    const password = ref('')
    const role = ref('')
    const rememberMe = ref(false)
    const showPassword = ref(false)
    const loading = ref(false)
    const errors = reactive({
      id: '',
      password: ''
    })
    
    const validateForm = () => {
      let isValid = true
      errors.id = ''
      errors.password = ''
      
      if (!id.value) {
        errors.id = '请输入手机号或邮箱'
        isValid = false
      }
      
      if (!password.value) {
        errors.password = '请输入密码'
        isValid = false
      }
      
      if (!role.value) {
        errors.role = '请选择身份'
        isValid = false
      }
      
      return isValid
    }
    
    const handleSubmit = async () => {
      if (!validateForm()) return
      
      loading.value = true
      try {
        await authStore.login({
          id: id.value,
          password: password.value,
          role: role.value
        })
        router.push('/')
      } catch (error) {
        errors.password = error.message || '登录失败，请稍后重试'
      } finally {
        loading.value = false
      }
    }
    
    if (localStorage.getItem('savedId')) {
      id.value = localStorage.getItem('savedId')
      rememberMe.value = true
    }
    
    const forgotPassword = () => {
      router.push('/forgot-password')
    }
    
    return {
      id,
      password,
      role,
      rememberMe,
      showPassword,
      loading,
      errors,
      handleSubmit,
      forgotPassword
    }
  }
}
</script>

<style scoped>
.login-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #e0f7fa 0%, #b2ebf2 100%);
  padding: 20px;
}

.login-box {
  background: white;
  border-radius: 10px;
  box-shadow: 0 8px 24px rgba(0,0,0,0.1);
  padding: 40px;
  width: 100%;
  max-width: 400px;
}

.login-header {
  text-align: center;
  margin-bottom: 30px;
}

.login-header h2 {
  color: #333;
  font-size: 24px;
  margin-bottom: 8px;
}

.login-header p {
  color: #666;
  font-size: 14px;
}

.form-group {
  margin-bottom: 20px;
}

.form-group input {
  width: 100%;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 14px;
  transition: border-color 0.3s;
}

.form-group input:focus {
  border-color: #4a90e2;
  outline: none;
}

.form-group input.error {
  border-color: #ff4d4f;
}

.error-message {
  color: #ff4d4f;
  font-size: 12px;
  margin-top: 4px;
}

.password-input {
  position: relative;
}

.toggle-password {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: #999;
  cursor: pointer;
}

.form-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  font-size: 14px;
}

.form-options a {
  color: #4a90e2;
  text-decoration: none;
}

.login-button {
  width: 100%;
  padding: 12px;
  background: #4a90e2;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.login-button:hover {
  background: #357abd;
}

.login-button:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.divider {
  text-align: center;
  margin: 20px 0;
  position: relative;
}

.divider::before,
.divider::after {
  content: '';
  position: absolute;
  top: 50%;
  width: 45%;
  height: 1px;
  background: #ddd;
}

.divider::before {
  left: 0;
}

.divider::after {
  right: 0;
}

.divider span {
  background: white;
  padding: 0 10px;
  color: #666;
  font-size: 14px;
}

.social-login {
  margin-bottom: 20px;
}

.wechat-login {
  width: 100%;
  padding: 12px;
  background: #07c160;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 16px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.register-link {
  text-align: center;
  font-size: 14px;
  color: #666;
}

.register-link a {
  color: #4a90e2;
  text-decoration: none;
}
</style>