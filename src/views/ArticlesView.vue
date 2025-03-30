<template>
  <div class="articles-view">
    <NavbarView />
    <div class="content">
      <div class="articles-header">
        <h1>心理健康文章</h1>
        <div class="categories">
          <button 
            v-for="category in categories" 
            :key="category.id"
            :class="['category-btn', { active: currentCategory === category.id }]"
            @click="setCategory(category.id)"
          >
            {{ category.name }}
          </button>
        </div>
      </div>
      
      <div class="articles-container">
        <div class="articles-grid">
          <ArticleCard
            v-for="article in filteredArticles"
            :key="article.id"
            :article="article"
            @click="viewArticle(article.id)"
          />
        </div>
        <div class="sidebar">
          <div class="hot-topics">
            <h3>热门话题</h3>
            <ul>
              <li v-for="topic in hotTopics" :key="topic.id">
                <a href="#" @click.prevent="viewArticle(topic.id)">{{ topic.title }}</a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ArticleCard from '@/components/Article/ArticleCard.vue'
import NavbarView from '@/components/Layout/NavbarView.vue';
import { useRouter } from 'vue-router';

export default {
  name: 'ArticlesView',
  components: {
    NavbarView,
    ArticleCard
  },
  setup() {
    const router = useRouter();

    const goToArticle = (articleId) => {
      router.push(`/article/${articleId}`);
    }

    return {
      goToArticle
    }
  },
  data() {
    return {
      currentCategory: 'all',
      categories: [
        { id: 'all', name: '全部' },
        { id: 'anxiety', name: '焦虑' },
        { id: 'depression', name: '抑郁' },
        { id: 'relationship', name: '人际关系' },
        { id: 'growth', name: '个人成长' }
      ],
      articles: [
        {
          id: 1,
          title: '如何克服社交焦虑？',
          excerpt: '社交焦虑是现代人常见的心理问题，本文将为您介绍几种有效的应对方法...',
          coverImage: '/images/social-anxiety.jpg',
          category: 'anxiety',
          tag: '焦虑'
        },
        {
          id: 2,
          title: '保持积极心态的方法',
          excerpt: '积极心态对心理健康至关重要。以下是培养积极心态的几个建议...',
          coverImage: '/images/social-anxiety.jpg',
          category: 'anxiety',
          tag: '心理健康',
        },
        // 添加更多文章...
      ],
      hotTopics: [
        { id: 1, title: '如何建立健康的自我认知？' },
        { id: 2, title: '走出情感依赖的困境' },
        { id: 3, title: '压力管理的五个关键步骤' },
        { id: 4, title: '提升沟通能力的实用技巧' },
        { id: 5, title: '正念冥想入门指南' }
      ]
    }
  },
  computed: {
    filteredArticles() {
      if (this.currentCategory === 'all') {
        return this.articles
      }
      return this.articles.filter(article => article.category === this.currentCategory)
    }
  },
  methods: {
    setCategory(categoryId) {
      this.currentCategory = categoryId
    },
    viewArticle(articleId) {
      this.goToArticle(articleId)
    }
  }
}
</script>

<style scoped>
.articles-view {
  min-height: 100vh;
  background: #f5f5f5;
}

.content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1rem;
}

.articles-header {
  margin-bottom: 2rem;
}

.articles-header h1 {
  font-size: 2rem;
  color: #333;
  margin-bottom: 1rem;
}

.categories {
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
}

.category-btn {
  padding: 0.5rem 1.5rem;
  border: none;
  border-radius: 20px;
  background: #fff;
  color: #666;
  cursor: pointer;
  transition: all 0.3s ease;
}

.category-btn.active {
  background: #4a90e2;
  color: white;
}

.articles-container {
  display: grid;
  grid-template-columns: 3fr 1fr;
  gap: 2rem;
}

.articles-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 2rem;
}

.sidebar {
  background: white;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.hot-topics h3 {
  margin-bottom: 1rem;
  color: #333;
}

.hot-topics ul {
  list-style: none;
  padding: 0;
}

.hot-topics li {
  margin-bottom: 1rem;
}

.hot-topics a {
  color: #666;
  text-decoration: none;
  line-height: 1.4;
}

.hot-topics a:hover {
  color: #4a90e2;
}
</style> 