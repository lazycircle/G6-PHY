<template>
  <div class="profile-view">
    <NavbarView />
    <div class="profile-container">
      <div class="profile-sidebar">
        <div class="user-card">
          <div class="user-avatar-wrapper">
            <img :src="user.avatar || 'https://randomuser.me/api/portraits/women/10.jpg'" :alt="user.username">
            <button class="change-avatar-btn" @click="triggerAvatarUpload">
              <i class="fas fa-camera"></i>
            </button>
            <input
              type="file"
              ref="avatarInput"
              style="display: none"
              accept="image/*"
              @change="handleAvatarChange"
            >
          </div>
          <h2>{{ user.username }}</h2>
          <p class="user-type">{{ userTypeLabel }}</p>
        </div>
        
        <div class="profile-menu">
          <a 
            v-for="menu in menuItems" 
            :key="menu.id"
            :class="['menu-item', { active: currentSection === menu.id }]"
            @click="currentSection = menu.id"
          >
            <i :class="menu.icon"></i>
            {{ menu.label }}
          </a>
        </div>
      </div>
      
      <div class="profile-content">
        <!-- 基本信息部分 -->
        <div v-if="currentSection === 'basic'" class="profile-section">
          <h3>基本信息</h3>
          <form @submit.prevent="updateBasicInfo" class="profile-form">
            <div class="form-group">
              <label>用户名</label>
              <input type="text" v-model="basicInfo.username">
            </div>
            
            <div class="form-group">
              <label>邮箱</label>
              <input type="email" v-model="basicInfo.email" disabled>
            </div>
            
            <div class="form-group">
              <label>手机号码</label>
              <input type="tel" v-model="basicInfo.phone">
            </div>
            
            <div class="form-group">
              <label>性别</label>
              <select v-model="basicInfo.gender">
                <option value="">请选择</option>
                <option value="male">男</option>
                <option value="female">女</option>
                <option value="other">其他</option>
              </select>
            </div>
            
            <div class="form-group">
              <label>生日</label>
              <input type="date" v-model="basicInfo.birthday">
            </div>
            
            <button type="submit" class="save-btn" :disabled="updating">
              {{ updating ? '保存中...' : '保存修改' }}
            </button>
          </form>
        </div>
        
        <!-- 安全设置部分 -->
        <div v-if="currentSection === 'security'" class="profile-section">
          <h3>安全设置</h3>
          <form @submit.prevent="updatePassword" class="profile-form">
            <div class="form-group">
              <label>当前密码</label>
              <input type="password" v-model="security.currentPassword">
            </div>
            
            <div class="form-group">
              <label>新密码</label>
              <input type="password" v-model="security.newPassword">
            </div>
            
            <div class="form-group">
              <label>确认新密码</label>
              <input type="password" v-model="security.confirmPassword">
            </div>
            
            <button type="submit" class="save-btn" :disabled="updating">
              {{ updating ? '更新中...' : '更新密码' }}
            </button>
          </form>
        </div>
        
        <!-- 我的预约部分 -->
        <div v-if="currentSection === 'appointments'" class="profile-section">
          <h3>我的预约</h3>
          <div class="appointments-list">
            <div v-for="appointment in appointments" :key="appointment.id" class="appointment-card">
              <div class="appointment-header">
                <img :src="appointment.therapist.avatar" :alt="appointment.therapist.name">
                <div class="appointment-info">
                  <h4>{{ appointment.therapist.name }}</h4>
                  <p>{{ appointment.date }} {{ appointment.time }}</p>
                </div>
                <div :class="['appointment-status', appointment.status]">
                  {{ appointmentStatusLabel[appointment.status] }}
                </div>
              </div>
              <div class="appointment-actions">
                <button 
                  v-if="appointment.status === 'upcoming'"
                  @click="cancelAppointment(appointment.id)"
                  class="cancel-btn"
                >
                  取消预约
                </button>
                <button 
                  v-if="appointment.status === 'completed'"
                  @click="writeReview(appointment.id)"
                  class="review-btn"
                >
                  写评价
                </button>
              </div>
            </div>
          </div>
        </div>
        
        <!-- 我的帖子部分 -->
        <div v-if="currentSection === 'posts'" class="profile-section">
          <h3>我的帖子</h3>
          <div class="posts-list">
            <div v-for="post in posts" :key="post.id" class="post-card">
              <h4>{{ post.title }}</h4>
              <p class="post-excerpt">{{ post.content }}</p>
              <div class="post-meta">
                <span><i class="fas fa-clock"></i> {{ post.createdAt }}</span>
                <span><i class="fas fa-comment"></i> {{ post.commentCount }}回复</span>
                <span><i class="fas fa-eye"></i> {{ post.viewCount }}浏览</span>
              </div>
              <div class="post-actions">
                <button @click="editPost(post.id)" class="edit-btn">编辑</button>
                <button @click="deletePost(post.id)" class="delete-btn">删除</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    </div>
  </template>

