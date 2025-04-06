<template>
  <div class="consultant-consultation">
    <NavbarView />
    
    <!-- 预约请求区域 -->
    <div class="consultation-requests">
      <h2>咨询者预约请求</h2>
      <div class="requests-list">
        <div v-for="schedule in schedules" :key="schedule.schedule_id" class="request-item">
          <div class="request-info">
            <span class="username">{{ schedule.username }}</span>
            <span class="datetime">{{ schedule.date }} {{ schedule.time }}</span>
          </div>
          
          <div class="request-actions">
            <template v-if="schedule.agree === 0">
              <button 
                class="accept-btn"
                @click="handleRequest(schedule.schedule_id, 1)"
              >
                接受
              </button>
              <button 
                class="reject-btn"
                @click="handleRequest(schedule.schedule_id, 0)"
              >
                拒绝
              </button>
            </template>
            <span v-else class="agreed-tag">已同意</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 我的咨询区域 -->
    <div class="my-consultation">
      <router-link to="/chat" class="chat-link">
        <i class="fas fa-comments"></i>
        我的咨询
      </router-link>
    </div>

    <!-- 求助板区域 -->
<div class="help-board">
  <div class="help-header">
    <h2>求助板</h2>
    <div class="help-search">
      <input 
        type="number" 
        v-model="searchHelpId" 
        placeholder="输入求助ID搜索"
        class="search-input"
      >
      <button @click="searchHelp" class="search-btn">搜索</button>
      <button @click="fetchHelps" class="reset-btn">重置</button>
    </div>
  </div>
  
  <div class="help-list">
    <div v-for="help in helps" :key="help.help_id" class="help-card">
      <div class="help-card-header">
        <span class="consultant-name">{{ help.consultant_name }}</span>
        <span class="help-id">#{{ help.help_id }}</span>
      </div>
      <div class="help-content">
        {{ help.content }}
      </div>
      <div class="help-footer">
        <span class="session-id">会话ID: {{ help.session_id }}</span>
        <button 
          @click="handleAcceptHelp(help.help_id)"
          class="accept-help-btn"
        >
          接受求助
        </button>
      </div>
    </div>
  </div>
</div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
//import { useRouter } from 'vue-router'
import NavbarView from '@/components/Layout/NavbarView.vue'
import consultantScheduleApi from '@/api/consultantSchedule'
import helpApi from '@/api/help'
//const router = useRouter()
const schedules = ref([])
const helps = ref([])
const searchHelpId = ref('')

const fetchHelps = async () => {
  try {
    const response = await helpApi.getHelpList()
    helps.value = response.data
  } catch (error) {
    alert(error.response?.data?.message || '获取求助列表失败')
  }
}

const searchHelp = async () => {
  if (searchHelpId.value) {
    try {
      const response = await helpApi.getHelpById(searchHelpId.value)
      helps.value = response.data
    } catch (error) {
      alert(error.response?.data?.message || '搜索求助失败')
    }
  } else {
    await fetchHelps()
  }
}

const handleAcceptHelp = async (helpId) => {
  try {
    await helpApi.acceptHelp(helpId)
    alert('接受求助成功')
    await fetchHelps()
  } catch (error) {
    alert(error.response?.data?.message || '接受求助失败')
  }
}

// 获取预约请求列表
const fetchSchedules = async () => {
  try {
    const consultantId = localStorage.getItem('id')
    const response = await consultantScheduleApi.getSchedules(consultantId)
    schedules.value = response.data
  } catch (error) {
    alert(error.response?.data?.message || '获取预约请求失败')
  }
}

// 处理预约请求
const handleRequest = async (scheduleId, agree) => {
  try {
    localStorage.setItem('schedule_id', scheduleId)
    await consultantScheduleApi.handleSchedule(scheduleId, agree)
    alert('处理成功')
    // 重新获取列表
    await fetchSchedules()
  } catch (error) {
    alert(error.response?.data?.message || '处理预约请求失败')
  }
}

onMounted(() => {
  fetchSchedules()
  fetchHelps()
})

</script>

<style scoped>
.consultant-consultation {
  min-height: 100vh;
  background: #f5f5f5;
}

