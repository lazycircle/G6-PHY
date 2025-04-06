<template>
  <div class="chat-messages" ref="messageContainer">
    <div v-if="messages.length === 0" class="empty-messages">
      暂无消息记录
    </div>
    <div 
      v-else
      v-for="message in messages" 
      :key="message.id"
      class="message-item"
      :class="{ 'message-self': message.senderId === currentUser.id }"
    >
      <div class="message-avatar">
        <i class="fas fa-user-circle"></i>
      </div>
      <div class="message-content">
        <div class="message-bubble">
          {{ message.content }}
        </div>
        <div class="message-time">
          {{ formatTime(message.timestamp) }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, defineProps } from 'vue'

const props = defineProps({
  messages: {
    type: Array,
    default: () => []
  },
  currentUser: {
    type: Object,
    required: true
  }
})

const messageContainer = ref(null)

const formatTime = (timestamp) => {
  const date = new Date(timestamp)
  return date.toLocaleString('zh-CN', {
    hour: '2-digit',
    minute: '2-digit'
  })
}

const scrollToBottom = () => {
  if (messageContainer.value) {
    messageContainer.value.scrollTop = messageContainer.value.scrollHeight
  }
}

watch(() => props.messages.length, () => {
  scrollToBottom()
})

onMounted(() => {
  scrollToBottom()
})
</script>

<style scoped>
.chat-messages {
  flex: 1;
  overflow-y: auto;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.empty-messages {
  text-align: center;
  color: #999;
  padding: 2rem;
}

.message-item {
  display: flex;
  gap: 0.5rem;
  align-items: flex-start;
}

.message-item.message-self {
  flex-direction: row-reverse;
}

.message-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: #4a90e2;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.message-avatar i {
  font-size: 20px;
  color: white;
}

.message-content {
  max-width: 70%;
}

.message-bubble {
  padding: 0.75rem 1rem;
  border-radius: 8px;
  background: #f0f2f5;
  color: #333;
  word-break: break-word;
}

.message-self .message-bubble {
  background: #4a90e2;
  color: white;
}

.message-time {
  font-size: 0.75rem;
  color: #999;
  margin-top: 0.25rem;
  text-align: right;
}

.message-self .message-time {
  text-align: right;
}
</style>