<template>
  <div class="comments-section">
    <!-- 消息提示组件 -->
    <GlobalMessage ref="messageRef" />
    
    <h2 class="comments-title">
      评论区
      <span class="comment-count">{{ total }} 条评论</span>
    </h2>
    
    <!-- 评论输入框 -->
    <div class="comment-input">
      <textarea
        v-model="newComment"
        placeholder="写下你的评论..."
        :rows="3"
        @focus="handleFocus"
        @keydown.ctrl.enter="submitComment"
      ></textarea>
      <div class="input-footer">
        <span class="tip">Ctrl + Enter 快速发表</span>
        <button 
          @click="submitComment"
          :disabled="!newComment.trim()"
          class="submit-btn"
        >
          发表评论
        </button>
      </div>
    </div>

    <!-- 评论列表 -->
    <div class="comments-list" v-if="comments.length">
      <div v-for="comment in comments" :key="comment.id" class="comment-item">
        <!-- 主评论 -->
        <div class="comment-main">
          <div class="comment-header">
            <span class="username">{{ comment.username }}</span>
            <span class="time">{{ formatTime(comment.time) }}</span>
          </div>
          <div class="comment-content">{{ comment.content }}</div>
          <div class="comment-actions">
            <button 
              @click="toggleLike(comment)"
              :class="['like-btn', { 'liked': comment.is_liked }]"
            >
              <i class="fas fa-heart"></i>
              <span>{{ comment.liked_count }}</span>
            </button>
            <button class="reply-btn" @click="showReplyInput(comment)">
              <i class="fas fa-reply"></i>
              <span>回复</span>
            </button>
          </div>
          
          <!-- 回复输入框 -->
          <div v-if="replyingTo === comment.id" class="reply-input">
            <textarea
              v-model="replyContent"
              :placeholder="'回复 ' + comment.username + '...'"
              :rows="2"
              @keydown.ctrl.enter="submitReply(comment)"
            ></textarea>
            <div class="reply-actions">
              <button class="cancel-btn" @click="cancelReply">取消</button>
              <button 
                class="submit-btn"
                @click="submitReply(comment)"
                :disabled="!replyContent.trim()"
              >
                回复
              </button>
            </div>
          </div>
        </div>

        <!-- 回复列表 -->
        <div v-if="comment.reply && comment.reply.length" class="replies-list">
          <div v-for="reply in comment.reply.slice(0, comment.visibleReplies || 3)" :key="reply.id" class="reply-item">
            <div class="reply-header">
              <span class="username">{{ reply.username }}</span>
              <span class="time">{{ formatTime(reply.time) }}</span>
            </div>
            <div class="reply-content">{{ reply.content }}</div>
            <div class="reply-actions">
              <button 
                @click="toggleLike(reply)"
                :class="['like-btn', { 'liked': reply.is_liked }]"
              >
                <i class="fas fa-heart"></i>
                <span>{{ reply.liked_count }}</span>
              </button>
              <button class="reply-btn" @click="showReplyToReplyInput(reply)">
                <i class="fas fa-reply"></i>
                <span>回复</span>
              </button>
            </div>
            
            <!-- 回复的回复输入框 -->
            <div v-if="replyingToReply === reply.id" class="reply-input">
              <textarea
                v-model="replyToReplyContent"
                :placeholder="'回复 ' + reply.username + '...'"
                :rows="2"
                @keydown.ctrl.enter="submitReplyToReply(comment, reply)"
              ></textarea>
              <div class="reply-actions">
                <button class="cancel-btn" @click="cancelReplyToReply">取消</button>
                <button 
                  class="submit-btn"
                  @click="submitReplyToReply(comment, reply)"
                  :disabled="!replyToReplyContent.trim()"
                >
                  回复
                </button>
              </div>
            </div>
          </div>
          
          <!-- 展示更多回复的按钮 -->
          <div v-if="comment.reply.length > (comment.visibleReplies || 3)" class="show-more-replies">
            <button @click="showMoreReplies(comment)">
              查看更多回复
            </button>
          </div>
          
          <!-- 收起回复的按钮 -->
          <div v-if="(comment.visibleReplies || 3) > 3" class="collapse-replies">
            <button @click="collapseReplies(comment)">
              收起回复
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- 分页器 -->
    <div class="pagination" v-if="total > 0">
      <button 
        :disabled="currentPage === 1"
        @click="changePage(currentPage - 1)"
        class="page-btn"
      >
        上一页
        <i class="fas fa-chevron-left"></i>
      </button>
      <span class="page-info">{{ currentPage }} / {{ totalPages }}</span>
      <button 
        :disabled="currentPage === totalPages"
        @click="changePage(currentPage + 1)"
        class="page-btn"
      >
        下一页
        <i class="fas fa-chevron-right"></i>
      </button>
    </div>

    <!-- 无评论提示 -->
    <div v-if="!comments.length && !loading" class="no-comments">
      暂无评论，快来发表第一条评论吧！
    </div>
  </div>
