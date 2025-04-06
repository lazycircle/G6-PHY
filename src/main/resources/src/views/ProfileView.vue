<template>
  <div class="profile-view">
    <NavbarView />
    <div class="profile-content">
      <div class="profile-header">
        <h1>个人资料</h1>
        <div class="header-actions">
          <button class="edit-btn" @click="startEdit" v-if="!isEditing">
            <i class="fas fa-edit"></i> 编辑资料
          </button>
          <button class="change-pwd-btn" @click="showPasswordDialog">
            <i class="fas fa-key"></i> 修改密码
          </button>
        </div>
      </div>

      <!-- 基本信息 -->
      <div class="info-section">
        <h2><i class="fas fa-user"></i> 基本信息</h2>
        <div class="info-grid">
          <div class="info-item">
            <label>用户ID</label>
            <span>{{ userInfo.id }}</span>
          </div>
          <div class="info-item">
            <label>昵称</label>
            <span v-if="!isEditing">{{ userInfo.username }}</span>
            <input v-else v-model="editForm.username" type="text" />
          </div>
          <div class="info-item">
            <label>电话</label>
            <span v-if="!isEditing">{{ maskPhone(userInfo.phone) }}</span>
            <input v-else v-model="editForm.phone" type="tel" />
          </div>
          <div class="info-item">
            <label>邮箱</label>
            <span v-if="!isEditing">{{ userInfo.email }}</span>
            <input v-else v-model="editForm.email" type="email" />
          </div>
          <div class="info-item">
            <label>密码</label>
            <span>{{ maskPassword(userInfo.password) }}</span>
          </div>
          <div class="info-item">
            <label>身份</label>
            <span>{{ userInfo.type === 0 ? '咨询师' : '咨询者' }}</span>
          </div>
        </div>
      </div>

      <!-- 个人简介 -->
      <div class="info-section">
        <h2><i class="fas fa-align-left"></i> 个人简介</h2>
        <div v-if="!isEditing" class="profile-text">{{ userInfo.profile }}</div>
        <textarea v-else v-model="editForm.profile" rows="4"></textarea>
      </div>

      <!-- 阅读偏好 -->
      <div class="info-section">
        <h2><i class="fas fa-book"></i> 阅读偏好</h2>
        <div v-if="!isEditing" class="tags-container">
          <span v-for="tag in userInfo.preference" :key="tag" class="tag">{{ tag }}</span>
        </div>
        <div v-else class="tags-edit">
          <div class="selected-tags">
            <span v-for="tag in editForm.preference" :key="tag" class="tag">
              {{ tag }}
              <button class="remove-tag" @click="removePreference(tag)">×</button>
            </span>
          </div>
          <div class="tag-input">
            <input 
              v-model="newPreference" 
              @keyup.enter="addPreference"
              placeholder="输入偏好标签，按回车添加"
            />
            <button @click="addPreference">添加</button>
          </div>
        </div>
      </div>

      <!-- 专长领域（仅咨询师） -->
      <div v-if="userInfo.type === 0" class="info-section">
        <h2><i class="fas fa-star"></i> 专长领域</h2>
        <div v-if="!isEditing" class="tags-container">
          <span v-for="tag in userInfo.expertise" :key="tag" class="tag">{{ tag }}</span>
        </div>
        <div v-else class="tags-edit">
          <div class="selected-tags">
            <span v-for="tag in editForm.expertise" :key="tag" class="tag">
              {{ tag }}
              <button class="remove-tag" @click="removeExpertise(tag)">×</button>
            </span>
          </div>
          <div class="tag-input">
            <input 
              v-model="newExpertise" 
              @keyup.enter="addExpertise"
              placeholder="输入专长标签，按回车添加"
            />
            <button @click="addExpertise">添加</button>
          </div>
        </div>
      </div>

      <!-- 编辑按钮 -->
      <div v-if="isEditing" class="edit-actions">
        <button class="save-btn" @click="saveEdit">
          <i class="fas fa-save"></i> 保存
        </button>
        <button class="cancel-btn" @click="cancelEdit">
          <i class="fas fa-times"></i> 取消
        </button>
      </div>
    </div>

    <!-- 修改密码对话框 -->
    <div v-if="showPasswordModal" class="modal-overlay">
      <div class="modal-content">
        <h2><i class="fas fa-key"></i> 修改密码</h2>
        <div class="password-form">
          <div class="form-group">
            <label>原密码</label>
            <input type="password" v-model="passwordForm.current_password" />
          </div>
          <div class="form-group">
            <label>新密码</label>
            <input type="password" v-model="passwordForm.new_password" />
          </div>
          <div class="form-group">
            <label>确认新密码</label>
            <input type="password" v-model="passwordForm.confirm_password" />
          </div>
          <div class="form-actions">
            <button class="confirm-btn" @click="confirmChangePassword">
              <i class="fas fa-check"></i> 确认
            </button>
            <button class="cancel-btn" @click="closePasswordDialog">
              <i class="fas fa-times"></i> 取消
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import userApi from '@/api/user'
import NavbarView from '@/components/Layout/NavbarView'