<script>
import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from '@/store/auth' // 修改这里，使用 Pinia store
import NavbarView from '@/components/Layout/NavbarView.vue'

export default {
  name: 'ProfileView',
  components: { NavbarView }, // 修改组件名称
  
  setup() {
    const authStore = useAuthStore() // 使用 Pinia store
    const currentSection = ref('basic')
    const updating = ref(false)
    const avatarInput = ref(null)
    
    // 修改这里，使用 Pinia store 的 state
    const user = computed(() => authStore.currentUser)
    
    const userTypeLabel = computed(() => {
      return user.value?.userType === 'therapist' ? '心理咨询师' : '普通用户'
    })
    
    const menuItems = [
      { id: 'basic', label: '基本信息', icon: 'fas fa-user' },
      { id: 'security', label: '安全设置', icon: 'fas fa-lock' },
      { id: 'appointments', label: '我的预约', icon: 'fas fa-calendar' },
      { id: 'posts', label: '我的帖子', icon: 'fas fa-comments' }
    ]
    
    const basicInfo = ref({
      username: '',
      email: '',
      phone: '',
      gender: '',
      birthday: ''
    })
    
    const security = ref({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    })
    
    const appointments = ref([])
    const posts = ref([])
    
    const appointmentStatusLabel = {
      upcoming: '即将到来',
      completed: '已完成',
      cancelled: '已取消'
    }
    
    onMounted(async () => {
      // 加载用户信息
      if (user.value) {
        basicInfo.value = { ...user.value }
      }
      
      // 加载预约信息
      await loadAppointments()
      
      // 加载帖子信息
      await loadPosts()
    })
    
    const loadAppointments = async () => {
      try {
        // 这里需要修改为使用 API 函数
        const response = await fetch('/api/user/appointments')
        const data = await response.json()
        appointments.value = data
      } catch (error) {
        console.error('Failed to load appointments:', error)
      }
    }
    
    const loadPosts = async () => {
      try {
        // 这里需要修改为使用 API 函数
        const response = await fetch('/api/user/posts')
        const data = await response.json()
        posts.value = data
      } catch (error) {
        console.error('Failed to load posts:', error)
      }
    }
    
    const updateBasicInfo = async () => {
      updating.value = true
      try {
        await authStore.updateProfile(basicInfo.value)
        // 显示成功提示
      } catch (error) {
        // 显示错误提示
      } finally {
        updating.value = false
      }
    }
    
    const updatePassword = async () => {
      if (security.value.newPassword !== security.value.confirmPassword) {
        // 显示错误提示
        return
      }
      
      updating.value = true
      try {
        await authStore.updatePassword({
          currentPassword: security.value.currentPassword,
          newPassword: security.value.newPassword
        })
        // 显示成功提示
        security.value = { currentPassword: '', newPassword: '', confirmPassword: '' }
      } catch (error) {
        // 显示错误提示
      } finally {
        updating.value = false
      }
    }
    
    const triggerAvatarUpload = () => {
      avatarInput.value.click()
    }
    
    const handleAvatarChange = async (event) => {
      const file = event.target.files[0]
      if (!file) return
      
      try {
        // 这里需要修改为使用 API 函数
        const formData = new FormData()
        formData.append('avatar', file)
        await fetch('/api/user/avatar', {
          method: 'POST',
          body: formData
        })
        // 显示成功提示
      } catch (error) {
        // 显示错误提示
      }
    }
    
    const cancelAppointment = async (appointmentId) => {
      try {
        // 这里需要修改为使用 API 函数
        await fetch(`/api/appointments/${appointmentId}/cancel`, {
          method: 'POST'
        })
        await loadAppointments()
        // 显示成功提示
      } catch (error) {
        // 显示错误提示
      }
    }
    
    // const writeReview = (appointmentId) => {
    //   // 实现评价功能
    // }
    
    // const editPost = (postId) => {
    //   // 实现编辑帖子功能
    // }
    
    const deletePost = async (postId) => {
      try {
        // 这里需要修改为使用 API 函数
        await fetch(`/api/posts/${postId}`, {
          method: 'DELETE'
        })
        await loadPosts()
        // 显示成功提示
      } catch (error) {
        // 显示错误提示
      }
    }
    
    return {
      currentSection,
      user,
      userTypeLabel,
      menuItems,
      basicInfo,
      security,
      appointments,
      posts,
      updating,
      avatarInput,
      appointmentStatusLabel,
      updateBasicInfo,
      updatePassword,
      triggerAvatarUpload,
      handleAvatarChange,
      cancelAppointment,
      // writeReview,
      // editPost,
      deletePost
    }
  }
}
  </script>

