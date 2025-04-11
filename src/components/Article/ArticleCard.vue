<template>
  <div class="article-card">
    <div class="article-content">
      <h3 class="article-title">{{ article.title }}</h3>
      <div class="article-author">
        <span class="author-name">{{ article.writer_name }}</span>
        <span class="publish-time">{{ formatDate(article.create_time) }}</span>
      </div>
      <p class="article-preview">{{ article.preview }}</p>
      <div class="article-footer">
        <div class="article-stats">
          <span class="stat-item">
            <i class="fas fa-eye"></i>
            {{ article.views_count }}
          </span>
          <span class="stat-item">
            <i class="fas fa-heart"></i>
            {{ article.liked_count }}
          </span>
        </div>
        <div class="article-tags">
          <span 
            v-for="tag in article.tags" 
            :key="tag" 
            class="tag"
          >
            {{ tag }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { format, parseISO } from 'date-fns'

export default {
  name: 'ArticleCard',
  props: {
    article: {
      type: Object,
      required: true
    }
  },
  methods: {
    formatDate(dateStr) {
      if (!dateStr) {
        return '暂无日期' // 或者返回其他默认值
      }
      
      try {
        const date = parseISO(dateStr)
        return format(date, 'yyyy-MM-dd')
      } catch (error) {
        console.warn('日期格式化失败:', error)
        return dateStr
      }
    }
  }
}
</script>

<style scoped>
.article-card {
  background: #fff;
  border-radius: 12px;
  padding: 1.5rem;
  transition: all 0.3s;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
}

.article-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.12);
}

.article-title {
  margin: 0 0 0.8rem;
  font-size: 1.25rem;
  color: #2c3e50;
  line-height: 1.4;
}

.article-author {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
}

.author-name {
  color: #4a90e2;
  font-weight: 500;
}

.publish-time {
  color: #999;
  font-size: 0.9rem;
}

.article-preview {
  color: #666;
  line-height: 1.6;
  margin: 1rem 0;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.article-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid #eee;
}

.article-stats {
  display: flex;
  gap: 1rem;
}

.stat-item {
  color: #666;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  gap: 0.4rem;
}

.article-tags {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.tag {
  background: #f0f7ff;
  color: #4a90e2;
  padding: 0.3rem 0.8rem;
  border-radius: 16px;
  font-size: 0.85rem;
  transition: all 0.3s;
}

.tag:hover {
  background: #4a90e2;
  color: white;
}
</style> 