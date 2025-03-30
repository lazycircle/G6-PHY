<template>
  <div class="posts-view">
    <NavbarView />
    <div class="content">
      <div class="page-header">
        <h1>我的帖子</h1>
        <button class="new-post-btn" @click="createNewPost">
          <i class="fas fa-plus"></i> 发布新帖子
        </button>
      </div>

      <div class="posts-container">
        <!-- 帖子类型筛选 -->
        <div class="filter-tabs">
          <button 
            v-for="tab in tabs" 
            :key="tab.value"
            :class="['tab-btn', { active: currentTab === tab.value }]"
            @click="currentTab = tab.value"
          >
            {{ tab.label }}
          </button>
        </div>

        <!-- 帖子列表 -->
        <div class="posts-list">
          <div v-if="loading" class="loading">加载中...</div>
          <template v-else>
            <div v-if="filteredPosts.length === 0" class="empty-state">
              暂无帖子
            </div>
            <div 
              v-for="post in filteredPosts" 
              :key="post.id" 
              class="post-card"
            >
              <div class="post-header">
                <h3 @click="viewPost(post.id)">{{ post.title }}</h3>
                <div class="post-meta">
                  <span><i class="fas fa-clock"></i> {{ post.createdAt }}</span>
                  <span><i class="fas fa-eye"></i> {{ post.viewCount }}浏览</span>
                  <span><i class="fas fa-comment"></i> {{ post.commentCount }}回复</span>
                  <span><i class="fas fa-heart"></i> {{ post.likeCount }}点赞</span>
                </div>
              </div>

              <p class="post-content">{{ post.content }}</p>

              <div class="post-actions">
                <button class="action-btn edit" @click="editPost(post.id)">
                  <i class="fas fa-edit"></i> 编辑
                </button>
                <button class="action-btn delete" @click="deletePost(post.id)">
                  <i class="fas fa-trash"></i> 删除
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
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import NavbarView from '@/components/Layout/NavbarView.vue'

const router = useRouter()
const loading = ref(false)
const currentTab = ref('all')

const tabs = [
  { label: '全部', value: 'all' },
  { label: '提问', value: 'question' },
  { label: '分享', value: 'share' },
  { label: '讨论', value: 'discussion' }
]

const posts = ref([
  {
    id: 1,
    title: '如何克服社交焦虑？',
    content: '最近感觉很难与人交往，总是担心别人的看法...',
    type: 'question',
    createdAt: '2024-02-28 14:30',
    viewCount: 156,
    commentCount: 23,
    likeCount: 45
  },
  // 可以添加更多模拟数据
])

const filteredPosts = computed(() => {
  if (currentTab.value === 'all') {
    return posts.value
  }
  return posts.value.filter(post => post.type === currentTab.value)
})

const createNewPost = () => {
  router.push('/forum/create')
}

const viewPost = (postId) => {
  router.push(`/forum/post/${postId}`)
}

const editPost = (postId) => {
  router.push(`/forum/edit/${postId}`)
}

// const deletePost = async (postId) => {
//   if (confirm('确定要删除这个帖子吗？')) {
//     // 实现删除帖子的逻辑
//   }
// }
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
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.page-header h1 {
  font-size: 1.8rem;
  color: #333;
}

.new-post-btn {
  padding: 0.75rem 1.5rem;
  background: #4a90e2;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: background-color 0.3s;
}

.new-post-btn:hover {
  background: #357abd;
}

.filter-tabs {
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
}

.tab-btn {
  padding: 0.5rem 1.5rem;
  border: none;
  border-radius: 20px;
  background: #fff;
  color: #666;
  cursor: pointer;
  transition: all 0.3s;
}

.tab-btn.active {
  background: #4a90e2;
  color: white;
}

.posts-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.post-card {
  background: white;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.post-header h3 {
  margin: 0;
  color: #333;
  cursor: pointer;
}

.post-header h3:hover {
  color: #4a90e2;
}

.post-meta {
  display: flex;
  gap: 1rem;
  margin-top: 0.5rem;
  color: #666;
  font-size: 0.9rem;
}

.post-meta i {
  margin-right: 0.25rem;
}

.post-content {
  margin: 1rem 0;
  color: #666;
  line-height: 1.6;
}

.post-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 1rem;
}

.action-btn {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.3s;
}

.action-btn.edit {
  background: #fff;
  border: 1px solid #4a90e2;
  color: #4a90e2;
}

.action-btn.edit:hover {
  background: #f0f5ff;
}

.action-btn.delete {
  background: #fff;
  border: 1px solid #ff4d4f;
  color: #ff4d4f;
}

.action-btn.delete:hover {
  background: #fff1f0;
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