<style scoped>
.profile-view {
  min-height: 100vh;
  background: #f5f5f5;
}

.profile-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1rem;
  display: grid;
  grid-template-columns: 280px 1fr;
  gap: 2rem;
}

.profile-sidebar {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  overflow: hidden;
}

.user-card {
  padding: 2rem;
  text-align: center;
  border-bottom: 1px solid #eee;
}

.user-avatar-wrapper {
  position: relative;
  width: 120px;
  height: 120px;
  margin: 0 auto 1rem;
}

.user-avatar-wrapper img {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
}

.change-avatar-btn {
  position: absolute;
  bottom: 0;
  right: 0;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: #4a90e2;
  color: white;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.user-type {
  color: #666;
  font-size: 14px;
}

.profile-menu {
  padding: 1rem 0;
}

.menu-item {
  display: flex;
  align-items: center;
  padding: 1rem 2rem;
  color: #666;
  text-decoration: none;
  cursor: pointer;
  transition: all 0.3s;
}

.menu-item i {
  margin-right: 1rem;
  width: 20px;
}

.menu-item:hover,
.menu-item.active {
  background: #f5f5f5;
  color: #4a90e2;
}

.profile-content {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  padding: 2rem;
}

.profile-section h3 {
  margin-bottom: 2rem;
  color: #333;
}

.profile-form .form-group {
  margin-bottom: 1.5rem;
}

.profile-form label {
  display: block;
  margin-bottom: 0.5rem;
  color: #666;
}

.profile-form input,
.profile-form select {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
}

.save-btn {
  background: #4a90e2;
  color: white;
  border: none;
  padding: 0.75rem 2rem;
  border-radius: 4px;
  cursor: pointer;
}

.save-btn:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.appointments-list,
.posts-list {
  display: grid;
  gap: 1rem;
}

.appointment-card,
.post-card {
  background: #f9f9f9;
  border-radius: 8px;
  padding: 1rem;
}

.appointment-header {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.appointment-header img {
  width: 48px;
  height: 48px;
  border-radius: 50%;
}

.appointment-status {
  margin-left: auto;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 12px;
}

.appointment-status.upcoming {
  background: #e6f7ff;
  color: #1890ff;
}

.appointment-status.completed {
  background: #f6ffed;
  color: #52c41a;
}

.appointment-status.cancelled {
  background: #fff1f0;
  color: #f5222d;
}

.appointment-actions,
.post-actions {
  margin-top: 1rem;
  display: flex;
  gap: 1rem;
}

.cancel-btn,
.delete-btn {
  background: #ff4d4f;
  color: white;
}

.review-btn,
.edit-btn {
  background: #4a90e2;
  color: white;
}

.post-meta {
  display: flex;
  gap: 1rem;
  color: #666;
  font-size: 12px;
  margin-top: 0.5rem;
}

.post-meta i {
  margin-right: 0.25rem;
}
</style>