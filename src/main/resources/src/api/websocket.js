// WebSocket 连接管理
class WebSocketManager {
  constructor() {
    this.ws = null
    this.reconnectAttempts = 0
    this.maxReconnectAttempts = 5
    this.reconnectDelay = 3000
    this.messageHandlers = new Map()
  }

  // 初始化 WebSocket 连接
  initWebSocket(sessionId) {
    return new Promise((resolve, reject) => {
      try {
        // 根据环境使用不同的 WebSocket URL
        const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:'
        const wsUrl = `${protocol}//${window.location.host}/ws/chat/${sessionId}`
        console.log('正在连接到WebSocket服务器:', wsUrl)
        
        this.ws = new WebSocket(wsUrl)

        // 连接建立时的处理
        this.ws.onopen = () => {
          console.log('WebSocket 连接已建立')
          this.reconnectAttempts = 0
          resolve(this.ws)
        }

        // 接收消息的处理
        this.ws.onmessage = (event) => {
          try {
            const message = JSON.parse(event.data)
            // 根据消息类型调用对应的处理函数
            const handler = this.messageHandlers.get(message.type)
            if (handler) {
              handler(message)
            }
          } catch (error) {
            console.error('消息解析错误:', error)
          }
        }

        // 连接关闭时的处理
        this.ws.onclose = () => {
          console.log('WebSocket 连接已关闭')
          this.handleReconnect()
        }

        // 发生错误时的处理
        this.ws.onerror = (error) => {
          console.error('WebSocket 错误:', error)
          reject(error)
        }
      } catch (error) {
        console.error('WebSocket 初始化失败:', error)
        reject(error)
      }
    })
  }

  // 重连机制
  handleReconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++
      console.log(`尝试重新连接 (${this.reconnectAttempts}/${this.maxReconnectAttempts})`)
      setTimeout(() => {
        this.initWebSocket(this.ws.url.split('/').pop())
      }, this.reconnectDelay)
    } else {
      console.error('WebSocket 重连失败，已达到最大重试次数')
    }
  }

  // 发送消息
  sendMessage(message) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(message))
    } else {
      console.error('WebSocket 未连接')
    }
  }

  // 注册消息处理器
  on(type, handler) {
    this.messageHandlers.set(type, handler)
  }

  // 关闭连接
  close() {
    if (this.ws) {
      this.ws.close()
      this.ws = null
    }
  }
}

// 创建单例实例
const wsManager = new WebSocketManager()

// 导出 WebSocket 相关方法
export const initWebSocket = (sessionId) => wsManager.initWebSocket(sessionId)
export const sendMessage = (message) => wsManager.sendMessage(message)
export const onMessage = (type, handler) => wsManager.on(type, handler)
export const closeWebSocket = () => wsManager.close()

export default {
  initWebSocket,
  sendMessage,
  onMessage,
  closeWebSocket
} 