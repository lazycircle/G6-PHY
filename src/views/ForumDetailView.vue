<template>
  <div class="forum-detail">
    <NavbarView />
    <div v-if="forum" class="forum-container">
      <div class="forum-header">
        <h1 class="forum-title">{{ forum.title }}</h1>
        <div class="forum-meta">
          <div class="meta-left">
            <span class="creator-name">
              <i class="fas fa-user"></i>
              {{ forum.creator.username }}
            </span>
            <span class="create-time">
              <i class="fas fa-clock"></i>
              {{ formatDate(forum.create_time) }}
            </span>
          </div>
          <div class="meta-right">
            <span class="update-time">
              <i class="fas fa-history"></i>
              最后回复: {{ formatDate(forum.update_time) }}
            </span>
          </div>
        </div>
        <div class="forum-tags">
          <span v-for="tag in forum.tags" :key="tag" class="tag">
            <i class="fas fa-tag"></i>
            {{ tag }}
          </span>
        </div>
      </div>

      <div class="forum-content">
        <div class="content-text" v-html="formattedContent"></div>
      </div>

      <!-- 评论区 -->
      <ForumCommentSection :forum-id="route.params.id" />
    </div>
    <div v-else class="loading">
      <div class="loading-spinner"></div>
      <span>正在加载帖子内容...</span>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import NavbarView from '@/components/Layout/NavbarView.vue'
import ForumCommentSection from '@/components/Forum/ForumCommentSection.vue'
import { format } from 'date-fns'
import axios from 'axios'

const route = useRoute()
const forum = ref(null)

const formatDate = (dateStr) => {
  try {
    return format(new Date(dateStr), 'yyyy-MM-dd HH:mm')
  } catch (error) {
    return dateStr
  }
}

const formattedContent = computed(() => {
  if (!forum.value) return ''
  return forum.value.content
    .split('\n')
    .map(line => line.trim())
    .join('<br>')
})

const fetchForum = async () => {
  try {
    const forumId = route.params.id
    console.log(forumId)
    const response = await axios.get(`/api/forums/${forumId}`)
    if (response.data) {
      forum.value = response.data.data
    } else {
      throw new Error('帖子未找到')
    }
  } catch (error) {
    console.error('获取帖子失败:', error)
  }
}

onMounted(() => {
  fetchForum()
})
</script>

<style scoped>
.forum-detail {
  min-height: 100vh;
  background: #f5f5f5;
  padding: 2rem 0;
}

.forum-container {
  max-width: 900px;
  margin: 0 auto;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  padding: 2.5rem;
}

.forum-header {
  margin-bottom: 2.5rem;
}

.forum-title {
  font-size: 2.2rem;
  font-weight: 700;
  color: #2c3e50;
  margin-bottom: 1.5rem;
  line-height: 1.4;
}

.forum-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 0;
  border-bottom: 1px solid #eee;
  color: #666;
  font-size: 0.95rem;
}

.meta-left, .meta-right {
  display: flex;
  gap: 1.5rem;
  align-items: center;
}

.creator-name, .create-time, .update-time {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.forum-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.8rem;
  margin-top: 1.5rem;
}

.tag {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.5rem 1rem;
  background: #f0f7ff;
  color: #4a90e2;
  border-radius: 20px;
  font-size: 0.9rem;
  transition: all 0.3s ease;
}

.tag:hover {
  background: #4a90e2;
  color: white;
}

.forum-content {
  font-size: 1.1rem;
  line-height: 1.8;
  color: #2c3e50;
  margin-bottom: 2rem;
}

.content-text {
  white-space: pre-line;
}

.loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem;
  gap: 1rem;
  color: #666;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 3px solid #f3f3f3;
  border-top: 3px solid #4a90e2;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

@media (max-width: 768px) {
  .forum-container {
    margin: 0 1rem;
    padding: 1.5rem;
  }

  .forum-title {
    font-size: 1.8rem;
  }

  .forum-meta {
    flex-direction: column;
    gap: 1rem;
  }

  .meta-left, .meta-right {
    width: 100%;
    justify-content: space-between;
  }
}
</style>


