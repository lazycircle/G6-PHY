<template>
  <div class="chat-input">
    <div class="input-toolbar">
      <button class="tool-btn" @click="toggleEmoji">
        <i class="el-icon-emoji"></i>
      </button>
      <button class="tool-btn" @click="toggleAttachment">
        <i class="el-icon-paperclip"></i>
      </button>
    </div>
    <div class="input-area">
      <textarea
        v-model="message"
        placeholder="输入消息..."
        @keydown.enter.prevent="sendMessage"
        @keydown.enter.shift.exact="newLine"
        ref="textarea"
      ></textarea>
    </div>
    <div class="input-actions">
      <button class="send-btn" @click="sendMessage" :disabled="!message.trim()">
        发送
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, defineEmits } from 'vue'

const message = ref('')
const textarea = ref(null)
const emit = defineEmits(['send'])

const sendMessage = () => {
  if (message.value.trim()) {
    emit('send', message.value.trim())
    message.value = ''
  }
}

const newLine = () => {
  message.value += '\n'
}

const toggleEmoji = () => {
  // TODO: 实现表情选择器
}

const toggleAttachment = () => {
  // TODO: 实现附件上传
}
</script>

<style scoped>
.chat-input {
  padding: 1rem;
  background: white;
  border-top: 1px solid #eee;
}

.input-toolbar {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
}

.tool-btn {
  background: none;
  border: none;
  padding: 0.5rem;
  cursor: pointer;
  color: #666;
  transition: color 0.3s;
}

.tool-btn:hover {
  color: #409EFF;
}

.input-area {
  margin-bottom: 0.5rem;
}

textarea {
  width: 100%;
  min-height: 60px;
  max-height: 200px;
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  resize: none;
  font-size: 0.9rem;
  line-height: 1.5;
}

textarea:focus {
  outline: none;
  border-color: #409EFF;
}

.input-actions {
  display: flex;
  justify-content: flex-end;
}

.send-btn {
  padding: 0.5rem 1rem;
  background: #409EFF;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.send-btn:hover {
  background: #66b1ff;
}

.send-btn:disabled {
  background: #c0c4cc;
  cursor: not-allowed;
}
</style> 