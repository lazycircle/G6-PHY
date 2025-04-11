<template>
  <div class="chat-header">
    <div class="chat-info">
      <img :src="chat.therapist.avatar" :alt="chat.therapist.name" class="chat-avatar">
      <div class="chat-details">
        <h3>{{ chat.therapist.name }}</h3>
        <span class="status">{{ chat.therapist.status || '在线' }}</span>
      </div>
    </div>
    <div class="chat-actions">
      <button class="action-btn" @click="$emit('video-call')">
        <i class="el-icon-video-camera"></i>
      </button>
      <button class="action-btn" @click="$emit('voice-call')">
        <i class="el-icon-phone"></i>
      </button>
      <button class="action-btn" @click="$emit('more')">
        <i class="el-icon-more"></i>
      </button>
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue'

defineProps({
  chat: {
    type: Object,
    required: true
  }
})

defineEmits(['video-call', 'voice-call', 'more'])
</script>

<style scoped>
.chat-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem;
  background: white;
  border-bottom: 1px solid #eee;
}

.chat-info {
  display: flex;
  align-items: center;
}

.chat-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  margin-right: 1rem;
  object-fit: cover;
}

.chat-details h3 {
  margin: 0;
  font-size: 1rem;
  color: #333;
}

.status {
  font-size: 0.75rem;
  color: #666;
}

.chat-actions {
  display: flex;
  gap: 0.5rem;
}

.action-btn {
  background: none;
  border: none;
  padding: 0.5rem;
  cursor: pointer;
  color: #666;
  transition: color 0.3s;
}

.action-btn:hover {
  color: #409EFF;
}
</style> 