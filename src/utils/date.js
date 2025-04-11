export function formatDate(date) {
  const d = new Date(date)
  const now = new Date()
  const diff = (now - d) / 1000 // 转换为秒

  if (diff < 60) {
    return '刚刚'
  } else if (diff < 3600) {
    return Math.floor(diff / 60) + '分钟前'
  } else if (diff < 86400) {
    return Math.floor(diff / 3600) + '小时前'
  } else if (diff < 2592000) {
    return Math.floor(diff / 86400) + '天前'
  } else {
    return d.toLocaleDateString()
  }
} 