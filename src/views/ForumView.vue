<template>
  <div class="forum-view">
    <NavbarView />
    <div class="content">
      <div class="forum-header">
        <h1>心理健康论坛</h1>
        <div class="search-section">
          <div class="search-box">
            <input 
              v-model="searchKeyword" 
              type="text" 
              placeholder="搜索帖子..."
              @focus="showTagsDropdown = true"
              @blur="handleSearchBlur"
            >
            <button class="search-btn" @click="handleSearch">
              <i class="fas fa-search"></i> 搜索
            </button>
          </div>
          <div v-if="showTagsDropdown" class="tags-dropdown">
            <div class="tags-list">
              <div 
                v-for="tag in availableTags" 
                :key="tag"
                :class="['tag-item', { active: selectedTags.includes(tag) }]"
                @click.stop="toggleTag(tag)"
              >
                {{ tag }}
              </div>
            </div>
          </div>
        </div>
        <button class="new-post-btn" @click="showNewPostDialog">发布新帖子</button>
      </div>

      <div class="forum-container">
        <div class="posts-section">
          <div class="selected-tags" v-if="selectedTags.length > 0">
            <div v-for="tag in selectedTags" :key="tag" class="selected-tag">
              {{ tag }}
              <span class="remove-tag" @click="toggleTag(tag)">×</span>
            </div>
          </div>

          <div class="posts-list">
            <div v-for="forum in forums" :key="forum.id" class="post-card" @click="viewForumDetail(forum.id)">
              <div class="post-header">
                <div class="post-info">
                  <h3>{{ forum.title }}</h3>
                  <div class="post-meta">
                    <span class="author">
                      <i class="fas fa-user"></i> {{ forum.creator.username }}
                    </span>
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
          </div>

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

        <div class="forum-sidebar">
          <div class="forum-stats">
            <h3>论坛统计</h3>
            <div class="stats-grid">
              <div class="stat-item">
                <div class="stat-value">{{ total }}</div>
                <div class="stat-label">总帖子</div>
              </div>
              <div class="stat-item">
                <div class="stat-value">{{ Math.floor(total * 0.7) }}</div>
                <div class="stat-label">活跃用户</div>
              </div>
              <div class="stat-item">
                <div class="stat-value">{{ Math.floor(total * 0.1) }}</div>
                <div class="stat-label">今日新帖</div>
              </div>
            </div>
          </div>

          <div class="quick-actions">
            <h3>快捷操作</h3>
            <button class="action-btn" @click="showMyPosts">
              <i class="fas fa-edit"></i> 我的发帖
            </button>
            <button class="action-btn" @click="showJoinedForums">
              <i class="fas fa-users"></i> 我加入的论坛
            </button>
          </div>
        </div>
      </div>
    </div>
    <NewPostDialog 
      v-model="isNewPostDialogVisible"
      @created="handlePostCreated"
    />
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import NavbarView from '@/components/Layout/NavbarView.vue';
import NewPostDialog from '@/components/Forum/NewPostDialog.vue';
import { getForumList } from '@/api/forum';

