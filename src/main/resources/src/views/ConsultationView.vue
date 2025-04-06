<template>
  <div class="consultation-view">
    <NavbarView />
    <div class="content">
      <div class="consultation-header">
        <h1>在线心理咨询</h1>
        <div class="search-bar">
          <input 
            type="text" 
            v-model="searchQuery" 
            placeholder="搜索咨询师或相关问题..."
          >
          <button @click="search">搜索</button>
        </div>
      </div>

      <!-- 推荐咨询师列表 -->
      <div class="consultants-section">
        <h2>推荐咨询师</h2>
        <div class="consultants-grid">
          <ConsultantCard
            v-for="consultant in consultants"
            :key="consultant.id"
            :consultant="consultant"
          />
        </div>
        
        <!-- 分页组件 -->
        <div class="pagination">
          <button 
            :disabled="currentPage === 1"
            @click="changePage(currentPage - 1)"
            class="page-btn"
          >
            上一页
          </button>
          <span class="page-info">{{ currentPage }} / {{ totalPages }}</span>
          <button 
            :disabled="currentPage === totalPages"
            @click="changePage(currentPage + 1)"
            class="page-btn"
          >
            下一页
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import NavbarView from '@/components/Layout/NavbarView.vue'
import ConsultantCard from '@/components/Consultant/ConsultantCard.vue'
import consultantApi from '@/api/consultant'

export default {
  name: 'ConsultationView',
  components: {
    NavbarView,
    ConsultantCard
  },
  setup() {
    const searchQuery = ref('')
    const consultants = ref([])
    const currentPage = ref(1)
    const totalPages = ref(1)
    const pageSize = 6

    const fetchConsultants = async (page) => {
      try {
        const response = await consultantApi.getRecommended(page, pageSize)
        consultants.value = response.data
        // 这里可以根据实际后端返回的数据结构调整总页数的计算方式
        totalPages.value = Math.ceil(response.total || consultants.value.length / pageSize)
      } catch (error) {
        console.error('Failed to fetch consultants:', error)
      }
    }

    const changePage = (page) => {
      currentPage.value = page
      fetchConsultants(page)
    }

    const search = () => {
      // 实现搜索功能
      console.log('Search query:', searchQuery.value)
    }

    onMounted(() => {
      fetchConsultants(1)
    })

    return {
      searchQuery,
      consultants,
      currentPage,
      totalPages,
      search,
      changePage
    }
  }
}
</script>

<style scoped>
.consultation-view {
  min-height: 100vh;
  background: #f5f5f5;
}

.content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1rem;
}

.consultation-header {
  margin-bottom: 2rem;
}

.consultation-header h1 {
  font-size: 2rem;
  color: #333;
  margin-bottom: 1rem;
}

.search-bar {
  display: flex;
  gap: 1rem;
  max-width: 600px;
}

.search-bar input {
  flex: 1;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
}

.search-bar button {
  padding: 0.75rem 2rem;
  background: #4a90e2;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.consultants-section {
  margin-top: 2rem;
}

.consultants-section h2 {
  font-size: 1.5rem;
  color: #333;
  margin-bottom: 1.5rem;
}

.consultants-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
  margin-bottom: 2rem;
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  margin-top: 2rem;
}

.page-btn {
  padding: 0.5rem 1rem;
  background: #4a90e2;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.page-btn:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.page-info {
  color: #666;
}
</style> 