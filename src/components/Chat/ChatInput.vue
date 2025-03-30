<template>
  <div class="chat-input">
    <div class="toolbar">
      <div class="tool-item">
        <input
          type="file"
          ref="imageInput"
          accept="image/*"
          style="display: none"
          @change="handleImageUpload"
        >
        <button class="tool-btn" @click="triggerImageUpload">
          <i class="fas fa-image"></i>
        </button>
      </div>
    </div>
    <div class="input-area">
      <textarea
        v-model="message"
        placeholder="输入消息..."
        @keydown.enter.prevent="sendMessage"
      ></textarea>
      <button 
        class="send-btn"
        :disabled="!message.trim()"
        @click="sendMessage"
      >
        发送
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, defineEmits } from 'vue'

const message = ref('')
const imageInput = ref(null)

const emit = defineEmits(['send-message', 'send-image'])

const sendMessage = () => {
  if (message.value.trim()) {
    emit('send-message', message.value)
    message.value = ''
  }
}

const triggerImageUpload = () => {
  imageInput.value.click()
}

const handleImageUpload = (event) => {
  const file = event.target.files[0]
  if (file) {
    emit('send-image', file)
  }
  // 清除选择的文件，允许重复选择同一文件
  event.target.value = ''
}
</script>

<style scoped>
.chat-input {
  border-top: 1px solid #eee;
  padding: 1rem;
}

.toolbar {
  margin-bottom: 0.5rem;
}

.tool-btn {
  background: none;
  border: none;
  padding: 0.5rem;
  cursor: pointer;
  color: #666;
}

.tool-btn:hover {
  color: #4a90e2;
}

.input-area {
  display: flex;
  gap: 1rem;
}

textarea {
  flex: 1;
  height: 80px;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  resize: none;
  font-size: 1rem;
}

.send-btn {
  padding: 0 1.5rem;
  background: #4a90e2;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.send-btn:disabled {
  background: #ccc;
  cursor: not-allowed;
}
</style> 