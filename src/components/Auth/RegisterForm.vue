<template>
  <div class="register-container">
    <div class="register-box">
      <div class="register-header">
        <h2>注册心灵之桥</h2>
        <p>开启您的心理健康之旅</p>
      </div>
      
      <form @submit.prevent="handleSubmit" class="register-form">
        <div class="form-group">
          <input
            type="text"
            v-model="username"
            placeholder="用户名"
            required
            :class="{ 'error': errors.username }"
          >
          <span class="error-message" v-if="errors.username">{{ errors.username }}</span>
        </div>
        
        <div class="form-group">
          <input
            type="tel"
            v-model="phone"
            placeholder="手机号"
            required
            :class="{ 'error': errors.phone }"
          >
          <span class="error-message" v-if="errors.phone">{{ errors.phone }}</span>
        </div>
        
        <div class="form-group">
          <input
            type="email"
            v-model="email"
            placeholder="邮箱（选填）"
            :class="{ 'error': errors.email }"
          >
          <span class="error-message" v-if="errors.email">{{ errors.email }}</span>
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
          <div class="password-input">
            <input
              :type="showPassword ? 'text' : 'password'"
              v-model="confirmPassword"
              placeholder="确认密码"
              required
              :class="{ 'error': errors.confirmPassword }"
            >
          </div>
          <span class="error-message" v-if="errors.confirmPassword">{{ errors.confirmPassword }}</span>
        </div>
        <div class="form-group">
        <input
            type="text"
            v-model="auth_code"
            placeholder="咨询师认证码(咨询师注册必填)"
            :class="{ 'error': errors.auth_code }"
          >
          <span class="error-message" v-if="errors.auth_code">{{ errors.auth_code
           }}</span>
        </div>


        
        <!-- <div class="form-group">
          <select v-model="userType" :class="{ 'error': errors.userType }">
            <option value="">选择用户类型</option>
            <option value="user">普通用户</option>
            <option value="therapist">心理咨询师</option>
          </select>
          <span class="error-message" v-if="errors.userType">{{ errors.userType }}</span>
        </div> -->
        
        <div class="form-agreement">
          <label>
            <input type="checkbox" v-model="agreement">
            我已阅读并同意
            <a href="#" @click.prevent="showTerms">服务条款</a>
            和
            <a href="#" @click.prevent="showPrivacy">隐私政策</a>
          </label>
          <span class="error-message" v-if="errors.agreement">{{ errors.agreement }}</span>
        </div>
        
        <button type="submit" class="register-button" :disabled="loading">
          {{ loading ? '注册中...' : '注册' }}
        </button>
      </form>
      
      <div class="login-link">
        已有账号？ <router-link to="/login">立即登录</router-link>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, reactive } from 'vue'
import { useAuthStore } from '@/store/auth'
import { useRouter } from 'vue-router'

export default {
  name: 'RegisterForm',
  
  setup() {
    const router = useRouter()
    const authStore = useAuthStore()
    
    const username = ref('')
    const phone = ref('')
    const email = ref('')
    const password = ref('')
    const auth_code = ref('')
    //const userType = ref('user') // 默认用户类型为普通用户
    const confirmPassword = ref('')
    const agreement = ref(false)
    const showPassword = ref(false)
    const loading = ref(false)
    
    const errors = reactive({
      username: '',
      phone: '',
      email: '',
      password: '',
      confirmPassword: '',
      agreement: ''
    })
    
    const validateForm = () => {
      let isValid = true
      
      // 重置错误信息
      Object.keys(errors).forEach(key => errors[key] = '')
      
      // 验证用户名
      if (!username.value) {
        errors.username = '请输入用户名'
        isValid = false
      } else if (username.value.length < 2) {
        errors.username = '用户名至少需要2个字符'
        isValid = false
      }
      
      // 验证手机号
      if (!phone.value) {
        errors.phone = '请输入手机号'
        isValid = false
      } else if (!/^1[3-9]\d{9}$/.test(phone.value)) {
        errors.phone = '请输入有效的手机号'
        isValid = false
      }
      
      // 验证邮箱（如果填写了）
      if (email.value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
        errors.email = '请输入有效的邮箱地址'
        isValid = false
      }
      
      // 验证密码
      if (!password.value) {
        errors.password = '请输入密码'
        isValid = false
      } else if (password.value.length < 6) {
        errors.password = '密码长度至少为6位'
        isValid = false
      }
      
      // 验证确认密码
      if (!confirmPassword.value) {
        errors.confirmPassword = '请确认密码'
        isValid = false
      } else if (confirmPassword.value !== password.value) {
        errors.confirmPassword = '两次输入的密码不一致'
        isValid = false
      }
      
      // 验证协议同意
      if (!agreement.value) {
        errors.agreement = '请阅读并同意服务条款和隐私政策'
        isValid = false
      }
      
      return isValid
    }
    
    const handleSubmit = async () => {
      if (!validateForm()) return
      
      loading.value = true
      try {
        await authStore.register({
          username: username.value,
          phone: phone.value,
          email: email.value,
          password: password.value,
          auth_code: auth_code.value
        })

        router.push('/')
      } catch (error) {
        if (error.message) {
          // 根据错误信息设置相应的错误提示
          if (error.message.includes('手机号')) {
            errors.phone = error.message
          } else if (error.message.includes('邮箱')) {
            errors.email = error.message
          } else {
            errors.username = error.message
          }
        }
      } finally {
        loading.value = false
      }
    }
    
    const showTerms = () => {
      // 显示服务条款
    }
    
    const showPrivacy = () => {
      // 显示隐私政策
    }
    
    return {
      username,
      phone,
      email,
      password,
      confirmPassword,
      auth_code,
      agreement,
      showPassword,
      loading,
      errors,
      handleSubmit,
      showTerms,
      showPrivacy
    }
  }
}
</script>

<style scoped>
.register-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #e0f7fa 0%, #b2ebf2 100%);
  padding: 20px;
}

.register-box {
  background: white;
  border-radius: 10px;
  box-shadow: 0 8px 24px rgba(0,0,0,0.1);
  padding: 40px;
  width: 100%;
  max-width: 400px;
}

.register-header {
  text-align: center;
  margin-bottom: 30px;
}

.register-header h2 {
  color: #333;
  font-size: 24px;
  margin-bottom: 8px;
}

.register-header p {
  color: #666;
  font-size: 14px;
}

.form-group {
  margin-bottom: 20px;
}

.form-group input,
.form-group select {
  width: 100%;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 14px;
  transition: border-color 0.3s;
}

.form-group input:focus,
.form-group select:focus {
  border-color: #4a90e2;
  outline: none;
}

.form-group input.error,
.form-group select.error {
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

.form-agreement {
  margin-bottom: 20px;
  font-size: 14px;
}

.form-agreement a {
  color: #4a90e2;
  text-decoration: none;
}

.register-button {
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

.register-button:hover {
  background: #357abd;
}

.register-button:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.login-link {
  text-align: center;
  margin-top: 20px;
  font-size: 14px;
  color: #666;
}

.login-link a {
  color: #4a90e2;
  text-decoration: none;
}
</style>