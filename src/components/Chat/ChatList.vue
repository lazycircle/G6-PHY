<template>
  <div class="chat-list">
    <div class="chat-list-header">
      <h2>咨询会话</h2>
    </div>
    <div class="chat-items">
      <div
        v-for="chat in chats"
        :key="chat.id"
        class="chat-item"
        :class="{ active: activeChat?.id === chat.id }"
        @click="$emit('select-chat', chat)"
      >
        <img :src="chat.therapist.avatar" :alt="chat.therapist.name" class="chat-avatar">
        <div class="chat-info">
          <div class="chat-name">{{ chat.therapist.name }}</div>
          <div class="chat-preview">{{ chat.lastMessage?.content || '暂无消息' }}</div>
        </div>
        <div class="chat-meta">
          <div class="chat-time">{{ formatTime(chat.lastMessage?.timestamp) }}</div>
          <div v-if="chat.unreadCount" class="unread-count">{{ chat.unreadCount }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue'
import { formatTime } from '@/utils/date'

defineProps({
  chats: {
    type: Array,
    default: () => []
  },
  activeChat: {
    type: Object,
    default: null
  }
})

defineEmits(['select-chat'])
</script>

<style scoped>
.chat-list {
  display: flex;
  flex-direction: column;
  height: 100%;
  background: #f8f8f8;
}

.chat-list-header {
  padding: 1rem;
  border-bottom: 1px solid #eee;
}

.chat-list-header h2 {
  margin: 0;
  font-size: 1.2rem;
  color: #333;
}

.chat-items {
  flex: 1;
  overflow-y: auto;
}

.chat-item {
  display: flex;
  align-items: center;
  padding: 1rem;
  cursor: pointer;
  transition: background-color 0.3s;
}

.chat-item:hover {
  background: #f0f0f0;
}

.chat-item.active {
  background: #e6f7ff;
}

.chat-avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  margin-right: 1rem;
}

.chat-info {
  flex: 1;
  min-width: 0;
}

.chat-name {
  font-weight: 500;
  margin-bottom: 0.25rem;
}

.chat-preview {
  color: #666;
  font-size: 0.875rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.chat-meta {
  text-align: right;
  margin-left: 1rem;
}

.chat-time {
  font-size: 0.75rem;
  color: #999;
  margin-bottom: 0.25rem;
}

.unread-count {
  background: #f56c6c;
  color: white;
  font-size: 0.75rem;
  padding: 0.25rem 0.5rem;
  border-radius: 10px;
  display: inline-block;
}
</style> 