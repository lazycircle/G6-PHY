<template>
  <div class="chat-view">
    <NavbarView />
    <div class="chat-container">
      <!-- 左侧会话列表 -->
      <div class="session-list">
        <div v-for="session in sessions" 
             :key="session.session_id"
             class="session-item"
             :class="{ active: currentSession?.session_id === session.session_id }"
             @click="selectSession(session)">
          <div class="session-info">
            <h3>{{ session.username.join('、') }}</h3>
            <p>结束时间：{{ session.end_time }}</p>
          </div>
        </div>
      </div>

      <!-- 右侧聊天区域 -->
      <div class="chat-area" v-if="currentSession">
        <div class="chat-header">
          <h2>{{ currentSession.username.join('、') }}</h2>
        </div>
        
        <div class="message-list" ref="messageList">
          <div v-for="message in messages" 
               :key="message.msg_id"
               class="message-item"
               :class="{ 'message-self': message.sender_id === selfId }">
            <div class="message-content">
              <div class="message-sender">{{ message.sender_name }}</div>
              <div class="message-text">{{ message.content }}</div>
              <div class="message-time">{{ message.send_time }}</div>
            </div>
          </div>
        </div>

        <div class="message-input">
          <textarea v-model="newMessage" 
                    placeholder="输入消息..."
                    @keyup.enter="handleSendMessage"></textarea>
          <div class="input-actions">
            <button class="send-btn" @click="handleSendMessage">发送</button>
            <button class="end-btn" @click="handleEndSession">结束会话</button>
          </div>
        </div>
      </div>

      <div class="no-session" v-else>
        请选择一个会话
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, nextTick} from 'vue'
import { useRoute, useRouter } from 'vue-router'
import NavbarView from '@/components/Layout/NavbarView.vue'
import sessionApi from '@/api/session'
import { initWebSocket, sendMessage, addMessageHandler, removeMessageHandler, closeWebSocket } from '@/api/chat'

const route = useRoute()
const router = useRouter()
const sessions = ref([])
const currentSession = ref(null)
const messages = ref([])
const newMessage = ref('')
const messageList = ref(null)
const selfId = localStorage.getItem("id")
// 获取会话列表
const fetchSessions = async () => {
  try {
    const userId = localStorage.getItem('id')
    const userType = parseInt(localStorage.getItem('role')) // 直接获取并解析为整数
    
    const response = await sessionApi.getSessions(userId, userType)
      sessions.value = response.data
  } catch (error) {
    console.error('获取会话列表失败:', error)
  }
}

// 选择会话
const selectSession = async (session) => {
  currentSession.value = session
  try {
    const response = await sessionApi.getSessionMessages(session.session_id)
    console.log('获取到的消息数据:', response.data)
    messages.value = response.data
    // 初始化WebSocket连接
    await initWebSocket(session.session_id)
    // 添加消息处理器
    addMessageHandler(handleNewMessage)
  } catch (error) {
    console.error('获取消息历史失败:', error)
  }
}

// 发送消息
const handleSendMessage = async () => {
  if (!newMessage.value.trim()) return;

  const message = {
    type: 'text',
    content: newMessage.value,
    senderId: localStorage.getItem('id'),
    senderName: localStorage.getItem('id'),
    timestamp: new Date().toISOString(),
    to: currentSession.value.session_id
  };

  try {
    // 使用chat.js中的sendMessage函数发送消息
    sendMessage(message);
    messages.value.push({
      msg_id: Date.now(),
      sender_id: localStorage.getItem('id'),
      sender_name: localStorage.getItem('id'),
      send_time: new Date().toLocaleString(),
      content: newMessage.value,
      to : currentSession.value.sessionId
    });
    newMessage.value = '';
    await nextTick();
    scrollToBottom();
  } catch (error) {
    console.error('发送消息失败:', error);
  }
};

// 结束会话
const handleEndSession = async () => {
  if (!currentSession.value) return

  try {
    await sessionApi.endSession(currentSession.value.session_id)
    closeWebSocket()
    router.push('/appointments')
  } catch (error) {
    console.error('结束会话失败:', error)
  }
}

// 滚动到底部
const scrollToBottom = () => {
  if (messageList.value) {
    messageList.value.scrollTop = messageList.value.scrollHeight
  }
}

// 处理新消息
const handleNewMessage = (message) => {
  if (!message.senderId) return

  messages.value.push({
    msg_id: Date.now(),
    sender_id: message.senderId,
    sender_name: message.senderName,
    send_time: new Date().toLocaleString(),
    content: message.content
  })
  scrollToBottom()
}

onMounted(async () => {
  await fetchSessions()
  
  // 如果有session_id参数，自动选择该会话
  const sessionId = route.params.id
  if (sessionId) {
    const session = sessions.value.find(s => s.session_id === sessionId)
    if (session) {
      await selectSession(session)
    }
  }
})

onUnmounted(() => {
  removeMessageHandler(handleNewMessage)
  closeWebSocket()
})
</script>

<style scoped>
.chat-view {
  height: 100vh;
  display: flex;
  flex-direction: column;
}

.chat-container {
  flex: 1;
  display: flex;
  overflow: hidden;
  margin-top: 60px;
}

.session-list {
  width: 300px;
  border-right: 1px solid #eee;
  overflow-y: auto;
}

.session-item {
  padding: 15px;
  cursor: pointer;
  border-bottom: 1px solid #eee;
}

.session-item:hover {
  background-color: #f5f5f5;
}

.session-item.active {
  background-color: #e6f7ff;
}

.session-info h3 {
  margin: 0;
  font-size: 16px;
}

.session-info p {
  margin: 5px 0 0;
  font-size: 12px;
  color: #999;
}

.chat-area {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.chat-header {
  padding: 15px;
  border-bottom: 1px solid #eee;
}

.chat-header h2 {
  margin: 0;
  font-size: 18px;
}

.message-list {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
}

.message-item {
  margin-bottom: 20px;
  display: flex;
}

.message-item.message-self {
  justify-content: flex-end;
}

.message-content {
  max-width: 60%;
  padding: 10px 15px;
  border-radius: 5px;
  background-color: #f0f0f0;
}

.message-self .message-content {
  background-color: #e6f7ff;
}

.message-sender {
  font-size: 12px;
  color: #666;
  margin-bottom: 5px;
}

.message-text {
  word-break: break-word;
}

.message-time {
  font-size: 12px;
  color: #999;
  margin-top: 5px;
  text-align: right;
}

.message-input {
  padding: 15px;
  border-top: 1px solid #eee;
}

.message-input textarea {
  width: 100%;
  height: 80px;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  resize: none;
  margin-bottom: 10px;
}

.input-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

.send-btn, .end-btn {
  padding: 8px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.send-btn {
  background-color: #1890ff;
  color: white;
}

.end-btn {
  background-color: #ff4d4f;
  color: white;
}

.no-session {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #999;
  font-size: 16px;
}
</style>