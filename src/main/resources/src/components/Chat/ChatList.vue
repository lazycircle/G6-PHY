<template>
  <div class="chat-list">
    <div class="list-header">
      <h2>会话列表</h2>
    </div>
    <div class="list-content">
      <div v-if="loading" class="loading">加载中...</div>
      <div v-else-if="chats.length === 0" class="empty-state">
        暂无会话记录
      </div>
      <div 
        v-else
        v-for="chat in chats" 
        :key="chat.session_id"
        class="chat-item"
        :class="{ active: activeChat?.session_id === chat.session_id }"
        @click="handleSelectChat(chat)"
      >
        <div class="chat-avatar">
          <i class="fas fa-user-circle"></i>
        </div>
        <div class="chat-info">
          <div class="chat-name">{{ chat.username[0] }}</div>
          <div class="chat-time">{{ formatTime(chat.end_time) }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, defineProps, defineEmits } from 'vue'
import sessionApi from '@/api/session'

defineProps({
  activeChat: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['select-chat'])

const loading = ref(true)
const chats = ref([])

const fetchChatList = async () => {
  try {
    const userId = localStorage.getItem('id')
    const userType = localStorage.getItem('user_type')
    const response = await sessionApi.getSessionList(userId, userType)
    if (response.code === 200) {
      chats.value = response.data
    }
  } catch (error) {
    console.error('获取会话列表失败:', error)
  } finally {
    loading.value = false
  }
}

const formatTime = (time) => {
  const date = new Date(time)
  return date.toLocaleString('zh-CN', {
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const handleSelectChat = (chat) => {
  emit('select-chat', chat)
}

onMounted(() => {
  fetchChatList()
})
</script>

<style scoped>
.chat-list {
  height: 100%;
  display: flex;
  flex-direction: column;
  border-right: 1px solid #eee;
}

.list-header {
  padding: 1rem;
  border-bottom: 1px solid #eee;
}

.list-header h2 {
  margin: 0;
  font-size: 1.2rem;
  color: #333;
}

.list-content {
  flex: 1;
  overflow-y: auto;
  padding: 0.5rem;
}

.chat-item {
  display: flex;
  align-items: center;
  padding: 1rem;
  cursor: pointer;
  border-radius: 8px;
  transition: all 0.3s;
}

.chat-item:hover {
  background: #f5f5f5;
}

.chat-item.active {
  background: #e6f7ff;
}

.chat-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: #4a90e2;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 1rem;
}

.chat-avatar i {
  font-size: 24px;
  color: white;
}

.chat-info {
  flex: 1;
  min-width: 0;
}

.chat-name {
  font-weight: 500;
  color: #333;
  margin-bottom: 0.25rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.chat-time {
  font-size: 0.875rem;
  color: #999;
}

.loading {
  text-align: center;
  padding: 2rem;
  color: #666;
}

.empty-state {
  text-align: center;
  padding: 3rem;
  color: #666;
}
</style> 