const userInfo = ref({
  id: null,
  username: '',
  phone: '',
  email: '',
  password: '',
  type: null,
  profile: '',
  preference: [],
  expertise: []
})

const isEditing = ref(false)
const showPasswordModal = ref(false)
const editForm = ref({})
const newPreference = ref('')
const newExpertise = ref('')
const passwordForm = ref({
  current_password: '',
  new_password: '',
  confirm_password: ''
})

// 获取用户信息
const fetchUserInfo = async () => {
  try {
    const userId = localStorage.getItem('id')
    const response = await userApi.getUserInfo(userId)
    if (response.code === 200) {
      userInfo.value = response.data
    }
  } catch (error) {
    console.error('Error fetching user info:', error)
  }
}

// 开始编辑
const startEdit = () => {
  editForm.value = { ...userInfo.value }
  isEditing.value = true
}

// 取消编辑
const cancelEdit = () => {
  isEditing.value = false
  editForm.value = {}
}

// 保存编辑
const saveEdit = async () => {
  try {
    const userId = localStorage.getItem('id')
    const response = await userApi.updateUserInfo(userId, editForm.value)
    if (response.code === 200) {
      userInfo.value = { ...editForm.value }
      isEditing.value = false
    }
  } catch (error) {
    console.error('Error updating user info:', error)
  }
}

// 显示修改密码对话框
const showPasswordDialog = () => {
  showPasswordModal.value = true
}

// 关闭修改密码对话框
const closePasswordDialog = () => {
  showPasswordModal.value = false
  passwordForm.value = {
    current_password: '',
    new_password: '',
    confirm_password: ''
  }
}

// 确认修改密码
const confirmChangePassword = async () => {
  if (passwordForm.value.new_password !== passwordForm.value.confirm_password) {
    alert('两次输入的新密码不一致')
    return
  }

  try {
    const userId = localStorage.getItem('id')
    const response = await userApi.changePassword(userId, {
      current_password: passwordForm.value.current_password,
      new_password: passwordForm.value.new_password
    })
    if (response.code === 200) {
      closePasswordDialog()
      alert('密码修改成功')
    }
  } catch (error) {
    console.error('Error changing password:', error)
    alert(error.message || '密码修改失败')
  }
}

// 添加偏好标签
const addPreference = () => {
  if (newPreference.value.trim()) {
    if (!editForm.value.preference) {
      editForm.value.preference = []
    }
    editForm.value.preference.push(newPreference.value.trim())
    newPreference.value = ''
  }
}

// 移除偏好标签
const removePreference = (tag) => {
  editForm.value.preference = editForm.value.preference.filter(t => t !== tag)
}

// 添加专长标签
const addExpertise = () => {
  if (newExpertise.value.trim()) {
    if (!editForm.value.expertise) {
      editForm.value.expertise = []
    }
    editForm.value.expertise.push(newExpertise.value.trim())
    newExpertise.value = ''
  }
}

// 移除专长标签
const removeExpertise = (tag) => {
  editForm.value.expertise = editForm.value.expertise.filter(t => t !== tag)
}

// 掩码处理手机号
const maskPhone = (phone) => {
  return phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2')
}

// 掩码处理密码
const maskPassword = (password) => {
  return '*'.repeat(password.length)
}

onMounted(() => {
  fetchUserInfo()
})
</script>

<style scoped>
.profile-view {
  min-height: 100vh;
  background-color: #f5f5f5;
}

.profile-content {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.profile-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
}

.header-actions {
  display: flex;
  gap: 10px;
}

.info-section {
  background: white;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.info-section h2 {
  margin-bottom: 15px;
  color: #4a90e2;
  display: flex;
  align-items: center;
  gap: 8px;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
}

.info-item {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.info-item label {
  font-weight: 500;
  color: #666;
}

.info-item input {
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.profile-text {
  line-height: 1.6;
}

.tags-container {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.tag {
  background: #4a90e2;
  color: white;
  padding: 4px 12px;
  border-radius: 16px;
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 4px;
}

.remove-tag {
  background: none;
  border: none;
  color: white;
  cursor: pointer;
  padding: 0 4px;
}

.tag-input {
  display: flex;
  gap: 8px;
  margin-top: 10px;
}

.tag-input input {
  flex: 1;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.edit-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 20px;
}

button {
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  gap: 8px;
}

.edit-btn, .change-pwd-btn {
  background: #4a90e2;
  color: white;
}

.save-btn {
  background: #4a90e2;
  color: white;
}

.cancel-btn {
  background: #666;
  color: white;
}

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
}

.modal-content {
  background: white;
  padding: 20px;
  border-radius: 8px;
  min-width: 300px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.password-form {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.form-group input {
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 20px;
}

.confirm-btn {
  background: #4a90e2;
  color: white;
}

@media (max-width: 768px) {
  .profile-content {
    padding: 10px;
  }

  .info-grid {
    grid-template-columns: 1fr;
  }

  .header-actions {
    flex-direction: column;
  }
}
</style> 