<template>
  <div class="appointments-view">
    <NavbarView />
    <div class="content">
      <div class="page-header">
        <h1>我的预约</h1>
      </div>

      <div class="appointments-container">
        <div class="appointments-list">
          <div v-if="loading" class="loading">加载中...</div>
          <template v-else>
            <div v-if="schedules.length === 0" class="empty-state">
              暂无预约记录
            </div>
            <div 
              v-for="schedule in schedules" 
              :key="schedule.schedule_id" 
              class="appointment-card"
            >
              <div class="appointment-header">
                <h3>{{ schedule.consultant.username }}</h3>
                <!-- <p>{{ schedule.consultant.profile }}</p> -->
              </div>

              <div class="appointment-details">
                <div class="detail-item">
                  <i class="fas fa-calendar"></i>
                  <span>预约日期：{{ schedule.date }}</span>
                </div>
                <div class="detail-item">
                  <i class="fas fa-clock"></i>
                  <span>预约时间：{{ schedule.time }}</span>
                </div>
                <div class="detail-item" :class="schedule.agree ? 'approved' : 'pending'">
                  <i class="fas fa-check-circle"></i>
                  <span>{{ schedule.agree ? '已审核' : '待审核' }}</span>
                </div>
              </div>

              <div class="appointment-actions">
                <button class="action-btn primary" @click="startConsultation(schedule.schedule_id)">
                  进入咨询
                </button>
                <button class="action-btn danger" @click="cancelAppointment(schedule.schedule_id)">
                  取消预约
                </button>
              </div>
            </div>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import NavbarView from '@/components/Layout/NavbarView.vue'
import scheduleApi from '@/api/schedule'
import consultantApi from '@/api/consultant'
import sessionApi from '@/api/session'

const router = useRouter()
const loading = ref(true)
const schedules = ref([])
//假设用户ID从某个用户状态中获取
let clientId = localStorage.getItem('id')  //有个问题，这个id是字符串，可能是手机号码或者邮箱号，不是integer
//确保clientId 没有多余的引号
clientId = clientId.replace(/^"|"$/g, '');
// const clientId = 111
console.log(clientId)
const fetchSchedules = async () => {
  try {
    const response = await scheduleApi.getSchedules(clientId)
    const scheduleData = response.data

    // 获取每个预约的咨询师详细信息
    for (const schedule of scheduleData) {
      // console.log(schedule.consultant_id)
      const consultantResponse = await consultantApi.getConsultantDetail(schedule.consultant_id)
      schedule.consultant = consultantResponse.data
    }

    schedules.value = scheduleData
  } catch (error) {
    console.error('Failed to fetch schedules:', error)
  } finally {
    loading.value = false
  }
}

const startConsultation = async (scheduleId) => {
  try {
    const clientId = localStorage.getItem('id')
    const schedule = schedules.value.find(s => s.schedule_id === scheduleId)
    const consultantId = schedule.consultant_id

    const response = await sessionApi.createSession(clientId, consultantId, scheduleId)
    if (response.code === 200) {
      // 存储 session_id
      localStorage.setItem('current_session_id', response.data.session_id)
      // 跳转到聊天室
      router.push(`/chat/${response.data.session_id}`)
    }
  } catch (error) {
    console.error('创建会话失败:', error)
    alert('创建会话失败，请稍后重试')
  }
}

const cancelAppointment = async (scheduleId) => {
  try {
    await scheduleApi.cancelSchedule(scheduleId)
    schedules.value = schedules.value.filter(schedule => schedule.schedule_id !== scheduleId)
  } catch (error) {
    console.error('Failed to cancel appointment:', error)
  }
}

onMounted(() => {
  fetchSchedules()
})
</script>

<style scoped>
.appointments-view {
  min-height: 100vh;
  background: #f5f5f5;
}

.content {
  max-width: 1000px;
  margin: 0 auto;
  padding: 2rem 1rem;
}

.page-header {
  margin-bottom: 2rem;
}

.page-header h1 {
  font-size: 1.8rem;
  color: #333;
}

.appointments-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.appointment-card {
  background: white;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.appointment-header {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.appointment-details {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin: 1rem 0;
  padding: 1rem 0;
  border-top: 1px solid #eee;
  border-bottom: 1px solid #eee;
}

.detail-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #666;
}

.detail-item i {
  color: #999;
  width: 16px;
}

.approved {
  color: #52c41a;
}

.pending {
  color: #faad14;
}

.appointment-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 1rem;
}

.action-btn {
  padding: 0.5rem 1.5rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: all 0.3s;
}

.action-btn.primary {
  background: #4a90e2;
  color: white;
}

.action-btn.primary:hover {
  background: #357abd;
}

.action-btn.danger {
  background: #ff4d4f;
  color: white;
}

.action-btn.danger:hover {
  background: #cf1322;
}

.loading {
  text-align: center;
  padding: 2rem;
  color: #666;
}

.empty-state {
  text-align: center;
  padding: 3rem;
  color: #666;
  background: white;
  border-radius: 8px;
}
</style> 