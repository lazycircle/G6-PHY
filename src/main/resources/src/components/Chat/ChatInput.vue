<template>
  <div class="chat-input">
    <div class="input-wrapper">
      <textarea
        v-model="message"
        placeholder="请输入消息..."
        @keydown.enter.prevent="sendMessage"
        rows="1"
        ref="textarea"
      ></textarea>
      <button class="send-btn" @click="sendMessage">
        <i class="fas fa-paper-plane"></i>
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, defineEmits } from 'vue'

const emit = defineEmits(['send-message'])

const message = ref('')
const textarea = ref(null)

const sendMessage = () => {
  if (message.value.trim()) {
    emit('send-message', message.value.trim())
    message.value = ''
  }
}

// 自动调整文本框高度
watch(message, () => {
  if (textarea.value) {
    textarea.value.style.height = 'auto'
    textarea.value.style.height = textarea.value.scrollHeight + 'px'
  }
})
</script>

<style scoped>
.chat-input {
  padding: 1rem;
  background: white;
  border-top: 1px solid #eee;
}

.input-wrapper {
  display: flex;
  gap: 0.5rem;
  align-items: flex-end;
}

textarea {
  flex: 1;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  resize: none;
  max-height: 120px;
  font-family: inherit;
  font-size: 0.875rem;
  line-height: 1.5;
}

textarea:focus {
  outline: none;
  border-color: #4a90e2;
}

.send-btn {
  width: 40px;
  height: 40px;
  border: none;
  border-radius: 50%;
  background: #4a90e2;
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s;
}

.send-btn:hover {
  background: #357abd;
}

.send-btn i {
  font-size: 1.2rem;
}
</style> 