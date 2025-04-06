<template>
  <div v-if="dialogVisible" class="dialog-overlay">
    <div class="dialog-content">
      <div class="dialog-header">
        <h2>预约咨询</h2>
        <button class="close-btn" @click="handleClose">×</button>
      </div>
      
      <div class="schedule-container">
        <!-- 左侧日期选择 -->
        <div class="date-selection">
          <h3>选择日期</h3>
          <div class="calendar-wrapper">
            <div class="calendar-header">
              <span class="current-date">{{ formatDateHeader(selectedDate) }}</span>
            </div>
            <div class="calendar-body">
              <div class="days">
                <div
                  v-for="date in availableDates"
                  :key="date"
                  class="day-cell"
                  :class="{
                    'selected': isSelected(date),
                    'disabled': isDateDisabled(date)
                  }"
                  @click="selectDate(date)"
                >
                  {{ formatDay(date) }}
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 右侧时间段选择 -->
        <div class="time-selection">
          <h3>选择时间段</h3>
          <div class="time-slots">
            <div
              v-for="time in availableTimes"
              :key="time"
              class="time-slot"
              :class="{ 'selected': selectedTime === time }"
              @click="selectedTime = time"
            >
              <span class="time">{{ time }} - {{ getEndTime(time) }}</span>
              <span v-if="selectedTime === time" class="check-icon">✓</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 底部信息确认 -->
      <div class="confirmation-section">
        <div class="selected-info">
          <template v-if="selectedDate && selectedTime">
            <p>预约日期：{{ formatDate(selectedDate) }}</p>
            <p>预约时间：{{ selectedTime }} - {{ getEndTime(selectedTime) }}</p>
          </template>
          <template v-else>
            <p class="placeholder">请选择预约日期和时间</p>
          </template>
        </div>
        <div class="actions">
          <button class="btn btn-cancel" @click="handleClose">取消</button>
          <button
            class="btn btn-submit"
            :disabled="!selectedDate || !selectedTime"
            @click="handleSubmit"
          >
            提交预约
          </button>
        </div>
      </div>

      <!-- 消息提示 -->
      <div v-if="message.show" :class="['message', message.type]">
        {{ message.text }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, defineProps, defineEmits, computed } from 'vue'
import scheduleApi from '@/api/schedule'
import dayjs from 'dayjs'

const props = defineProps({
  visible: Boolean,
  consultantId: {
    type: [String, Number],
    required: true
  }
})

const emit = defineEmits(['update:visible'])

const dialogVisible = ref(props.visible)
const selectedDate = ref(null)
const selectedTime = ref('')
const availableTimes = ref([])

// 计算可选的日期范围
const availableDates = computed(() => {
  const dates = []
  const today = dayjs()
  for (let i = 0; i < 7; i++) {
    dates.push(today.add(i, 'day'))
  }
  return dates
})

// 格式化日期头部
const formatDateHeader = (date) => {
  if (!date) return dayjs().format('YYYY年MM月')
  return dayjs(date).format('YYYY年MM月')
}

// 格式化日期单元格
const formatDay = (date) => {
  return dayjs(date).format('DD')
}

// 判断日期是否被选中
const isSelected = (date) => {
  return selectedDate.value && dayjs(date).isSame(selectedDate.value, 'day')
}

// 选择日期
const selectDate = (date) => {
  if (!isDateDisabled(date)) {
    selectedDate.value = date
  }
}

// 判断日期是否可选
const isDateDisabled = (date) => {
  const today = dayjs()
  return dayjs(date).isBefore(today, 'day')
}

// 监听visible属性变化
watch(() => props.visible, (val) => {
  dialogVisible.value = val
})

// 监听对话框可见性变化
watch(dialogVisible, (val) => {
  emit('update:visible', val)
  if (!val) {
    // 重置状态
    selectedDate.value = null
    selectedTime.value = ''
    availableTimes.value = []
  }
})

