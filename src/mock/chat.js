import Mock from 'mockjs'

// 模拟WebSocket消息
Mock.mock('/api/chat/messages', 'post', {
  'code': 200,
  'message': 'success',
  'data': {
    'msg_id': '@integer(1, 1000)',
    'sender_id': '@integer(1, 100)',
    'sender_name': '@cname',
    'send_time': '@datetime',
    'content': '@cparagraph(1, 3)'
  }
})

// 模拟WebSocket连接
export class MockWebSocket {
  constructor(url) {
    this.url = url
    this.onopen = null
    this.onmessage = null
    this.onerror = null
    this.onclose = null
    this.readyState = WebSocket.OPEN
  }

  send(data) {
    console.log('发送消息:', data)
    // 模拟消息发送
    setTimeout(() => {
      if (this.onmessage) {
        const message = {
          type: 'text',
          content: Mock.Random.cparagraph(1, 3),
          senderId: Mock.Random.integer(1, 100),
          senderName: Mock.Random.cname(),
          timestamp: Mock.Random.datetime()
        }
        this.onmessage({ data: JSON.stringify(message) })
      }
    }, 1000)
  }

  close() {
    this.readyState = WebSocket.CLOSED
    if (this.onclose) {
      this.onclose()
    }
  }
} 