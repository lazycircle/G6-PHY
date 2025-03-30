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
      <h2>求助板</h2>
      <div class="help-content">
        <!-- 求助板内容将在后续开发 -->
        <p>求助板功能开发中...</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
//import { useRouter } from 'vue-router'
import NavbarView from '@/components/Layout/NavbarView.vue'
import consultantScheduleApi from '@/api/consultantSchedule'

//const router = useRouter()
const schedules = ref([])

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
</style>