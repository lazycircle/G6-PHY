<template>
  <div class="chat-header">
    <div class="header-left">
      <div class="user-avatar">
        <i class="fas fa-user-circle"></i>
      </div>
      <div class="user-info">
        <h3>{{ username }}</h3>
        <span class="status">在线</span>
      </div>
    </div>
    <div class="header-right">
      <button class="action-btn" @click="$emit('end-chat')">
        <i class="fas fa-phone-slash"></i>
        结束咨询
      </button>
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue'

defineProps({
  username: {
    type: String,
    required: true
  }
})

defineEmits(['end-chat'])
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

.header-left {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.user-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: #4a90e2;
  display: flex;
  align-items: center;
  justify-content: center;
}

.user-avatar i {
  font-size: 24px;
  color: white;
}

.user-info h3 {
  margin: 0;
  font-size: 1rem;
  color: #333;
}

.status {
  font-size: 0.875rem;
  color: #52c41a;
}

.action-btn {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  background: #ff4d4f;
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.3s;
}

.action-btn:hover {
  background: #cf1322;
}
</style> 