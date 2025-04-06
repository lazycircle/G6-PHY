<template>
  <div class="article-detail">
    <NavbarView />
    <div v-if="article" class="article-container">
      <div class="article-header">
        <h1 class="article-title">{{ article.title }}</h1>
        <div class="article-meta">
          <div class="meta-left">
            <span class="writer-name">
              <i class="fas fa-user"></i>
              {{ article.writer_name }}
            </span>
            <span class="create-time">
              <i class="fas fa-clock"></i>
              {{ formatDate(article.create_time) }}
            </span>
          </div>
          <div class="meta-right">
            <span class="views">
              <i class="fas fa-eye"></i>
              {{ article.views_count }} 阅读
            </span>
            <span class="likes">
              <i class="fas fa-heart"></i>
              {{ article.liked_count }} 点赞
            </span>
          </div>
        </div>
        <div class="article-tags">
          <span v-for="tag in article.tags" :key="tag" class="tag">
            <i class="fas fa-tag"></i>
            {{ tag }}
          </span>
        </div>
      </div>

      <div class="article-content">
        <div class="content-text" v-html="formattedContent"></div>
      </div>

      <!-- 相似文章推荐区 -->
      <div class="similar-articles" v-if="similarArticles.length">
        <h2 class="section-title">相似文章推荐</h2>
        <div class="articles-grid">
          <div v-for="similarArticle in similarArticles" :key="similarArticle.article_id" class="article-card">
            <h3 class="article-card-title">{{ similarArticle.title }}</h3>
            <p class="article-card-preview">{{ similarArticle.preview }}</p>
            <!-- <p> {{ similarArticle.article_id }}</p> -->
            <button @click="viewArticle(similarArticle.article_id)" class="read-more-btn">阅读更多</button>
          </div>
        </div>
      </div>

      <!-- 评论区 -->
      <CommentSection :article-id="route.params.id" />
    </div>
    <div v-else class="loading">
      <div class="loading-spinner"></div>
      <span>正在加载文章评论...</span>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import NavbarView from '@/components/Layout/NavbarView.vue'
import articleapi from '@/api/articleapi'
import { format } from 'date-fns'
import CommentSection from '@/components/Article/CommentSection.vue'

const route = useRoute()
const router = useRouter()
const article = ref(null)
const similarArticles = ref([])

const formatDate = (dateStr) => {
  try {
    return format(new Date(dateStr), 'yyyy-MM-dd HH:mm')
  } catch (error) {
    return dateStr
  }
}

const formattedContent = computed(() => {
  if (!article.value) return ''
  return article.value.content
    .split('\n')
    .map(line => line.trim())
    .join('<br>')
})


const fetchArticle = async () => {
  try {
    const articleId = route.params.id
    const response = await articleapi.getArticle(articleId)
    if (response.code === 200) {
      article.value = response.data
      fetchSimilarArticles(articleId)
    } else {
      throw new Error('文章未找到')
    }
  } catch (error) {
    console.error('获取文章失败:', error)
    router.push('/404')
  }
}

const fetchSimilarArticles = async (articleId) => {
  try {
    const response = await articleapi.getSimilarArticles(articleId)
    if (response.code === 200) {
      similarArticles.value = response.data.articles
    }
  } catch (error) {
    console.error('获取相似文章失败:', error)
  }
}



const viewArticle = (articleId) => {
  //console.log(articleId)
  router.push(`/article/${articleId}`)
  console.log(articleId)
}
// 监听路由变化
watch(() => route.params.id, (newId, oldId) => {
  if (newId !== oldId) {
    fetchArticle()
  }
})

onMounted(() => {
  fetchArticle()
})
</script>

<style scoped>
.article-detail {
  min-height: 100vh;
  background: #f5f5f5;
  padding: 2rem 0;
}

.article-container {
  max-width: 900px;
  margin: 0 auto;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  padding: 2.5rem;
}

.article-header {
  margin-bottom: 2.5rem;
}

.article-title {
  font-size: 2.2rem;
  font-weight: 700;
  color: #2c3e50;
  margin-bottom: 1.5rem;
  line-height: 1.4;
}

.article-meta {
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

.writer-name, .create-time, .views, .likes {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.article-tags {
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

.article-content {
  font-size: 1.1rem;
  line-height: 1.8;
  color: #2c3e50;
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
  .article-container {
    margin: 0 1rem;
    padding: 1.5rem;
  }

  .article-title {
    font-size: 1.8rem;
  }

  .article-meta {
    flex-direction: column;
    gap: 1rem;
  }

  .meta-left, .meta-right {
    width: 100%;
    justify-content: space-between;
  }
}

.comments-section {
  margin-top: 40px;
  padding: 24px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.comments-title {
  font-size: 20px;
  font-weight: 500;
  margin-bottom: 24px;
}

.comment-input {
  margin-bottom: 24px;
}

.comment-input textarea {
  width: 100%;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  resize: vertical;
  margin-bottom: 12px;
}

.comment-input button {
  padding: 8px 24px;
  background: #4a90e2;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.comment-item {
  padding: 16px 0;
  border-bottom: 1px solid #eee;
}

.comment-header {
  display: flex;
  align-items: center;
  margin-bottom: 8px;
}

.user-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  margin-right: 12px;
}

.user-name {
  font-weight: 500;
  margin-right: 8px;
}

.comment-time {
  color: #999;
  font-size: 12px;
}

.comment-content {
  margin: 8px 0;
  line-height: 1.6;
}

.comment-actions {
  display: flex;
  gap: 16px;
}

.comment-actions button {
  padding: 4px 12px;
  background: none;
  border: none;
  color: #666;
  cursor: pointer;
}

.like-btn.liked {
  color: #4a90e2;
}

.replies-list {
  margin-left: 44px;
  margin-top: 16px;
}

.reply-item {
  padding: 12px 0;
  border-bottom: 1px solid #f5f5f5;
}

.reply-input {
  margin-left: 44px;
  margin-top: 16px;
}

.reply-input textarea {
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  resize: vertical;
  margin-bottom: 8px;
}

.reply-actions {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
}

.reply-actions button:first-child {
  background: none;
  border: 1px solid #ddd;
}

.reply-actions button:last-child {
  background: #4a90e2;
  color: white;
  border: none;
}

.load-more {
  text-align: center;
  margin-top: 24px;
}

.load-more button {
  padding: 8px 24px;
  background: none;
  border: 1px solid #ddd;
  border-radius: 4px;
  cursor: pointer;
}

.similar-articles {
  margin-top: 40px;
  padding: 24px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.section-title {
  font-size: 20px;
  font-weight: 500;
  margin-bottom: 24px;
}

.articles-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
}

.article-card {
  background: #f9f9f9;
  border-radius: 8px;
  padding: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s;
}

.article-card:hover {
  transform: translateY(-4px);
}

.article-card-title {
  font-size: 1.1rem;
  font-weight: bold;
  margin-bottom: 8px;
  color: #333;
}

.article-card-preview {
  font-size: 0.9rem;
  color: #666;
  margin-bottom: 12px;
}

.read-more-btn {
  padding: 8px 16px;
  background: #4a90e2;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background 0.3s;
}

.read-more-btn:hover {
  background: #357abd;
}
</style>
