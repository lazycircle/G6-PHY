<template>
  <div class="consultant-detail-view">
    <NavbarView />
    <div class="content">
      <div class="consultant-info">
        <h2>{{ consultant.username }}</h2>
        <span :class="availabilityClass">
          <span class="status-dot"></span>
          {{ availabilityText }}
        </span>
        <p>{{ consultant.profile }}</p>
        <div class="tags">
          <span v-for="tag in consultant.tags" :key="tag" class="tag">{{ tag }}</span>
        </div>
        <p>评分: {{ consultant.avg_score }}</p>
        <div class="actions">
          <button @click="showScheduleDialog = true">
            预约
          </button>
          <button>立刻咨询</button>
        </div>
      </div>

      <div class="similar-consultants">
        <h3>发现</h3>
        <div class="consultants-grid">
          <ConsultantCard
            v-for="similar in similarConsultants"
            :key="similar.id"
            :consultant="similar"
          />
        </div>
      </div>
    </div>

    <!-- 添加预约对话框组件 -->
    <ScheduleDialog
      v-model:visible="showScheduleDialog"
      :consultant-id="consultantId"
    />
  </div>
</template>

<script>
import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import NavbarView from '@/components/Layout/NavbarView.vue'
import ConsultantCard from '@/components/Consultant/ConsultantCard.vue'
import ScheduleDialog from '@/components/Schedule/ScheduleDialog.vue'
import consultantApi from '@/api/consultant'


export default {
  name: 'ConsultantDetailView',
  components: {
    NavbarView,
    ConsultantCard,
    ScheduleDialog
  },
  setup() {
    const route = useRoute()
    const consultant = ref({})
    const similarConsultants = ref([])
    const isAvailable = ref(true)
    const timeTable = ref([])
    const showScheduleDialog = ref(false)
    const consultantId = route.params.id
    const handleSchedule = async (consultantId) => {
      try {
        const response = await consultantApi.getSpareTime(consultantId)
        timeTable.value = response.data
      } catch (error) {
        console.error('Failed to get spare time:', error)
      }
    }

    const fetchConsultantDetail = async () => {
      try {
        const response = await consultantApi.getConsultantDetail(route.params.id)
        consultant.value = response.data
      } catch (error) {
        console.error('Failed to fetch consultant detail:', error)
      }
    }

    const fetchSimilarConsultants = async () => {
      try {
        const response = await consultantApi.getSimilarConsultants(route.params.id)
        similarConsultants.value = response.data
      } catch (error) {
        console.error('Failed to fetch similar consultants:', error)
      }
    }

    const fetchConsultantAvailability = async () => {
      try {
        const response = await consultantApi.getConsultantAvailability(route.params.id)
        isAvailable.value = response.data.isAvailable
      } catch (error) {
        console.error('Failed to fetch consultant availability:', error)
      }
    }

    onMounted(() => {
      fetchConsultantDetail()
      fetchSimilarConsultants()
      fetchConsultantAvailability()
    })

    const availabilityClass = computed(() => isAvailable.value ? 'available' : 'busy')
    const availabilityText = computed(() => isAvailable.value ? '空闲' : '忙碌')

    return {
      consultant,
      similarConsultants,
      availabilityClass,
      availabilityText,
      handleSchedule,
      showScheduleDialog,
      consultantId,
    }
  }
}
</script>

<style scoped>
.consultant-detail-view {
  min-height: 100vh;
  background: #f5f5f5;
}

.content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1rem;
}

.consultant-info {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  margin-bottom: 2rem;
}

.tags {
  display: flex;
  gap: 0.5rem;
  margin: 1rem 0;
}

.tag {
  background: #f0f7ff;
  color: #4a90e2;
  padding: 4px 12px;
  border-radius: 16px;
  font-size: 0.85rem;
}

.actions {
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
}

.actions button {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  background: #4a90e2;
  color: white;
}

.similar-consultants {
  margin-top: 2rem;
}

.consultants-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
}

.available {
  color: green;
}

.busy {
  color: red;
}

.status-dot {
  display: inline-block;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  margin-right: 4px;
  background-color: currentColor;
}
</style> 