</template>

<script setup>
import { ref, computed, defineProps, onMounted } from 'vue'
import { format} from 'date-fns'
import GlobalMessage from '@/components/Common/CommentMessage.vue'
import commentApi from '@/api/comment'

const props = defineProps({
  forumId: {
    type: [String, Number],
    required: true
  }
})

const messageRef = ref(null)
const comments = ref([])
const total = ref(0)
const currentPage = ref(1)
const loading = ref(false)
const newComment = ref('')
const replyContent = ref('')
const replyingTo = ref(null)
const replyingToReply = ref(null)
const replyToReplyContent = ref('')

const totalPages = computed(() => Math.ceil(total.value / 10))

// 显示消息提示
const showMessage = (content, type) => {
  messageRef.value?.show(content, type)
}

// 格式化时间
const formatTime = (time) => {
  try {
    return format(new Date(time), 'yyyy-MM-dd HH:mm')
  } catch (error) {
    return time
  }
}

// 获取评论列表
const fetchComments = async (page = 1) => {
  loading.value = true
  try {
    const response = await commentApi.getForumComments(props.forumId, page)
    console.log('评论数据:', response)
    if (response.code === 200) {
      comments.value = response.data.comments.map(comment => ({
        ...comment,
        visibleReplies: 3 // 初始化每个评论显示3条回复
      }))
      total.value = response.data.total
    } else {
      showMessage('获取评论失败', 'error')
    }
  } catch (error) {
    console.error('获取评论失败:', error)
    showMessage(error.message || '获取评论失败', 'error')
  } finally {
    loading.value = false
  }
}

// 切换页码
const changePage = (page) => {
  currentPage.value = page
  fetchComments(page)
}

// 处理输入框聚焦
const handleFocus = () => {
  // 这里可以添加登录检查等逻辑
}