export default {
  name: 'ForumView',
  components: {
    NavbarView,
    NewPostDialog
  },
  setup() {
    const router = useRouter();
    const forums = ref([]);
    const total = ref(0);
    const currentPage = ref(1);
    const searchKeyword = ref('');
    const showTagsDropdown = ref(false);
    const selectedTags = ref([]);
    const isNewPostDialogVisible = ref(false);

    const availableTags = [
      '焦虑', '就业', '职场', '学习', '压力',
      '恋爱', '家庭', '社交', '抑郁', '升学'
    ];

    const totalPages = computed(() => Math.ceil(total.value / 10));

    const loadForums = async () => {
      try {
        console.log('comes here')
        const response = await getForumList({
          page: currentPage.value,
          keyword: searchKeyword.value,
          tags: selectedTags.value.join(',')
        });
        console.log(123)
        console.log(response)
        forums.value = response.data.forums;
        total.value = response.data.total;
      } catch (error) {
        console.error('加载论坛列表失败:', error);
      }
    };

    const handleSearch = () => {
      currentPage.value = 1;
      loadForums();
      showTagsDropdown.value = false;
    };

    const handleSearchBlur = () => {
      setTimeout(() => {
        showTagsDropdown.value = false;
      }, 200);
    };

    const toggleTag = (tag) => {
      const index = selectedTags.value.indexOf(tag);
      if (index === -1) {
        selectedTags.value.push(tag);
      } else {
        selectedTags.value.splice(index, 1);
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

    const showNewPostDialog = () => {
      isNewPostDialogVisible.value = true;
    };

    const showMyPosts = () => {
      console.log('showMyPosts')
      router.push('/forum/myposts');
    };

    const showJoinedForums = () => {
      router.push('/forum/joined');
    };

    const handlePostCreated = () => {
      // 重新加载论坛列表
      loadForums();
    };

    onMounted(() => {
      loadForums();
    });

    return {
      forums,
      total,
      currentPage,
      totalPages,
      searchKeyword,
      showTagsDropdown,
      selectedTags,
      availableTags,
      handleSearch,
      handleSearchBlur,
      toggleTag,
      changePage,
      formatDate,
      viewForumDetail,
      showNewPostDialog,
      showMyPosts,
      showJoinedForums,
      isNewPostDialogVisible,
      handlePostCreated
    };
  }
};
</script>

<style scoped>
.forum-view {
  min-height: 100vh;
  background: #f5f5f5;
}

.content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1rem;
}

.forum-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.forum-header h1 {
  font-size: 2rem;
  color: #333;
}

.search-section {
  position: relative;
  flex: 1;
  max-width: 500px;
  margin: 0 2rem;
}

.search-box {
  display: flex;
  align-items: center;
  background: white;
  border-radius: 24px;
  padding: 0.5rem 1rem;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  gap: 0.5rem;
}

.search-box input {
  flex: 1;
  border: none;
  outline: none;
  padding: 0.5rem;
  font-size: 1rem;
}

.search-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: #4a90e2;
  color: white;
  border: none;
  border-radius: 16px;
  cursor: pointer;
  padding: 0.5rem 1rem;
  transition: all 0.2s;
}

.search-btn:hover {
  background: #357abd;
}

.search-btn i {
  font-size: 0.9rem;
}

.tags-dropdown {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: white;
  border-radius: 8px;
  margin-top: 0.5rem;
  padding: 1rem;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
  z-index: 1000;
}

.tags-list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.tag-item {
  padding: 0.25rem 0.75rem;
  background: #f0f0f0;
  border-radius: 16px;
  cursor: pointer;
  transition: all 0.2s;
}

.tag-item.active {
  background: #4a90e2;
  color: white;
}

.new-post-btn {
  padding: 0.75rem 1.5rem;
  background: #4a90e2;
  color: white;
  border: none;
  border-radius: 24px;
  cursor: pointer;
  font-size: 1rem;
  transition: all 0.2s;
}

.new-post-btn:hover {
  background: #357abd;
}

.forum-container {
  display: grid;
  grid-template-columns: 3fr 1fr;
  gap: 2rem;
}

.selected-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.selected-tag {
  display: flex;
  align-items: center;
  background: #4a90e2;
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 16px;
  font-size: 0.9rem;
}

.remove-tag {
  margin-left: 0.5rem;
  cursor: pointer;
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

.forum-sidebar {
  background: white;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  margin-top: 1rem;
}

.stat-item {
  text-align: center;
}

.stat-value {
  font-size: 1.5rem;
  font-weight: bold;
  color: #4a90e2;
}

.stat-label {
  color: #666;
  font-size: 0.9rem;
}

.quick-actions {
  margin-top: 2rem;
}

.action-btn {
  display: block;
  width: 100%;
  padding: 0.75rem;
  margin-top: 1rem;
  background: #f0f0f0;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s;
}

.action-btn:hover {
  background: #e0e0e0;
}

.action-btn i {
  margin-right: 0.5rem;
}
</style> 