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
            @keyup.enter="search"
          >
          <button @click="search">搜索</button>
        </div>
      </div>

      <!-- 咨询师列表 -->
      <div class="consultants-section">
        <h2>咨询师列表</h2>
        <div class="consultants-grid">
          <ConsultantCard
            v-for="consultant in consultants"
            :key="consultant.id"
            :consultant="consultant"
          />
        </div>
        
        <!-- 分页组件 -->
        <div class="pagination" v-if="total > 0">
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

        <!-- 无数据提示 -->
        <div v-if="total === 0" class="no-data">
          暂无符合条件的咨询师
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
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
    const pageSize = ref(10)
    const total = ref(0)

    const totalPages = computed(() => Math.ceil(total.value / pageSize.value))

    const fetchConsultants = async () => {
      try {
        const params = {
          keyword: searchQuery.value || null,
          page: currentPage.value,
          pageSize: pageSize.value
        }
        console.log('hello')
        const response = await consultantApi.getConsultantList(params)
        console.log(response)
        if (response.data) {
          const { list, total: totalCount, page, pageSize: size } = response.data
          consultants.value = list
          total.value = totalCount
          currentPage.value = page
          pageSize.value = size
        }
      } catch (error) {
        console.error('获取咨询师列表失败:', error)
      }
    }

    const changePage = (page) => {
      currentPage.value = page
      fetchConsultants()
    }

    const search = () => {
      currentPage.value = 1 // 搜索时重置页码
      fetchConsultants()
    }

    onMounted(() => {
      fetchConsultants()
    })

    return {
      searchQuery,
      consultants,
      currentPage,
      total,
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
  transition: background-color 0.3s;
}

.search-bar button:hover {
  background: #357abd;
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
  transition: background-color 0.3s;
}

.page-btn:hover:not(:disabled) {
  background: #357abd;
}

.page-btn:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.page-info {
  color: #666;
}

.no-data {
  text-align: center;
  padding: 2rem;
  color: #666;
  font-size: 1.1rem;
}
</style> 