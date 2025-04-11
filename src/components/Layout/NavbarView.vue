<template>
  <nav class="navbar">
    <div class="navbar-left">
      <img src="@/assets/logo.png" alt="Logo" class="logo">
      <router-link to="/" class="brand">心灵之桥</router-link>
    </div>
    
    <div class="navbar-center">
      <router-link to="/" class="nav-item">首页</router-link>
      <a @click.prevent="handleArticle" class="nav-item">阅读</a>
      <a @click.prevent="handleNavigation('/forum')" class="nav-item">问答</a>
      <a @click.prevent="handleNavigation('/contact')" class="nav-item">成为咨询师？联系我们！</a>
      <a @click.prevent="handleConsultation" class="nav-item">心理咨询</a>
    </div>
    
    <div class="navbar-right">
      <template v-if="!isLoggedIn">
        <router-link to="/login" class="auth-btn">登录/注册</router-link>
      </template>
      <template v-else>
        <div class="user-menu" ref="menuRef">
          <div class="user-avatar" @click="toggleDropdown">
            <img 
              :src="currentUser?.avatar || 'https://randomuser.me/api/portraits/women/10.jpg'" 
              :alt="currentUser?.username"
            >
          </div>
          
          <div v-show="showDropdown" class="dropdown-menu">
            <router-link to="/profile" class="dropdown-item" @click="closeDropdown">
              <i class="fas fa-user"></i> 个人主页
            </router-link>
            <router-link to="/my/appointments" class="dropdown-item" @click="closeDropdown">
              <i class="fas fa-calendar"></i> 我的预约
              <span v-if="currentUser?.appointmentCount" class="badge">
                {{ currentUser.appointmentCount }}
              </span>
            </router-link>
            <router-link to="/my/posts" class="dropdown-item" @click="closeDropdown">
              <i class="fas fa-comments"></i> 我的问答
              <span v-if="currentUser?.postCount" class="badge">
                {{ currentUser.postCount }}
              </span>
            </router-link>
            <div class="dropdown-divider"></div>
            <a href="#" class="dropdown-item logout" @click.prevent="handleLogout">
              <i class="fas fa-sign-out-alt"></i> 退出登录
            </a>
          </div>
        </div>
      </template>
    </div>
  </nav>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useAuthStore } from '@/store/auth'
import { useRouter } from 'vue-router'

const router = useRouter()
const authStore = useAuthStore()
const showDropdown = ref(false)
const menuRef = ref(null)

const isLoggedIn = computed(() => authStore.isLoggedIn)
const currentUser = computed(() => authStore.currentUser)

// 处理导航
const handleNavigation = (path) => {
  if (!isLoggedIn.value) {
    // 保存用户想要访问的路径，登录后可以重定向回来
    localStorage.setItem('intendedPath', path)
    router.push('/login')
  } else {
    router.push(path)
  }
}

// 切换下拉菜单
const toggleDropdown = () => {
  showDropdown.value = !showDropdown.value
}

// 关闭下拉菜单
const closeDropdown = () => {
  showDropdown.value = false
}

// 处理点击外部关闭下拉菜单
const handleClickOutside = (event) => {
  if (menuRef.value && !menuRef.value.contains(event.target)) {
    showDropdown.value = false
  }
}

// 处理登出
const handleLogout = async () => {
  try {
    // 调用 store 的 logout action
    authStore.logout()
    closeDropdown()
    router.push('/login')
  } catch (error) {
    console.error('Logout failed:', error)
  }
}

// 添加处理咨询导航的方法
const handleConsultation = () => {
  if (!isLoggedIn.value) {
    localStorage.setItem('intendedPath', '/consultation')
    router.push('/login')
  } else {
    console.log(localStorage.getItem('role'))
    const userRole = localStorage.getItem('role')
    console.log(userRole)
    if (userRole === '0') { // 咨询师角色
      router.push('/consultant/consultation')  // 咨询师专用的预约管理页面
    } else {
      router.push('/consultation')  // 普通用户的咨询页面
    }
  }
}


const handleArticle = () => {
  if(!isLoggedIn.value){
    localStorage.setItem('intendedPath', '/articles')
    router.push('/login')
  }else{
    const userRole = localStorage.getItem('role')
    if(userRole === '0'){
      router.push('/consultant/articles')
    }else{
      router.push('/articles')
    }
  }
}

// 添加和移除全局点击事件监听
onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped>
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 2rem;
  height: 60px;
  background: white;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  position: sticky;
  top: 0;
  z-index: 1000;
}

.navbar-left {
  display: flex;
  align-items: center;
}

.logo {
  height: 32px;
  margin-right: 1rem;
}

.brand {
  font-size: 1.5rem;
  font-weight: bold;
  color: #4a90e2;
  text-decoration: none;
}

.navbar-center {
  display: flex;
  gap: 2rem;
}

.nav-item {
  text-decoration: none;
  color: #333;
  font-size: 1rem;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  transition: all 0.3s;
  cursor: pointer;
}

.nav-item:hover {
  color: #4a90e2;
  background: rgba(74, 144, 226, 0.1);
}

.navbar-right {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.auth-btn {
  padding: 0.5rem 1.5rem;
  border-radius: 4px;
  text-decoration: none;
  color: #4a90e2;
  border: 1px solid #4a90e2;
  transition: all 0.3s;
}

.auth-btn:hover {
  background: #4a90e2;
  color: white;
}

.user-menu {
  position: relative;
}

.user-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  cursor: pointer;
  overflow: hidden;
  border: 2px solid #4a90e2;
}

.user-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.dropdown-menu {
  position: absolute;
  top: 100%;
  right: 0;
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  min-width: 200px;
  margin-top: 8px;
  z-index: 1000;
}

.dropdown-item {
  display: flex;
  align-items: center;
  padding: 12px 16px;
  color: #333;
  text-decoration: none;
  transition: background-color 0.3s;
}

.dropdown-item i {
  margin-right: 8px;
  width: 16px;
  color: #666;
}

.dropdown-item:hover {
  background: #f5f5f5;
}

.badge {
  background: #4a90e2;
  color: white;
  padding: 2px 6px;
  border-radius: 10px;
  font-size: 12px;
  margin-left: auto;
}

.dropdown-divider {
  height: 1px;
  background: #eee;
  margin: 4px 0;
}

.logout {
  color: #ff4d4f;
}

.logout i {
  color: #ff4d4f;
}
</style>