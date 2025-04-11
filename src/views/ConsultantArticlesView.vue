<template>
    <div class="articles-view">
      <NavbarView />
      <div class="content">
        <div class="articles-header">
          <div class="header-main">
            <h1>心理健康文章</h1>
            <button class="publish-btn" @click="showPublishDialog = true">
              <i class="fas fa-plus"></i>
              发布文章
            </button>
          </div>
          <div class="search-section">
            <div class="search-box">
              <input 
                v-model="searchKeyword" 
                type="text" 
                placeholder="搜索文章..."
                @focus="showTagSelector = true"
              >
              <button @click="handleSearch" class="search-btn">
                <i class="fas fa-search"></i>
              </button>
            </div>
            
            <!-- 标签选择器 -->
            <div v-if="showTagSelector" class="tag-selector">
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
  
        <!-- 将分页器移到容器外部 -->
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

      <!-- 发布文章弹窗 -->
      <PublishArticleDialog
        v-model:visible="showPublishDialog"
      />
    </div>
  </template>
  
  <script>
  import { ref, onMounted } from 'vue'
  import { useRouter } from 'vue-router'
  import { ElMessage } from 'element-plus'
  import ArticleCard from '@/components/Article/ArticleCard.vue'
  import NavbarView from '@/components/Layout/NavbarView.vue'
  import PublishArticleDialog from '@/components/Article/PublishArticleDialog.vue'
  import articleApi from '@/api/articleapi'
  
  export default {
    name: 'ArticlesView',
    components: {
      NavbarView,
      ArticleCard,
      PublishArticleDialog
    },
    setup() {
      const router = useRouter()
      const articles = ref([])
      const totalArticles = ref(0)
      const currentPage = ref(1)
      const searchKeyword = ref('')
      const selectedTags = ref([])
      const showTagSelector = ref(false)
      const showPublishDialog = ref(false)
      const publishing = ref(false)
      const articleForm = ref({
        title: '',
        content: '',
        tags: []
      })
  
      // 可用的标签列表（实际应用中可能需要从后端获取）
      const availableTags = ref(['焦虑', '抑郁', '人际关系', '生活', '成长'])
  
      const fetchArticles = async () => {
        try {
          const response = await articleApi.getArticles({
            keyword: searchKeyword.value,
            page: currentPage.value,
            tags: selectedTags.value.length > 0 ? selectedTags.value : undefined
          })
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
        router.push(`/article/${articleId}`)
      }
  
      const toggleArticleTag = (tag) => {
        const index = articleForm.value.tags.indexOf(tag)
        if (index === -1) {
          if (articleForm.value.tags.length >= 3) {
            ElMessage.warning('最多只能选择3个标签')
            return
          }
          articleForm.value.tags.push(tag)
        } else {
          articleForm.value.tags.splice(index, 1)
        }
      }
  
      const handlePublish = async () => {
        if (!articleForm.value.title.trim()) {
          ElMessage.warning('请输入文章标题')
          return
        }
        if (!articleForm.value.content.trim()) {
          ElMessage.warning('请输入文章内容')
          return
        }
  
        publishing.value = true
        try {
          const response = await articleApi.publishArticle(articleForm.value)
          if (response.data) {
            ElMessage.success('文章发布成功')
            showPublishDialog.value = false
            // 跳转到新文章详情页
            router.push(`/article/${response.data.article_id}`)
          }
        } catch (error) {
          ElMessage.error(error.message || '发布失败，请重试')
        } finally {
          publishing.value = false
        }
      }
  
      onMounted(() => {
        fetchArticles()
      })
  
      return {
        articles,
        totalArticles,
        currentPage,
        searchKeyword,
        selectedTags,
        showTagSelector,
        availableTags,
        handleSearch,
        toggleTag,
        changePage,
        viewArticle,
        showPublishDialog,
        publishing,
        articleForm,
        toggleArticleTag,
        handlePublish
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

  .header-main {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1.5rem;
  }

  .publish-btn {
    padding: 0.8rem 1.5rem;
    background: #4a90e2;
    color: white;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 1rem;
    transition: all 0.3s;
  }

  .publish-btn:hover {
    background: #357abd;
  }

  .publish-form {
    padding: 1rem;
  }

  .form-item {
    margin-bottom: 1.5rem;
  }

  .form-item label {
    display: block;
    margin-bottom: 0.5rem;
    font-weight: 500;
    color: #333;
  }

  .tags-selector {
    display: flex;
    flex-wrap: wrap;
    gap: 0.8rem;
  }

  .tags-selector .el-tag {
    cursor: pointer;
    padding: 0.5rem 1rem;
    font-size: 0.9rem;
  }

  .tags-selector .el-tag.active {
    background: #4a90e2;
    color: white;
    border-color: #4a90e2;
  }

  .dialog-footer {
    display: flex;
    justify-content: flex-end;
    gap: 1rem;
    padding-top: 1rem;
  }
  </style> 