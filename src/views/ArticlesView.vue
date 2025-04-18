<template>
  <div class="articles-view">
    <NavbarView />
    <div class="content">
      <div class="articles-header">
        <h1>心理健康文章</h1>
        <div class="search-section">
          <div class="search-box">
            <!-- 给输入框添加 ref -->
            <input 
              ref="searchInputRef"
              v-model="searchKeyword" 
              type="text" 
              placeholder="搜索文章..."
              @focus="showTagSelector = true"
            >
            <button @click="handleSearch" class="search-btn">
              <i class="fas fa-search"></i>
            </button>
          </div>
          
          <!-- 标签选择器，添加 ref -->
          <div v-if="showTagSelector" class="tag-selector" ref="tagSelectorRef">
            <div class="tag-list">
              <div
                v-for="tag in availableTags"
                :key="tag"
                :class="['tag-item', { active: selectedTags.includes(tag) }]"
                @click="toggleTag(tag)"
              >
                {{ tag }}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div class="articles-container">
        <div class="articles-grid">
          <ArticleCard
            v-for="article in articles"
            :key="article.article_id"
            :article="article"
            @click="viewArticle(article.article_id)"
          />
        </div>
      </div>

      <!-- 分页器 -->
      <div class="pagination">
        <button 
          :disabled="currentPage === 1"
          @click="changePage(currentPage - 1)"
          class="page-btn"
        >
          上一页
        </button>
        <span class="page-info">第 {{ currentPage }} 页 / 共 {{ Math.ceil(totalArticles / 10) }} 页</span>
        <button 
          :disabled="currentPage >= Math.ceil(totalArticles / 10)"
          @click="changePage(currentPage + 1)"
          class="page-btn"
        >
          下一页
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'
import ArticleCard from '@/components/Article/ArticleCard.vue'
import NavbarView from '@/components/Layout/NavbarView.vue'
import articleApi from '@/api/articleapi'

export default {
  name: 'ArticlesView',
  components: {
    NavbarView,
    ArticleCard
  },
  setup() {
    const router = useRouter()
    const articles = ref([])
    const totalArticles = ref(0)
    const currentPage = ref(1)
    const searchKeyword = ref('')
    const selectedTags = ref([])
    const showTagSelector = ref(false)

    // 添加 ref 用于获取 DOM 元素
    const tagSelectorRef = ref(null)
    const searchInputRef = ref(null)

    // 可用的标签列表（实际应用中可能需要从后端获取）
    const availableTags = ref(['焦虑', '抑郁', '人际关系', '生活', '成长'])

    const fetchArticles = async () => {
      try {
        console.log(currentPage.value)
        const response = await articleApi.getArticles({
          keyword: searchKeyword.value,
          page: currentPage.value,
          tags: selectedTags.value.length > 0 ? selectedTags.value : undefined
        })
        console.log(response)
        // 假定后端返回数据形如：{ articles: [...], total: number }
        articles.value = response.data.articles
        totalArticles.value = response.data.total
      } catch (error) {
        console.error('获取文章列表失败:', error)
      }
    }

    const handleSearch = () => {
      currentPage.value = 1
      fetchArticles()
      showTagSelector.value = false
    }

    const toggleTag = (tag) => {
      const index = selectedTags.value.indexOf(tag)
      if (index === -1) {
        selectedTags.value.push(tag)
      } else {
        selectedTags.value.splice(index, 1)
      }
    }

    const changePage = (page) => {
      currentPage.value = page
      fetchArticles()
    }

    const viewArticle = (articleId) => {
      console.log("here article_id"+articleId)
      router.push(`/article/${articleId}`)
    }

    // 处理全局点击事件，判断点击是否在标签选择器或搜索输入框内部
    const handleClickOutside = (event) => {
      const tagEl = tagSelectorRef.value
      const inputEl = searchInputRef.value
      // 如果标签选择器当前显示，且点击区域既不在标签选择器内也不在搜索输入框内，则隐藏标签选择器
      if (showTagSelector.value && tagEl && !tagEl.contains(event.target) && inputEl && !inputEl.contains(event.target)) {
        showTagSelector.value = false
      }
    }

    onMounted(() => {
      fetchArticles()
      document.addEventListener('click', handleClickOutside)
    })

    onBeforeUnmount(() => {
      document.removeEventListener('click', handleClickOutside)
    })

    return {
      articles,
      totalArticles,
      currentPage,
      searchKeyword,
      selectedTags,
      showTagSelector,
      availableTags,
      tagSelectorRef,
      searchInputRef,
      handleSearch,
      toggleTag,
      changePage,
      viewArticle
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

.search-section {
  position: relative;
  margin-bottom: 2rem;
}

.search-box {
  display: flex;
  gap: 0.5rem;
  max-width: 600px;
}

.search-box input {
  flex: 1;
  padding: 0.8rem 1.2rem;
  border: 2px solid #eee;
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.3s;
}

.search-box input:focus {
  border-color: #4a90e2;
  outline: none;
}

.search-btn {
  padding: 0.8rem 1.5rem;
  background: #4a90e2;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s;
}

.search-btn:hover {
  background: #357abd;
}

.tag-selector {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: white;
  padding: 1rem;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  margin-top: 0.5rem;
  z-index: 100;
}

.tag-list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.8rem;
}

.tag-item {
  padding: 0.5rem 1rem;
  background: #f5f7fa;
  color: #666;
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.3s;
}

.tag-item:hover {
  background: #e8f0fe;
  color: #4a90e2;
}

.tag-item.active {
  background: #4a90e2;
  color: white;
}

.articles-container {
  width: 100%;
  margin-bottom: 2rem;
}

.articles-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
  margin-bottom: 2rem;
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  padding: 2rem 0;
  width: 100%;
  border-top: 1px solid #eee;
}

.page-btn {
  padding: 0.8rem 1.5rem;
  border: none;
  border-radius: 8px;
  background: #4a90e2;
  color: white;
  cursor: pointer;
  transition: all 0.3s;
  font-size: 0.9rem;
}

.page-btn:hover:not(:disabled) {
  background: #357abd;
}

.page-btn:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.page-info {
  color: #666;
  font-size: 0.9rem;
}
</style>
