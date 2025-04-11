<template>
  <div class="profile-container">
    <div class="profile-card">
      <div class="card-header">
        <h2>个人资料</h2>
        <button v-if="!isEditing" class="btn-primary" @click="handleEdit">编辑</button>
        <div v-else class="button-group">
          <button class="btn-primary" @click="handleSave">保存</button>
          <button class="btn-secondary" @click="handleCancel">取消</button>
        </div>
      </div>

      <form class="profile-form" @submit.prevent="handleSave">
        <div class="form-group">
          <label>用户名</label>
          <input v-if="isEditing" v-model="form.username" type="text" />
          <span v-else>{{ userInfo.username }}</span>
        </div>

        <div class="form-group">
          <label>手机号</label>
          <input v-if="isEditing" v-model="form.phone" type="tel" />
          <span v-else>{{ userInfo.phone }}</span>
        </div>

        <div class="form-group">
          <label>邮箱</label>
          <input v-if="isEditing" v-model="form.email" type="email" />
          <span v-else>{{ userInfo.email }}</span>
        </div>

        <div class="form-group">
          <label>个人简介</label>
          <textarea
            v-if="isEditing"
            v-model="form.profile"
            rows="3"
          ></textarea>
          <span v-else>{{ userInfo.profile }}</span>
        </div>

        <div class="form-group">
          <label>主题偏好</label>
          <select v-if="isEditing" v-model="form.theme_preference">
            <option value="light">浅色</option>
            <option value="dark">深色</option>
          </select>
          <span v-else>{{ userInfo.theme_preference === 'dark' ? '深色' : '浅色' }}</span>
        </div>

        <template v-if="userInfo.type === 0">
          <div class="form-group">
            <label>专业特长</label>
            <div v-if="isEditing" class="tags-input">
              <input
                type="text"
                v-model="newExpertise"
                @keydown.enter.prevent="addExpertise"
                placeholder="按回车添加"
              />
              <div class="tags">
                <span v-for="item in form.expertise" :key="item" class="tag">
                  {{ item }}
                  <button type="button" @click="removeExpertise(item)">&times;</button>
                </span>
              </div>
            </div>
            <div v-else class="tags">
              <span v-for="item in userInfo.expertise" :key="item" class="tag">
                {{ item }}
              </span>
            </div>
          </div>
        </template>

        <div class="form-group">
          <label>偏好</label>
          <div v-if="isEditing" class="tags-input">
            <input
              type="text"
              v-model="newPreference"
              @keydown.enter.prevent="addPreference"
              placeholder="按回车添加"
            />
            <div class="tags">
              <span v-for="item in form.preference" :key="item" class="tag">
                {{ item }}
                <button type="button" @click="removePreference(item)">&times;</button>
              </span>
            </div>
          </div>
          <div v-else class="tags">
            <span v-for="item in userInfo.preference" :key="item" class="tag">
              {{ item }}
            </span>
          </div>
        </div>
      </form>

      <div class="password-section">
        <h3>密码管理</h3>
        <button class="btn-primary" @click="showPasswordModal = true">
          修改密码
        </button>
      </div>
    </div>

    <PasswordModal
      v-model:visible="showPasswordModal"
      @submit="handlePasswordChange"
    />
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { getUserProfile, updateUserProfile, updatePassword } from '@/api/user'
import PasswordModal from '@/components/PasswordModal.vue'

const userInfo = ref({})
const isEditing = ref(false)
const showPasswordModal = ref(false)
const newExpertise = ref('')
const newPreference = ref('')

const form = reactive({
  username: '',
  phone: '',
  email: '',
  profile: '',
  theme_preference: 'light',
  expertise: [],
  preference: []
})

const fetchUserInfo = async () => {
  try {
    const { data } = await getUserProfile(82)
    userInfo.value = data
    Object.assign(form, data)
  } catch (error) {
    console.error('获取用户信息失败:', error)
    alert('获取用户信息失败')
  }
}