.consultation-requests {
  background: white;
  border-radius: 8px;
  padding: 1.5rem;
  margin-bottom: 2rem;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.consultation-requests h2 {
  margin-bottom: 1.5rem;
  color: #333;
}

.request-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  border-bottom: 1px solid #eee;
}

.request-item:last-child {
  border-bottom: none;
}

.request-info {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.username {
  font-weight: bold;
  color: #333;
}

.datetime {
  color: #666;
}

.request-actions {
  display: flex;
  gap: 1rem;
}

.accept-btn, .reject-btn {
  padding: 0.5rem 1rem;
  border-radius: 4px;
  border: none;
  cursor: pointer;
  transition: all 0.3s;
}

.accept-btn {
  background: #4CAF50;
  color: white;
}

.accept-btn:hover {
  background: #45a049;
}

.reject-btn {
  background: #f44336;
  color: white;
}

.reject-btn:hover {
  background: #da190b;
}

.agreed-tag {
  padding: 0.5rem 1rem;
  background: #e8f5e9;
  color: #4CAF50;
  border-radius: 4px;
  font-weight: bold;
}

.my-consultation {
  text-align: center;
  margin: 2rem 0;
}

.chat-link {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem 2rem;
  background: #4a90e2;
  color: white;
  text-decoration: none;
  border-radius: 8px;
  font-size: 1.2rem;
  transition: all 0.3s;
}

.chat-link:hover {
  background: #357abd;
  transform: translateY(-2px);
}

.help-board {
  background: white;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.help-board h2 {
  margin-bottom: 1.5rem;
  color: #333;
}

.help-content {
  color: #666;
  text-align: center;
  padding: 2rem;
}

/* 求助板样式 */
.help-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #eee;
}

.help-search {
  display: flex;
  gap: 0.8rem;
}

.search-input {
  padding: 0.6rem 1rem;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  width: 200px;
  font-size: 14px;
  transition: all 0.3s;
}

.search-input:focus {
  border-color: #4a90e2;
  box-shadow: 0 0 0 2px rgba(74, 144, 226, 0.1);
  outline: none;
}

.search-btn, .reset-btn {
  padding: 0.6rem 1.2rem;
  border: none;
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s;
}

.search-btn {
  background: #4a90e2;
  color: white;
}

.search-btn:hover {
  background: #357abd;
  transform: translateY(-1px);
}

.reset-btn {
  background: #f5f5f5;
  color: #666;
}

.reset-btn:hover {
  background: #e8e8e8;
  transform: translateY(-1px);
}

.help-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
  padding: 0.5rem;
}

.help-card {
  background: white;
  border: 1px solid #eee;
  border-radius: 8px;
  padding: 1.2rem;
  transition: all 0.3s;
  display: flex;
  flex-direction: column;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.help-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  border-color: #4a90e2;
}

.help-card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  padding-bottom: 0.8rem;
  border-bottom: 1px solid #f0f0f0;
}

.consultant-name {
  font-weight: 600;
  color: #333;
  font-size: 1.1rem;
}

.help-id {
  color: #888;
  font-size: 0.9rem;
  background: #f5f7fa;
  padding: 0.3rem 0.6rem;
  border-radius: 12px;
}

.help-content {
  flex: 1;
  color: #444;
  line-height: 1.6;
  margin: 1rem 0;
  padding: 0.5rem;
  background: #f9f9f9;
  border-radius: 4px;
  font-size: 0.95rem;
  min-height: 60px;
}

.help-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 1rem;
  padding-top: 0.8rem;
  border-top: 1px solid #f0f0f0;
}

.session-id {
  color: #666;
  font-size: 0.9rem;
  background: #f5f7fa;
  padding: 0.3rem 0.6rem;
  border-radius: 12px;
}

.accept-help-btn {
  padding: 0.6rem 1.2rem;
  background: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s;
  font-size: 0.9rem;
  font-weight: 500;
}

.accept-help-btn:hover {
  background: #45a049;
  transform: translateY(-1px);
  box-shadow: 0 2px 6px rgba(76, 175, 80, 0.3);
}

.accept-help-btn:active {
  transform: translateY(0);
}
</style>