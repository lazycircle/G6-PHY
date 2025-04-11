<!-- 主页，显示欢迎语句和登录/注册按钮(未登录状态) -->
<template>
  <div class="home">
    <NavbarView />
    <div class="content">
      <!-- Banner Section -->
      <div class="banner">
        <div class="banner-content">
          <h1>专业心理咨询平台</h1>
          <p>连接专业咨询师，开启心理健康之旅</p>
        </div>
      </div>

      <!-- Articles Section -->
      <div class="articles-section">
        <div class="section-header">
          <h2>推荐文章</h2>
        </div>
        <div class="articles-grid">
          <ArticleCard
            v-for="article in articles"
            :key="article.article_id"
            :article="article"
            @click="viewArticle(article.article_id)"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import NavbarView from '@/components/Layout/NavbarView.vue'
import ArticleCard from '@/components/Article/ArticleCard.vue'
import articleApi from '@/api/articleapi'

const articles = ref([])
const router = useRouter()

const viewArticle = (articleId) => {
  const token = localStorage.getItem('token')
  if (token) {
    console.log(articleId)
    router.push(`/article/${articleId}`)
  } else {
    console.log('not login')
    router.push('/login')
  }
}

const fetchRecommendedArticles = async () => {
  try {
    console.log('hello0')
    const response = await articleApi.getRecommendedArticles()
      console.log(response)
      articles.value = response.data.articles
    
  } catch (error) {
    console.error('获取推荐文章失败:', error)
  }
}

onMounted(() => {
  fetchRecommendedArticles()
})
</script>

<style scoped>
.home {
  min-height: 100vh;
  background: #f5f5f5;
}

.content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1rem;
}

.banner {
  height: 400px;
  background: linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url('/public/images/banner-bg.jpg');
  background-size: cover;
  background-position: center;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  text-align: center;
  margin-bottom: 2rem;
  border-radius: 8px;
}

.banner-content {
  max-width: 600px;
  padding: 0 1rem;
}

.banner-content h1 {
  font-size: 2.5rem;
  margin-bottom: 1rem;
}

.banner-content p {
  font-size: 1.2rem;
  margin-bottom: 2rem;
}

.consultation-btn {
  display: inline-block;
  padding: 1rem 2rem;
  background: #4a90e2;
  color: white;
  text-decoration: none;
  border-radius: 4px;
  font-size: 1.1rem;
  transition: background-color 0.3s;
}

.consultation-btn:hover {
  background: #357abd;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.section-header h2 {
  color: #333;
}

.view-all {
  color: #4a90e2;
  text-decoration: none;
}

.articles-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 2rem;
}
</style>  