// 提交评论
const submitComment = async () => {
  if (!newComment.value.trim()) {
    showMessage('评论内容不能为空', 'warning')
    return
  }

  try {
    const response = await commentApi.postComment(0, props.forumId, newComment.value)
    if (response.code === 200) {
      showMessage('评论发表成功', 'success')
      newComment.value = ''
      fetchComments(currentPage.value)
    } else {
      showMessage(response.message || '评论发表失败', 'error')
    }
  } catch (error) {
    showMessage(error.message || '评论发表失败', 'error')
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
  if (!replyContent.value.trim()) {
    showMessage('回复内容不能为空', 'warning')
    return
  }

  try {
    const response = await commentApi.postComment(2, comment.id, replyContent.value)
    if (response.data) {
      showMessage('回复发表成功', 'success')
      replyContent.value = ''
      replyingTo.value = null
      fetchComments(currentPage.value)
    } else {
      showMessage(response.message || '回复发表失败', 'error')
    }
  } catch (error) {
    showMessage(error.message || '回复发表失败', 'error')
  }
}

// 显示回复的回复输入框
const showReplyToReplyInput = (reply) => {
  replyingToReply.value = reply.id
  replyToReplyContent.value = ''
}

// 取消回复的回复
const cancelReplyToReply = () => {
  replyingToReply.value = null
  replyToReplyContent.value = ''
}

// 提交回复的回复
const submitReplyToReply = async (comment, reply) => {
  if (!replyToReplyContent.value.trim()) {
    showMessage('回复内容不能为空', 'warning')
    return
  }

  try {
    const response = await commentApi.postComment(
      2,
      comment.id,
      `回复 ${reply.username}：${replyToReplyContent.value}`
    )
    if (response.code === 200) {
      showMessage('回复发表成功', 'success')
      replyToReplyContent.value = ''
      replyingToReply.value = null
      fetchComments(currentPage.value)
    } else {
      showMessage(response.message || '回复发表失败', 'error')
    }
  } catch (error) {
    showMessage(error.message || '回复发表失败', 'error')
  }
}

// 点赞/取消点赞
const toggleLike = async (comment) => {
  try {
    const response = await (comment.is_liked 
      ? commentApi.unlikeComment(comment.id) 
      : commentApi.likeComment(comment.id))
    
    if (response.code === 200) {
      comment.is_liked = !comment.is_liked
      comment.liked_count += comment.is_liked ? 1 : -1
      showMessage(comment.is_liked ? '点赞成功' : '已取消点赞', 'success')
    } else {
      showMessage(response.message || '操作失败', 'error')
    }
  } catch (error) {
    showMessage(error.message || '操作失败', 'error')
  }
}

// 展示更多回复
const showMoreReplies = (comment) => {
  comment.visibleReplies = (comment.visibleReplies || 3) + 3
}

// 收起回复
const collapseReplies = (comment) => {
  comment.visibleReplies = 3
}

onMounted(() => {
  fetchComments()
})
</script>

<style scoped>
.comments-section {
  margin-top: 40px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.comments-title {
  padding: 20px;
  font-size: 18px;
  font-weight: 500;
  border-bottom: 1px solid #eee;
  display: flex;
  align-items: center;
  gap: 10px;
}

.comment-count {
  color: #999;
  font-size: 14px;
  font-weight: normal;
}

.comment-input {
  padding: 20px;
  border-bottom: 1px solid #eee;
}

.comment-input textarea {
  width: 100%;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  resize: vertical;
  font-size: 14px;
  line-height: 1.6;
  transition: all 0.3s;
}

.comment-input textarea:focus {
  border-color: #4a90e2;
  outline: none;
  box-shadow: 0 0 0 2px rgba(74, 144, 226, 0.1);
}

.input-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 10px;
}

.tip {
  color: #999;
  font-size: 12px;
}

.submit-btn {
  padding: 6px 16px;
  background: #4a90e2;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s;
}

.submit-btn:hover:not(:disabled) {
  background: #357abd;
}

.submit-btn:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.comments-list {
  padding: 0 20px;
}

.comment-item {
  padding: 20px 0;
  border-bottom: 1px solid #eee;
}

.comment-header {
  margin-bottom: 8px;
}

.username {
  font-weight: 500;
  color: #333;
}

.time {
  margin-left: 10px;
  color: #999;
  font-size: 12px;
}

.comment-content {
  font-size: 14px;
  line-height: 1.6;
  color: #333;
  margin: 8px 0;
}

.comment-actions {
  display: flex;
  gap: 16px;
  margin-top: 8px;
}

.like-btn,
.reply-btn {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 4px 8px;
  background: none;
  border: none;
  color: #666;
  cursor: pointer;
  transition: all 0.3s;
  font-size: 13px;
}

.like-btn:hover,
.reply-btn:hover {
  color: #4a90e2;
}

.like-btn.liked {
  color: #ff4757;
}

.like-btn.liked i {
  animation: heart-beat 0.3s ease;
}

@keyframes heart-beat {
  0% { transform: scale(1); }
  50% { transform: scale(1.2); }
  100% { transform: scale(1); }
}

.replies-list {
  margin-top: 16px;
  margin-left: 24px;
  padding-left: 16px;
  border-left: 2px solid #eee;
}

.reply-item {
  padding: 12px 0;
  border-bottom: 1px solid #f5f5f5;
}

.reply-item:last-child {
  border-bottom: none;
}

.reply-content {
  font-size: 14px;
  line-height: 1.6;
  color: #333;
  margin: 6px 0;
}

.reply-actions {
  display: flex;
  gap: 16px;
}

.reply-input {
  margin-top: 16px;
  padding: 16px;
  background: #f9f9f9;
  border-radius: 4px;
}

.reply-input textarea {
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  resize: vertical;
  font-size: 14px;
  line-height: 1.6;
}

.reply-actions {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  margin-top: 8px;
}

.cancel-btn {
  padding: 6px 12px;
  background: none;
  border: 1px solid #ddd;
  border-radius: 4px;
  cursor: pointer;
  color: #666;
}

.show-more-replies,
.collapse-replies {
  text-align: center;
  margin-top: 12px;
}

.show-more-replies button,
.collapse-replies button {
  padding: 6px 12px;
  background: none;
  border: 1px solid #eee;
  border-radius: 4px;
  color: #666;
  cursor: pointer;
  font-size: 13px;
  transition: all 0.3s;
}

.show-more-replies button:hover,
.collapse-replies button:hover {
  background: #f5f5f5;
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
  gap: 16px;
}

.page-btn {
  padding: 8px 16px;
  background: white;
  border: 1px solid #ddd;
  border-radius: 4px;
  color: #666;
  cursor: pointer;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  gap: 8px;
}

.page-btn:hover:not(:disabled) {
  background: #f5f5f5;
}

.page-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.page-info {
  color: #666;
}

.no-comments {
  padding: 40px;
  text-align: center;
  color: #999;
  font-size: 14px;
}

@media (max-width: 768px) {
  .comments-section {
    margin: 20px 0;
    border-radius: 0;
  }

  .comment-input {
    padding: 15px;
  }

  .comments-list {
    padding: 0 15px;
  }

  .replies-list {
    margin-left: 16px;
    padding-left: 12px;
  }
}
</style>
