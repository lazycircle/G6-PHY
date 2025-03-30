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
          <h2>热门文章</h2>
          <router-link to="/articles" class="view-all">查看全部</router-link>
        </div>
        <div class="articles-grid">
          <article-card
            v-for="article in articles"
            :key="article.id"
            :article="article"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import NavbarView from '@/components/Layout/NavbarView.vue'
import ArticleCard from '@/components/Article/ArticleCard.vue'

export default {
  name: 'HomeView',
  components: {
    NavbarView,
    ArticleCard
  },
  data() {
    return {
      articles: [
        {
          id: 1,
          title: '如何应对生活压力？',
          excerpt: '在现代社会中，压力已经成为了我们日常生活中不可避免的一部分...',
          coverImage: '/images/banner-bg.jpg',
          tag: '压力管理'
        },
        {
          id: 2,
          title: '改善睡眠质量的实用技巧',
          excerpt: '良好的睡眠对于我们的身心健康至关重要...',
          coverImage: '/images/banner-bg.jpg',
          tag: '睡眠健康'
        },
        // 可以添加更多文章
      ]
    }
  }
}
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