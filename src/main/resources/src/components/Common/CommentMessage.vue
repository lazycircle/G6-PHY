<template>
  <transition name="message-fade">
    <div v-if="visible" :class="['message', type]">
      {{ content }}
    </div>
  </transition>
</template>

<script setup>
import { ref, defineExpose } from 'vue'

const visible = ref(false)
const content = ref('')
const type = ref('info')

// 显示消息
const show = (text, messageType = 'info', duration = 3000) => {
  content.value = text
  type.value = messageType
  visible.value = true
  setTimeout(() => {
    visible.value = false
  }, duration)
}

// 暴露方法给父组件
defineExpose({
  show
})
</script>

<style scoped>
.message {
  position: fixed;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  padding: 10px 20px;
  border-radius: 4px;
  font-size: 14px;
  z-index: 9999;
  transition: all 0.3s;
  color: #fff;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.info {
  background-color: #4a90e2;
}

.success {
  background-color: #52c41a;
}

.warning {
  background-color: #faad14;
}

.error {
  background-color: #ff4d4f;
}

.message-fade-enter-active,
.message-fade-leave-active {
  transition: opacity 0.3s, transform 0.3s;
}

.message-fade-enter-from,
.message-fade-leave-to {
  opacity: 0;
  transform: translate(-50%, -20px);
}
</style> 