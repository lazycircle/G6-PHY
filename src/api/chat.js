import axios from 'axios'  

// WebSocket 连接URL
const WS_URL = process.env.VUE_APP_WS_URL || 'ws://localhost:8080/ws/chat'

export const ChatApi = {  
  async getMessages(receiverId) {  
    try {  
      const response = await axios.get(`http://localhost:8080/api/chat/messages/${receiverId}`)  
      return response.data  
    } catch (error) {  
      console.error('获取消息失败:', error)  
      throw error  
    }  
  },  

  async TypingIndicator(typing) {  
    try {  
      await axios.post('http://localhost:8080/api/chat/typing', typing)  
    } catch (error) {  
      console.error('发送打字状态失败:', error)  
      throw error  
    }  
  },  

  async readMessages(receiverId) {  
    try {  
      await axios.post(`http://localhost:8080/api/chat/messages/${receiverId}/read`)  
    } catch (error) {  
      console.error('标记消息为已读失败:', error)  
      throw error  
    }  
  }  
}  

// 初始化WebSocket连接
export const initWebSocket = (therapistId) => {
  return new Promise((resolve, reject) => {
    const token = localStorage.getItem('token')
    const ws = new WebSocket(`${WS_URL}/${therapistId}?token=${token}`)
    
    ws.onopen = () => {
      console.log('WebSocket connected')
      resolve(ws)
    }
    
    ws.onerror = (error) => {
      console.error('WebSocket connection failed:', error)
      reject(error)
    }
  })
}

// 关闭WebSocket连接
export const closeWebSocket = (ws) => {
  if (ws && ws.readyState === WebSocket.OPEN) {
    ws.close()
  }
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