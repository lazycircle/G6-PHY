<template>
  <div v-if="visible" class="modal-overlay">
    <div class="modal-content">
      <h3>修改密码</h3>
      <form @submit.prevent="handleSubmit">
        <div class="form-group">
          <label>当前密码:</label>
          <input 
            type="password" 
            v-model="form.currentPassword" 
            required
          />
        </div>
        <div class="form-group">
          <label>新密码:</label>
          <input 
            type="password" 
            v-model="form.newPassword"
            required
            minlength="6"
          />
        </div>
        <div class="form-group">
          <label>确认新密码:</label>
          <input 
            type="password" 
            v-model="form.confirmPassword"
            required
          />
        </div>
        <div class="error" v-if="error">{{ error }}</div>
        <div class="button-group">
          <button type="submit" class="btn-primary">确认</button>
          <button type="button" class="btn-secondary" @click="handleClose">取消</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, defineEmits, defineProps } from 'vue'

defineProps({
  visible: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:visible', 'submit'])

const error = ref('')
const form = reactive({
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
})

const handleSubmit = () => {
  if (form.newPassword !== form.confirmPassword) {
    error.value = '两次输入的密码不一致'
    return
  }
  
  emit('submit', {
    current_password: form.currentPassword,
    new_password: form.newPassword
  })
  resetForm()
}

const handleClose = () => {
  emit('update:visible', false)
  resetForm()
}

const resetForm = () => {
  form.currentPassword = ''
  form.newPassword = ''
  form.confirmPassword = ''
  error.value = ''
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  padding: 20px;
  border-radius: 8px;
  width: 400px;
}

.form-group {
  margin-bottom: 15px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
}

.form-group input {
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.button-group {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 20px;
}

.btn-primary {
  background: #4CAF50;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
}

.btn-secondary {
  background: #9e9e9e;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
}

.error {
  color: red;
  margin-top: 10px;
}
</style> 