// 监听日期选择
watch(selectedDate, async (newDate) => {
  if (newDate) {
    try {
      const formattedDate = dayjs(newDate).format('YYYY-MM-DD')
      console.log(props.consultantId,formattedDate)
      const response = await scheduleApi.getAvailableTimes(props.consultantId, formattedDate)
      availableTimes.value = response.data
      console.log(availableTimes.value)
      selectedTime.value = ''
    } catch (error) {
      console.error('获取可用时间失败')
    }
  }
})

// 格式化日期
const formatDate = (date) => {
  return dayjs(date).format('YYYY年MM月DD日')
}

// 计算结束时间
const getEndTime = (time) => {
  const [hours, minutes] = time.split(':')
  const endTime = dayjs().set('hour', Number(hours))
                        .set('minute', Number(minutes))
                        .add(30, 'minute')
  return endTime.format('HH:mm')
}

// 处理关闭
const handleClose = () => {
  dialogVisible.value = false
}

// 添加消息提示状态
const message = ref({ show: false, text: '', type: '' })

// 显示消息提示
const showMessage = (text, type = 'success') => {
  message.value = { show: true, text, type }
  setTimeout(() => {
    message.value.show = false
  }, 3000)
}

// 修改提交处理函数
const handleSubmit = async () => {
  try {
    const clientId = localStorage.getItem('id')
    const response = await scheduleApi.createSchedule({
      consultant_id: props.consultantId,
      client_id: clientId,
      date: dayjs(selectedDate.value).format('YYYY-MM-DD'),
      time: selectedTime.value
    })
    
    showMessage(response.message || '预约成功', 'success')
    dialogVisible.value = false
  } catch (error) {
    showMessage(error.response?.data?.message || '预约失败', 'error')
  }
}
</script>

<style scoped>
.dialog-overlay {
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

.dialog-content {
  background: white;
  border-radius: 8px;
  width: 80%;
  max-width: 1000px;
  position: relative;
}

.dialog-header {
  padding: 20px;
  border-bottom: 1px solid #eee;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.close-btn {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #666;
}

.btn {
  padding: 8px 16px;
  border-radius: 4px;
  border: none;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.3s;
}

.btn-cancel {
  background: #f5f5f5;
  color: #666;
}

.btn-submit {
  background: #4a90e2;
  color: white;
}

.btn-submit:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.message {
  position: fixed;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  padding: 10px 20px;
  border-radius: 4px;
  color: white;
  z-index: 1001;
}

.message.success {
  background: #67c23a;
}

.message.error {
  background: #f56c6c;
}

.schedule-container {
  display: flex;
  padding: 20px;
  gap: 40px;
}

.date-selection {
  flex: 1;
  border-right: 1px solid #eee;
  padding-right: 20px;
}

.time-selection {
  flex: 1;
}

.calendar-wrapper {
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.calendar-header {
  padding: 15px;
  text-align: center;
  font-size: 18px;
  font-weight: bold;
  color: #333;
  border-bottom: 1px solid #eee;
}

.calendar-body {
  padding: 15px;
}

.weekdays {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  text-align: center;
  margin-bottom: 10px;
  color: #666;
}

.days {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 5px;
}

.day-cell {
  aspect-ratio: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  border-radius: 4px;
  transition: all 0.3s;
}

.day-cell:hover:not(.disabled) {
  background: #f0f7ff;
  color: #4a90e2;
}

.day-cell.selected {
  background: #4a90e2;
  color: white;
}

.day-cell.disabled {
  color: #ccc;
  cursor: not-allowed;
}

.time-slots {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.time-slot {
  padding: 12px 15px;
  border: 1px solid #eee;
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: all 0.3s;
}

.time-slot:hover {
  background: #f5f7fa;
}

.time-slot.selected {
  background: #f0f7ff;
  border-color: #4a90e2;
  color: #4a90e2;
}

.confirmation-section {
  padding: 20px;
  border-top: 1px solid #eee;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.selected-info {
  flex: 1;
}

.selected-info p {
  margin: 5px 0;
  color: #606266;
}

.placeholder {
  color: #909399;
}

.actions {
  display: flex;
  gap: 10px;
}

h3 {
  margin-bottom: 20px;
  color: #333;
  font-size: 16px;
}
</style> 