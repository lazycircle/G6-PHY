<template>
    <div class="posts-view">
      <NavbarView />
      <div class="content">
        <div class="page-header">
          <h1>我加入的论坛</h1>
        </div>
  
        <div class="posts-container">
          <div class="posts-list">
            <div v-if="loading" class="loading">加载中...</div>
            <template v-else>
              <div v-if="forums.length === 0" class="empty-state">
                暂无帖子
              </div>
              <div 
                v-for="forum in forums" 
                :key="forum.id" 
                class="post-card"
                @click="viewForumDetail(forum.id)"
              >
                <div class="post-header">
                  <div class="post-info">
                    <h3>{{ forum.title }}</h3>
                    <div class="post-meta">
                      <span class="time">
                        <i class="fas fa-clock"></i> {{ formatDate(forum.create_time) }}
                      </span>
                      <span class="update-time">
                        <i class="fas fa-history"></i> 最后回复: {{ formatDate(forum.update_time) }}
                      </span>
                    </div>
                  </div>
                </div>
                <p class="post-preview">{{ forum.preview }}</p>
                <div class="post-tags">
                  <span v-for="tag in forum.tags" :key="tag" class="tag">{{ tag }}</span>
                </div>
              </div>
            </template>
  
            <div class="pagination" v-if="total > 0">
              <button 
                :disabled="currentPage === 1"
                @click="changePage(currentPage - 1)"
                class="page-btn"
              >
                上一页
                <i class="fas fa-chevron-left"></i>
              </button>
              <span class="page-info">{{ currentPage }} / {{ totalPages }}</span>
              <button 
                :disabled="currentPage === totalPages"
                @click="changePage(currentPage + 1)"
                class="page-btn"
              >
                下一页
                <i class="fas fa-chevron-right"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import { ref, computed, onMounted } from 'vue';
  import { useRouter } from 'vue-router';
  import NavbarView from '@/components/Layout/NavbarView.vue';
  import { getMyJoinedForums } from '@/api/forum';
  
  export default {
    name: 'MyPostsView',
    components: {
      NavbarView
    },
    setup() {
      const router = useRouter();
      const forums = ref([]);
      const total = ref(0);
      const currentPage = ref(1);
      const loading = ref(false);
  
      const totalPages = computed(() => Math.ceil(total.value / 10));
  
      const loadForums = async () => {
        loading.value = true;
        try {
          const response = await getMyJoinedForums({
            page: currentPage.value
          });
          forums.value = response.data.forums;
          total.value = response.data.total;
        } catch (error) {
          console.error('加载我的帖子失败:', error);
        } finally {
          loading.value = false;
        }
      };
  
      const changePage = (page) => {
        currentPage.value = page;
        loadForums();
      };
  
      const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('zh-CN', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit'
        });
      };
  
      const viewForumDetail = (forumId) => {
        router.push(`/forum/${forumId}`);
      };
  
      onMounted(() => {
        loadForums();
      });
  
      return {
        forums,
        total,
        currentPage,
        totalPages,
        loading,
        changePage,
        formatDate,
        viewForumDetail
      };
    }
  };
  </script>
  
  <style scoped>
  .posts-view {
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
  
  .post-card {
    background: white;
    border-radius: 8px;
    padding: 1.5rem;
    margin-bottom: 1rem;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    cursor: pointer;
    transition: all 0.2s;
  }
  
  .post-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0,0,0,0.1);
  }
  
  .post-info h3 {
    margin: 0;
    color: #333;
    font-size: 1.25rem;
  }
  
  .post-meta {
    display: flex;
    gap: 1rem;
    color: #666;
    font-size: 0.9rem;
    margin-top: 0.5rem;
  }
  
  .post-meta i {
    margin-right: 0.25rem;
  }
  
  .post-preview {
    color: #666;
    line-height: 1.5;
    margin: 1rem 0;
  }
  
  .post-tags {
    display: flex;
    gap: 0.5rem;
  }
  
  .tag {
    padding: 0.25rem 0.75rem;
    background: #f0f0f0;
    border-radius: 16px;
    font-size: 0.9rem;
    color: #666;
  }
  
  .pagination {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 2rem;
    gap: 1rem;
  }
  
  .page-btn {
    padding: 0.5rem 1rem;
    border: none;
    background: white;
    border-radius: 4px;
    cursor: pointer;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  }
  
  .page-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  
  .page-info {
    font-size: 1rem;
    color: #666;
  }
  </style> 