<template>
  <div class="forum-view">
    <NavbarView />
    <div class="content">
      <div class="forum-header">
        <h1>心理健康论坛</h1>
        <button class="new-post-btn" @click="showNewPostForm">发布新帖子</button>
      </div>

      <div class="forum-container">
        <div class="posts-section">
          <div class="posts-filter">
            <button 
              v-for="filter in filters" 
              :key="filter.id"
              :class="['filter-btn', { active: currentFilter === filter.id }]"
              @click="setFilter(filter.id)"
            >
              {{ filter.name }}
            </button>
          </div>

          <div class="posts-list">
            <div v-for="post in filteredPosts" :key="post.id" class="post-card">
              <div class="post-header">
                <img :src="post.authorAvatar" :alt="post.author" class="author-avatar">
                <div class="post-info">
                  <h3>{{ post.title }}</h3>
                  <div class="post-meta">
                    <span>{{ post.author }}</span>
                    <span>{{ post.date }}</span>
                    <span>{{ post.category }}</span>
                  </div>
                </div>
              </div>
              <p class="post-excerpt">{{ post.excerpt }}</p>
              <div class="post-stats">
                <span><i class="fas fa-eye"></i> {{ post.views }}</span>
                <span><i class="fas fa-comment"></i> {{ post.comments }}</span>
                <span><i class="fas fa-heart"></i> {{ post.likes }}</span>
              </div>
            </div>
          </div>
        </div>

        <div class="forum-sidebar">
          <div class="forum-stats">
            <h3>论坛统计</h3>
            <div class="stats-grid">
              <div class="stat-item">
                <div class="stat-value">1,234</div>
                <div class="stat-label">总帖子</div>
              </div>
              <div class="stat-item">
                <div class="stat-value">567</div>
                <div class="stat-label">活跃用户</div>
              </div>
              <div class="stat-item">
                <div class="stat-value">89</div>
                <div class="stat-label">今日新帖</div>
              </div>
            </div>
          </div>

          <div class="hot-topics">
            <h3>热门话题</h3>
            <ul>
              <li v-for="topic in hotTopics" :key="topic.id">
                <a href="#" @click.prevent="viewTopic(topic.id)">
                  {{ topic.title }}
                  <span class="topic-replies">{{ topic.replies }}</span>
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import NavbarView from '@/components/Layout/NavbarView.vue'

export default {
  name: 'ForumView',
  components: {
    NavbarView
  },
  data() {
    return {
      currentFilter: 'latest',
      filters: [
        { id: 'latest', name: '最新发布' },
        { id: 'hot', name: '热门讨论' },
        { id: 'unanswered', name: '等待回复' }
      ],
      posts: [
        {
          id: 1,
          title: '如何克服考试焦虑？',
          author: '小明',
          authorAvatar: '/public/images/avatar1.jpg',
          date: '2024-02-28',
          category: '学习压力',
          excerpt: '最近临近期末考试，感觉压力很大，总是睡不好觉...',
          views: 156,
          comments: 23,
          likes: 45
        },
        // 添加更多帖子...
      ],
      hotTopics: [
        { id: 1, title: '如何应对职场压力？', replies: 56 },
        { id: 2, title: '与父母沟通的技巧', replies: 43 },
        { id: 3, title: '恋爱中的自我成长', replies: 38 },
        { id: 4, title: '走出失恋阴影', replies: 29 },
        { id: 5, title: '考研压力调适', replies: 25 }
      ]
    }
  },
  computed: {
    filteredPosts() {
      // 根据当前筛选条件返回帖子列表
      switch (this.currentFilter) {
        case 'hot':
          return [...this.posts].sort((a, b) => b.views - a.views)
        case 'unanswered':
          return this.posts.filter(post => post.comments === 0)
        default:
          return this.posts
      }
    }
  },
  methods: {
    setFilter(filterId) {
      this.currentFilter = filterId
    },
    showNewPostForm() {
      // 显示发帖表单
    },
    viewTopic(topicId) {
      // 查看话题详情
      this.$router.push(`/forum/topic/${topicId}`)
    }
  }
}
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

.new-post-btn {
  padding: 0.75rem 1.5rem;
  background: #4a90e2;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
}

.forum-container {
  display: grid;
  grid-template-columns: 3fr 1fr;
  gap: 2rem;
}

.posts-filter {
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.filter-btn {
  padding: 0.5rem 1.5rem;
  border: none;
  border-radius: 20px;
  background: #fff;
  color: #666;
  cursor: pointer;
}

.filter-btn.active {
  background: #4a90e2;
  color: white;
}

.post-card {
  background: white;
  border-radius: 8px;
  padding: 1.5rem;
  margin-bottom: 1rem;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.post-header {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
}

.author-avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
}

.post-info h3 {
  margin: 0;
  color: #333;
}

.post-meta {
  display: flex;
  gap: 1rem;
  color: #666;
  font-size: 0.9rem;
  margin-top: 0.5rem;
}

.post-excerpt {
  color: #666;
  line-height: 1.5;
  margin-bottom: 1rem;
}

.post-stats {
  display: flex;
  gap: 2rem;
  color: #666;
  font-size: 0.9rem;
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

.hot-topics {
  margin-top: 2rem;
}

.hot-topics ul {
  list-style: none;
  padding: 0;
}

.hot-topics li {
  margin-bottom: 1rem;
}

.hot-topics a {
  display: flex;
  justify-content: space-between;
  color: #666;
  text-decoration: none;
}

.topic-replies {
  color: #4a90e2;
  font-size: 0.9rem;
}
</style> 