<template>
  <div class="article-card">
    <img :src="article.coverImage" :alt="article.title" class="article-image">
    <div class="article-content">
      <h3 class="article-title">{{ article.title }}</h3>
      <p class="article-excerpt">{{ article.excerpt }}</p>
      <div class="article-meta">
        <span class="tag" v-if="article.tag">{{ article.tag }}</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ArticleCard',
  props: {
    article: {
      type: Object,
      required: true
    }
  }
}
</script>

<style scoped>
.article-card {
  background: #fff;
  border-radius: 8px;
  overflow: hidden;
  transition: transform 0.2s;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.article-card:hover {
  transform: translateY(-4px);
}

.article-image {
  width: 100%;
  height: 200px;
  object-fit: cover;
}

.article-content {
  padding: 1rem;
}

.article-title {
  margin: 0;
  font-size: 1.1rem;
  color: #333;
  line-height: 1.4;
}

.article-excerpt {
  color: #666;
  font-size: 0.9rem;
  margin: 0.5rem 0;
  line-height: 1.5;
}

.article-meta {
  display: flex;
  align-items: center;
  margin-top: 0.5rem;
}

.tag {
  background: #f0f0f0;
  padding: 0.2rem 0.5rem;
  border-radius: 4px;
  font-size: 0.8rem;
  color: #666;
}
</style> 