<template>
  <div class="chat-messages" ref="messageContainer">
    <div class="message-list">
      <div
        v-for="message in messages"
        :key="message.id"
        class="message"
        :class="{ 'message-self': message.senderId === currentUser.id }"
      >
        <img :src="message.senderAvatar" :alt="message.senderName" class="message-avatar">
        <div class="message-content">
          <div class="message-sender">{{ message.senderName }}</div>
          <div class="message-bubble">
            <!-- 文本消息 -->
            <template v-if="message.type === 'text'">
              {{ message.content }}
            </template>
            <!-- 图片消息 -->
            <template v-else-if="message.type === 'image'">
              <img 
                :src="message.content" 
                @click="previewImage(message.content)"
                class="message-image"
              >
            </template>
          </div>
          <div class="message-time">{{ formatTime(message.timestamp) }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps, ref, onMounted, watch } from 'vue'
import { formatTime } from '@/utils/date'

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

const scrollToBottom = () => {
  if (messageContainer.value) {
    messageContainer.value.scrollTop = messageContainer.value.scrollHeight
  }
}

const previewImage = (url) => {
  // 实现图片预览功能
  window.open(url, '_blank')
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
}

.message {
  display: flex;
  margin-bottom: 1rem;
}

.message-self {
  flex-direction: row-reverse;
}

.message-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  margin: 0 1rem;
}

.message-content {
  max-width: 60%;
}

.message-sender {
  font-size: 0.875rem;
  color: #999;
  margin-bottom: 0.25rem;
}

.message-bubble {
  background: #f0f0f0;
  padding: 0.75rem;
  border-radius: 4px;
  word-break: break-word;
}

.message-self .message-bubble {
  background: #e6f7ff;
}

.message-image {
  max-width: 100%;
  max-height: 300px;
  border-radius: 4px;
  cursor: pointer;
}

.message-time {
  font-size: 0.75rem;
  color: #999;
  margin-top: 0.25rem;
  text-align: right;
}
</style>