const handleEdit = () => {
  isEditing.value = true
}

const handleCancel = () => {
  isEditing.value = false
  Object.assign(form, userInfo.value)
}

const handleSave = async () => {
  try {
    await updateUserProfile(82, form)
    alert('保存成功')
    isEditing.value = false
    await fetchUserInfo()
  } catch (error) {
    console.error('保存失败:', error)
    alert('保存失败')
  }
}

const handlePasswordChange = async (passwordData) => {
  try {
    await updatePassword(82, passwordData)
    alert('密码修改成功')
    showPasswordModal.value = false
  } catch (error) {
    console.error('密码修改失败:', error)
    alert('密码修改失败')
  }
}

const addExpertise = () => {
  if (newExpertise.value && !form.expertise.includes(newExpertise.value)) {
    form.expertise.push(newExpertise.value)
    newExpertise.value = ''
  }
}

const removeExpertise = (item) => {
  const index = form.expertise.indexOf(item)
  if (index > -1) {
    form.expertise.splice(index, 1)
  }
}

const addPreference = () => {
  if (newPreference.value && !form.preference.includes(newPreference.value)) {
    form.preference.push(newPreference.value)
    newPreference.value = ''
  }
}

const removePreference = (item) => {
  const index = form.preference.indexOf(item)
  if (index > -1) {
    form.preference.splice(index, 1)
  }
}

onMounted(() => {
  fetchUserInfo()
})
</script>

<style scoped>
.profile-container {
  padding: 20px;
  max-width: 800px;
  margin: 0 auto;
  background: #f8f9fa;
  min-height: 100vh;
}

.profile-card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  padding: 30px;
  transition: all 0.3s ease;
}

.profile-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  padding-bottom: 20px;
  border-bottom: 2px solid #f0f0f0;
}

.card-header h2 {
  margin: 0;
  color: #2c3e50;
  font-size: 24px;
  font-weight: 600;
}

.profile-form {
  margin-bottom: 30px;
}

.form-group {
  margin-bottom: 24px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  color: #2c3e50;
  font-size: 15px;
}

.form-group input,
.form-group select,
.form-group textarea {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 14px;
  transition: all 0.3s ease;
  background: #f8f9fa;
}

.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #4CAF50;
  box-shadow: 0 0 0 3px rgba(76, 175, 80, 0.1);
}

.form-group textarea {
  resize: vertical;
  min-height: 100px;
}

.tags {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.tag {
  background: #e9ecef;
  padding: 6px 12px;
  border-radius: 20px;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
  color: #495057;
  transition: all 0.2s ease;
}

.tag:hover {
  background: #dee2e6;
}

.tag button {
  background: none;
  border: none;
  color: #868e96;
  cursor: pointer;
  padding: 0 4px;
  font-size: 16px;
  transition: all 0.2s ease;
}

.tag button:hover {
  color: #dc3545;
}

.tags-input input {
  margin-bottom: 12px;
}

.button-group {
  display: flex;
  gap: 12px;
}

.btn-primary {
  background: #4CAF50;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.3s ease;
}

.btn-primary:hover {
  background: #43a047;
  transform: translateY(-1px);
}

.btn-secondary {
  background: #6c757d;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.3s ease;
}

.btn-secondary:hover {
  background: #5a6268;
  transform: translateY(-1px);
}

.password-section {
  margin-top: 30px;
  padding-top: 24px;
  border-top: 2px solid #f0f0f0;
}

.password-section h3 {
  margin-bottom: 20px;
  color: #2c3e50;
  font-size: 20px;
  font-weight: 600;
}

@media (max-width: 768px) {
  .profile-container {
    padding: 10px;
  }
  
  .profile-card {
    padding: 20px;
  }
  
  .card-header {
    flex-direction: column;
    gap: 15px;
    text-align: center;
  }
  
  .button-group {
    width: 100%;
    justify-content: center;
  }
}
</style> 