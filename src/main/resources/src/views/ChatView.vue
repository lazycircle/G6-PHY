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
        <ChatHeader 
          :username="currentChat.username[0]"
          @end-chat="endChat"
        />
        <ChatMessages 
          :messages="messages"
          :currentUser="currentUser"
          ref="messageList"
        />
        <ChatInput 
          @send-message="handleSendMessage"
        />
      </div>
      <div class="no-chat-selected" v-else>
        请选择一个会话
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/store/auth'
import NavbarView from '@/components/Layout/NavbarView.vue'
import ChatList from '@/components/Chat/ChatList.vue'
import ChatHeader from '@/components/Chat/ChatHeader.vue'
import ChatMessages from '@/components/Chat/ChatMessages.vue'
import ChatInput from '@/components/Chat/ChatInput.vue'
import { initWebSocket, sendMessage, onMessage, closeWebSocket } from '@/api/websocket'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()
const currentUser = authStore.currentUser

const chatList = ref([])
const currentChat = ref(null)
const messages = ref([])

// 初始化 WebSocket 连接
const initChat = async (sessionId) => {
  try {
    if (!sessionId) {
      throw new Error('会话ID不能为空')
    }
    
    console.log('正在初始化WebSocket连接，会话ID:', sessionId)
    await initWebSocket(sessionId)
    
    // 注册消息处理器
    onMessage('text', (message) => {
      console.log('收到新消息:', message)
      messages.value.push(message)
      scrollToBottom()
    })
  } catch (error) {
    console.error('WebSocket初始化失败:', error)
    // 显示错误提示
    alert('聊天连接失败，请刷新页面重试')
  }
}

// 选择聊天
const selectChat = (chat) => {
  currentChat.value = chat
  messages.value = [] // 清空消息列表
  initChat(chat.session_id)
}

// 发送消息
const handleSendMessage = (content) => {
  if (!content.trim()) return

  const message = {
    type: 'text',
    content: content.trim(),
    senderId: currentUser.id,
    senderName: currentUser.name,
    timestamp: new Date().toISOString()
  }

  sendMessage(message)
  messages.value.push(message)
  scrollToBottom()
}

// 结束聊天
const endChat = () => {
  closeWebSocket()
  currentChat.value = null
  messages.value = []
  router.push('/appointments')
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
  const sessionId = route.params.id
  if (sessionId) {
    const chat = chatList.value.find(c => c.session_id === sessionId)
    if (chat) {
      selectChat(chat)
    }
  }
})

onUnmounted(() => {
  closeWebSocket()
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