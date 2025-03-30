<template>
  <div class="article-detail">
    <NavbarView />
    <div v-if="article" class="article-container">
      <!-- 文章头部信息 -->
      <div class="article-header">
        <h1 class="article-title">{{ article.title }}</h1>
        <div class="article-meta">
          <div class="author-info">
            <img :src="article.author.avatar" :alt="article.author.name" class="author-avatar">
            <div class="author-details">
              <span class="author-name">{{ article.author.name }}</span>
              <span class="author-title">{{ article.author.title }}</span>
            </div>
          </div>
          <div class="article-info">
            <span class="publish-time">发布时间：{{ article.publishTime }}</span>
            <div class="tags">
              <span v-for="tag in article.tags" :key="tag" class="tag">{{ tag }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 文章内容 -->
      <div class="article-content">
        <div class="content-text" v-html="formattedContent"></div>
      </div>

      <!-- 添加评论区 -->
      <div class="comments-section" v-if="article">
        <h2 class="comments-title">评论区</h2>
        
        <!-- 评论输入框 -->
        <div class="comment-input">
          <textarea
            v-model="newComment"
            placeholder="写下你的评论..."
            :rows="3"
          ></textarea>
          <button @click="submitComment" :disabled="!newComment.trim()">
            发表评论
          </button>
        </div>

        <!-- 评论列表 -->
        <div class="comments-list">
          <div v-for="comment in comments" :key="comment.id" class="comment-item">
            <div class="comment-header">
              <img :src="comment.user.avatar" :alt="comment.user.name" class="user-avatar">
              <div class="comment-info">
                <span class="user-name">{{ comment.user.name }}</span>
                <span class="comment-time">{{ comment.createTime }}</span>
              </div>
            </div>
            <div class="comment-content">{{ comment.content }}</div>
            <div class="comment-actions">
              <button 
                @click="toggleLike(comment)"
                :class="['like-btn', { liked: comment.isLiked }]"
              >
                {{ comment.likeCount }} 点赞
              </button>
              <button @click="showReplyInput(comment)">回复</button>
            </div>
            
            <!-- 回复列表 -->
            <div class="replies-list" v-if="comment.replies && comment.replies.length">
              <div v-for="reply in comment.replies" :key="reply.id" class="reply-item">
                <div class="comment-header">
                  <img :src="reply.user.avatar" :alt="reply.user.name" class="user-avatar">
                  <div class="comment-info">
                    <span class="user-name">{{ reply.user.name }}</span>
                    <span class="comment-time">{{ reply.createTime }}</span>
                  </div>
                </div>
                <div class="comment-content">{{ reply.content }}</div>
                <div class="comment-actions">
                  <button 
                    @click="toggleLike(reply)"
                    :class="['like-btn', { liked: reply.isLiked }]"
                  >
                    {{ reply.likeCount }} 点赞
                  </button>
                </div>
              </div>
            </div>
            
            <!-- 回复输入框 -->
            <div v-if="replyingTo === comment.id" class="reply-input">
              <textarea
                v-model="replyContent"
                placeholder="写下你的回复..."
                :rows="2"
              ></textarea>
              <div class="reply-actions">
                <button @click="cancelReply">取消</button>
                <button @click="submitReply(comment)" :disabled="!replyContent.trim()">
                  回复
                </button>
              </div>
            </div>
          </div>
        </div>
        
        <!-- 加载更多 -->
        <div v-if="hasMore" class="load-more">
          <button @click="loadMoreComments">加载更多评论</button>
        </div>
      </div>
    </div>
    <div v-else class="loading">加载中...</div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import NavbarView from '@/components/Layout/NavbarView.vue'
import articleapi from '@/api/articleapi'
const route = useRoute()
const router = useRouter()
const article = ref(null)

// 格式化文章内容，将换行符转换为HTML
const formattedContent = computed(() => {
  if (!article.value) return ''
  return article.value.content.split('\n').map(line => line.trim()).join('<br>')
})

const comments = ref([])
const newComment = ref('')
const replyContent = ref('')
const replyingTo = ref(null)
const currentPage = ref(1)
const hasMore = ref(false)

const fetchArticle = async () => {
  try {
    const articleId = route.params.id
    console.log('Fetching article:', articleId)
    
    const response = await articleapi.getArticle(articleId)
    //const response = await fetch(`/articles/${articleId}`)
    if (response.code === 200 && response.data) {
      article.value = response.data
    } else {
      throw new Error('Article not found')
    }
  } catch (error) {
    console.error('Failed to fetch article:', error)
    router.push('/404')
  }
}

// 获取评论列表
const fetchComments = async () => {
  try {
    const response = await articleapi.getComments(route.params.id, currentPage.value)
    if (response.code === 200) {
      if (currentPage.value === 1) {
        comments.value = response.data.items
      } else {
        comments.value.push(...response.data.items)
      }
      hasMore.value = response.data.total > comments.value.length
    }
  } catch (error) {
    console.error('Failed to fetch comments:', error)
  }
}

// 发表评论
const submitComment = async () => {
  try {
    const response = await articleapi.postComment(route.params.id, newComment.value)
    if (response.code === 200) {
      comments.value.unshift(response.data)
      newComment.value = ''
    }
  } catch (error) {
    console.error('Failed to post comment:', error)
  }
}

// 显示回复输入框
const showReplyInput = (comment) => {
  replyingTo.value = comment.id
  replyContent.value = ''
}

// 取消回复
const cancelReply = () => {
  replyingTo.value = null
  replyContent.value = ''
}

// 提交回复
const submitReply = async (comment) => {
  try {
    const response = await articleapi.replyComment(comment.id, replyContent.value)
    if (response.code === 200) {
      if (!comment.replies) {
        comment.replies = []
      }
      comment.replies.push(response.data)
      cancelReply()
    }
  } catch (error) {
    console.error('Failed to post reply:', error)
  }
}

// 点赞/取消点赞
const toggleLike = async (comment) => {
  try {
    if (comment.isLiked) {
      await articleapi.unlikeComment(comment.id)
      comment.likeCount--
    } else {
      await articleapi.likeComment(comment.id)
      comment.likeCount++
    }
    comment.isLiked = !comment.isLiked
  } catch (error) {
    console.error('Failed to toggle like:', error)
  }
}

// 加载更多评论
const loadMoreComments = () => {
  currentPage.value++
  fetchComments()
}

onMounted(() => {
  console.log('ArticleDetailView mounted, route params:', route.params)
  fetchArticle()
  fetchComments()
})
</script>

<style scoped>
.article-detail {
  min-height: 100vh;
  background: #f5f5f5;
}

.article-container {
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  padding: 24px;
}

.article-header {
  margin-bottom: 32px;
}

.article-title {
  font-size: 28px;
  font-weight: bold;
  color: #333;
  margin-bottom: 16px;
}

.article-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 0;
  border-bottom: 1px solid #eee;
}

.author-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.author-avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  object-fit: cover;
}

.author-details {
  display: flex;
  flex-direction: column;
}

.author-name {
  font-size: 16px;
  font-weight: 500;
  color: #333;
}

.author-title {
  font-size: 14px;
  color: #666;
}

.article-info {
  text-align: right;
}

.publish-time {
  font-size: 14px;
  color: #666;
  margin-bottom: 8px;
  display: block;
}

.tags {
  display: flex;
  gap: 8px;
  justify-content: flex-end;
}

.tag {
  padding: 4px 12px;
  background: #f0f2f5;
  border-radius: 16px;
  font-size: 12px;
  color: #666;
}

.article-content {
  margin-top: 32px;
  line-height: 1.8;
  color: #333;
}

.content-text {
  white-space: pre-line;
}

.loading {
  text-align: center;
  padding: 40px;
  color: #666;
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
</style>
