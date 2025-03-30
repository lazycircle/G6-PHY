<template>
  <div class="chat-view">
    <NavbarView />
    <div class="chat-container">
      <!-- 左侧聊天列表 -->
      <ChatList 
        :chats="chatList"
        :activeChat="currentChat"
        @select-chat="selectChat"
      />
      
      <!-- 右侧聊天界面 -->
      <div class="chat-main" v-if="currentChat">
        <ChatHeader :therapist="currentChat.therapist" />
        <ChatMessages 
          :messages="messages"
          :currentUser="currentUser"
          ref="messageList"
        />
        <ChatInput 
          @send-message="sendMessage"
          @send-image="sendImage"
        />
      </div>
      <div class="no-chat-selected" v-else>
        请选择一个聊天会话
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'
import { useAuthStore } from '@/store/auth'
import NavbarView from '@/components/Layout/NavbarView.vue'
import ChatList from '@/components/Chat/ChatList.vue'
import ChatHeader from '@/components/Chat/ChatHeader.vue'
import ChatMessages from '@/components/Chat/ChatMessages.vue'
import ChatInput from '@/components/Chat/ChatInput.vue'
import { initWebSocket, closeWebSocket } from '@/api/chat'

const route = useRoute()
const authStore = useAuthStore()
const currentUser = authStore.currentUser

const chatList = ref([])
const currentChat = ref(null)
const messages = ref([])
const ws = ref(null)

// 初始化WebSocket连接
const initChat = async (therapistId) => {
  try {
    ws.value = await initWebSocket(therapistId)
    
    ws.value.onmessage = (event) => {
      const message = JSON.parse(event.data)
      messages.value.push(message)
      scrollToBottom()
    }
    
    ws.value.onerror = (error) => {
      console.error('WebSocket error:', error)
    }
  } catch (error) {
    console.error('Failed to initialize chat:', error)
  }
}

// 选择聊天
const selectChat = (chat) => {
  currentChat.value = chat
  messages.value = chat.messages || []
  scrollToBottom()
}

// 发送消息
const sendMessage = (content) => {
  if (!ws.value || ws.value.readyState !== WebSocket.OPEN) {
    console.error('WebSocket is not connected')
    return
  }

  const message = {
    type: 'text',
    content,
    senderId: currentUser.id,
    senderName: currentUser.name,
    senderAvatar: currentUser.avatar,
    timestamp: new Date().toISOString()
  }

  ws.value.send(JSON.stringify(message))
  messages.value.push(message)
  scrollToBottom()
}

// 发送图片
const sendImage = async (file) => {
  try {
    const formData = new FormData()
    formData.append('image', file)
    
    // 上传图片到服务器
    const response = await fetch('/api/chat/upload-image', {
      method: 'POST',
      body: formData
    })
    
    const { imageUrl } = await response.json()
    
    // 发送图片消息
    const message = {
      type: 'image',
      content: imageUrl,
      senderId: currentUser.id,
      senderName: currentUser.name,
      senderAvatar: currentUser.avatar,
      timestamp: new Date().toISOString()
    }
    
    ws.value.send(JSON.stringify(message))
    messages.value.push(message)
    scrollToBottom()
  } catch (error) {
    console.error('Failed to send image:', error)
  }
}

// 滚动到底部
const scrollToBottom = () => {
  setTimeout(() => {
    const messageList = document.querySelector('.chat-messages')
    if (messageList) {
      messageList.scrollTop = messageList.scrollHeight
    }
  }, 100)
}

onMounted(async () => {
  const therapistId = route.params.id
  if (therapistId) {
    await initChat(therapistId)
  }
})

onUnmounted(() => {
  if (ws.value) {
    closeWebSocket(ws.value)
  }
})
</script>

<style scoped>
.chat-view {
  height: 100vh;
  background: #f5f5f5;
}

.chat-container {
  display: grid;
  grid-template-columns: 300px 1fr;
  height: calc(100vh - 60px);
  margin-top: 60px;
  background: white;
}

.chat-main {
  display: flex;
  flex-direction: column;
  height: 100%;
  border-left: 1px solid #eee;
}

.no-chat-selected {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: #999;
  font-size: 1.2rem;
}
</style>