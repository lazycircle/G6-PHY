import axios from 'axios'  

export const ChatApi = {  
  async getMessages(receiverId) {  
    try {  
      const response = await axios.get(`http://localhost:8081/api/chat/messages/${receiverId}`)  
      return response.data  
    } catch (error) {  
      console.error('获取消息失败:', error)  
      throw error  
    }  
  },  

  async TypingIndicator(typing) {  
    try {  
      await axios.post('http://localhost:8081/api/chat/typing', typing)  
    } catch (error) {  
      console.error('发送打字状态失败:', error)  
      throw error  
    }  
  },  

  async readMessages(receiverId) {  
    try {  
      await axios.post(`http://localhost:8081/api/chat/messages/${receiverId}/read`)  
    } catch (error) {  
      console.error('标记消息为已读失败:', error)  
      throw error  
    }  
  }  
}  

// WebSocket连接管理
let ws = null
let messageHandlers = []

// 初始化WebSocket连接
export function initWebSocket() {
  return new Promise((resolve, reject) => {
    if (ws) {
      ws.close()
    }

    // 修改为您的后端地址
    const tokenId = localStorage.getItem('token')
    ws = new WebSocket(`ws://localhost:8888/${tokenId}`)

    ws.onopen = () => {
      console.log('WebSocket连接已建立')
      resolve(ws)
    }

    ws.onmessage = (event) => {
      const message = JSON.parse(event.data)
      messageHandlers.forEach(handler => handler(message))
    }

    ws.onerror = (error) => {
      console.error('WebSocket错误:', error)
      reject(error)
    }

    ws.onclose = () => {
      console.log('WebSocket连接已关闭')
    }
  })
}

// 发送消息
export function sendMessage(message) {
  if (ws && ws.readyState === WebSocket.OPEN) {
    ws.send(JSON.stringify(message))
  } else {
    console.error('WebSocket未连接')
  }
}

// 添加消息处理器
export function addMessageHandler(handler) {
  messageHandlers.push(handler)
}

// 移除消息处理器
export function removeMessageHandler(handler) {
  messageHandlers = messageHandlers.filter(h => h !== handler)
}

// 关闭WebSocket连接
export function closeWebSocket() {
  if (ws) {
    ws.close()
    ws = null
  }
  messageHandlers = []
}

// 获取聊天历史记录
export const getChatHistory = async (therapistId) => {
  try {
    const response = await fetch(`/api/chat/history/${therapistId}`)
    return await response.json()
  } catch (error) {
    console.error('Failed to fetch chat history:', error)
    return []
  }
}

// 上传图片
export const uploadImage = async (file) => {
  try {
    const formData = new FormData()
    formData.append('image', file)
    
    const response = await fetch('/api/chat/upload-image', {
      method: 'POST',
      body: formData
    })
    
    return await response.json()
  } catch (error) {
    console.error('Failed to upload image:', error)
    throw error
  }
}  