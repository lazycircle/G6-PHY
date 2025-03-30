<template>
  <div class="chat-header">
    <div class="therapist-info">
      <img :src="therapist.avatar" :alt="therapist.name" class="therapist-avatar">
      <div class="therapist-details">
        <div class="therapist-name">
          {{ therapist.name }}
          <span class="online-status" :class="{ online: therapist.isOnline }">
            {{ therapist.isOnline ? '在线' : '离线' }}
          </span>
        </div>
        <div class="therapist-title">{{ therapist.title }}</div>
      </div>
    </div>
    
    <div class="header-actions">
      <!-- 更多操作按钮 -->
      <div class="action-menu" @click="toggleMenu">
        <i class="fas fa-ellipsis-v"></i>
      </div>
      
      <!-- 下拉菜单 -->
      <div v-if="showMenu" class="dropdown-menu">
        <div class="menu-item" @click="viewProfile">
          <i class="fas fa-user"></i>
          查看咨询师资料
        </div>
        <div class="menu-item" @click="clearHistory">
          <i class="fas fa-trash"></i>
          清空聊天记录
        </div>
        <div class="menu-item" @click="reportIssue">
          <i class="fas fa-flag"></i>
          投诉
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, defineProps, defineEmits, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const showMenu = ref(false)

const props = defineProps({
  therapist: {
    type: Object,
    required: true,
    default: () => ({
      id: '',
      name: '',
      avatar: '',
      title: '',
      isOnline: false
    })
  }
})

const emit = defineEmits(['clear-history'])

// 切换菜单显示状态
const toggleMenu = () => {
  showMenu.value = !showMenu.value
}

// 查看咨询师资料
const viewProfile = () => {
  router.push(`/therapist/${props.therapist.id}`)
  showMenu.value = false
}

// 清空聊天记录
const clearHistory = () => {
  if (confirm('确定要清空聊天记录吗？此操作不可恢复。')) {
    emit('clear-history')
  }
  showMenu.value = false
}

// 投诉
const reportIssue = () => {
  router.push({
    path: '/report',
    query: {
      therapistId: props.therapist.id,
      therapistName: props.therapist.name
    }
  })
  showMenu.value = false
}

// 点击其他地方关闭菜单
const closeMenu = (e) => {
  if (!e.target.closest('.action-menu')) {
    showMenu.value = false
  }
}

// 添加全局点击事件监听
if (typeof window !== 'undefined') {
  window.addEventListener('click', closeMenu)
}

// 组件卸载时移除事件监听
onUnmounted(() => {
  if (typeof window !== 'undefined') {
    window.removeEventListener('click', closeMenu)
  }
})
</script>

<style scoped>
.chat-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  border-bottom: 1px solid #eee;
  background: white;
}

.therapist-info {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.therapist-avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  object-fit: cover;
}

.therapist-details {
  display: flex;
  flex-direction: column;
}

.therapist-name {
  font-size: 1.1rem;
  font-weight: 500;
  color: #333;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.online-status {
  font-size: 0.8rem;
  padding: 0.2rem 0.5rem;
  border-radius: 12px;
  background: #f5f5f5;
  color: #999;
}

.online-status.online {
  background: #e6f7ff;
  color: #4a90e2;
}

.therapist-title {
  font-size: 0.9rem;
  color: #666;
  margin-top: 0.25rem;
}

.header-actions {
  position: relative;
}

.action-menu {
  padding: 0.5rem;
  cursor: pointer;
  color: #666;
}

.action-menu:hover {
  color: #4a90e2;
}

.dropdown-menu {
  position: absolute;
  top: 100%;
  right: 0;
  background: white;
  border-radius: 4px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.15);
  z-index: 1000;
  min-width: 160px;
}

.menu-item {
  padding: 0.75rem 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  color: #333;
  transition: background-color 0.3s;
}

.menu-item:hover {
  background: #f5f5f5;
}

.menu-item i {
  width: 16px;
  color: #666;
}

/* 添加动画效果 */
.dropdown-menu {
  transform-origin: top right;
  animation: dropdown 0.2s ease-out;
}

@keyframes dropdown {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}
</style> 