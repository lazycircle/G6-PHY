<!-- 评论区组件 -->
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
    <p>hello</p>
    <!-- 评论列表 -->
    <div class="comments-list" v-if="comments.length">
      
      <div v-for="comment in comments.slice(0, visibleComments)" :key="comment.id" class="comment-item">
        
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
          <div v-for="reply in comment.reply.slice(0, comment.visibleReplies || 2)" :key="reply.id" class="reply-item">
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
          <div v-if="comment.reply.length > (comment.visibleReplies || 2)" class="show-more-replies">
            <button @click="() => { comment.visibleReplies = (comment.visibleReplies || 2) + 2; }">
              查看更多回复
            </button>
          </div>
          
          <!-- 收起回复的按钮 -->
          <div v-if="(comment.visibleReplies || 2) > 2" class="collapse-replies">
            <button @click="() => { comment.visibleReplies = 2; }">
              收起
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- 展示更多评论的按钮 -->
    <div v-if="comments.length > visibleComments" class="show-more-comments">
      <button @click="loadMoreComments">
        查看更多评论
      </button>
    </div>

    <!-- 收起评论的按钮 -->
    <div v-if="visibleComments > 3" class="collapse-comments">
      <button @click="collapseComments">
        收起
      </button>
    </div>

    <!-- 无评论提示 -->
    <div v-if="!comments.length && !loading" class="no-comments">
      暂无评论，快来发表第一条评论吧！
    </div>
  </div>
</template>

<script setup>
import { ref, defineProps, onMounted } from 'vue'
import { format } from 'date-fns'
import commentApi from '@/api/comment'
import GlobalMessage from '@/components/Common/CommentMessage.vue'

const props = defineProps({
  articleId: {
    type: [String, Number],
    required: true
  }
})

const messageRef = ref(null)
const comments = ref([])
const total = ref(0)
const loading = ref(false)
const newComment = ref('')
const replyContent = ref('')
const replyingTo = ref(null)
const replyingToReply = ref(null)
const replyToReplyContent = ref('')

// 初始化可见评论和回复数量
const visibleComments = ref(3); // 初始显示3条评论

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
const fetchComments = async () => {
  loading.value = true;
  try {
    const response = await commentApi.getComments(props.articleId);
    console.log('Comments response:', response);
    if (response.data) {
      comments.value = response.data.comments.map(comment => ({
        ...comment,
        visibleReplies: 2 // 初始化每个评论显示2条回复
      }));
      total.value = response.data.total;
    } else {
      showMessage(response.message || '获取评论失败', 'error');
      comments.value = [];
      total.value = 0;
    }
  } catch (error) {
    console.error('Error fetching comments:', error);
    showMessage(error.message || '获取评论失败', 'error');
    comments.value = [];
    total.value = 0;
  } finally {
    loading.value = false;
  }
};

// 加载更多评论
const loadMoreComments = () => {
  visibleComments.value += 3;
};

// 收起评论
const collapseComments = () => {
  visibleComments.value = 3;
};

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
  
  // 创建临时评论对象
  const tempComment = {
    id: Date.now(), // 临时ID
    user_id: localStorage.getItem('id'),
    username: localStorage.getItem('username'),
    content: newComment.value,
    time: new Date().toISOString(),
    is_liked: false,
    liked_count: 0,
    reply_count: 0,
    reply: []
  }

  // 乐观更新：立即添加到评论列表
  comments.value.unshift(tempComment)
  total.value++
  newComment.value = '' // 清空输入框

  try {
    const response = await commentApi.commentArticle(props.articleId, tempComment.content)
    if (response.data) {
      showMessage('评论发表成功', 'success')
      // 使用真实数据替换临时评论
      const realComment = {
        ...tempComment,
        id: response.data.comment_id,
        time: response.data.create_time
      }
      const index = comments.value.findIndex(c => c.id === tempComment.id)
      if (index !== -1) {
        comments.value[index] = realComment
      }
    } else {
      // 如果失败，移除临时评论
      const index = comments.value.findIndex(c => c.id === tempComment.id)
      if (index !== -1) {
        comments.value.splice(index, 1)
      }
      total.value--
      showMessage(response.message || '评论发表失败', 'error')
    }
  } catch (error) {
    // 如果失败，移除临时评论
    const index = comments.value.findIndex(c => c.id === tempComment.id)
    if (index !== -1) {
      comments.value.splice(index, 1)
    }
    total.value--
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
  
  // 创建临时回复对象
  const tempReply = {
    id: Date.now(), // 临时ID
    user_id: localStorage.getItem('id'),
    username: localStorage.getItem('username'),
    content: `回复 ${comment.username}:${replyContent.value}`,
    time: new Date().toISOString(),
    is_liked: false,
    liked_count: 0
  }

  // 乐观更新：立即添加到回复列表
  if (!comment.reply) {
    comment.reply = []
  }
  comment.reply.push(tempReply)
  comment.reply_count++

  replyingTo.value = null // 关闭回复框

  try {
    const response = await commentApi.replyComment(comment.id, `回复 ${comment.username}：${replyContent.value}`)
    if (response.data) {
      showMessage('回复发表成功', 'success')
      replyContent.value = '' // 清空输入框
      // 使用真实数据替换临时回复
      const realReply = {
        ...tempReply,
        id: response.data.comment_id,
        time: response.data.create_time
      }
      const index = comment.reply.findIndex(r => r.id === tempReply.id)
      if (index !== -1) {
        comment.reply[index] = realReply
      }
    } else {
      // 如果失败，移除临时回复
      const index = comment.reply.findIndex(r => r.id === tempReply.id)
      if (index !== -1) {
        comment.reply.splice(index, 1)
      }
      comment.reply_count--
      showMessage(response.message || '回复发表失败', 'error')
    }
  } catch (error) {
    // 如果失败，移除临时回复
    const index = comment.reply.findIndex(r => r.id === tempReply.id)
    if (index !== -1) {
      comment.reply.splice(index, 1)
    }
    comment.reply_count--
    showMessage(error.message || '回复发表失败', 'error')
  }
}

// 点赞/取消点赞
const toggleLike = async (comment) => {
  // 保存原始状态，用于回滚
  const originalLikedCount = comment.liked_count
  const originalIsLiked = comment.is_liked
  
  // 乐观更新UI
  comment.liked_count = comment.is_liked ? 
    comment.liked_count - 1 : 
    comment.liked_count + 1
  comment.is_liked = !comment.is_liked

  try {
    const response = await commentApi.toggleCommentLike(comment.id)
    if (response.data) {
      // 使用服务器返回的实际数据更新状态
      comment.liked_count = response.data.liked_count
      comment.is_liked = response.data.is_liked
      showMessage(comment.is_liked ? '点赞成功' : '已取消点赞', 'success')
    }
  } catch (error) {
    // 发生错误时回滚到原始状态
    comment.liked_count = originalLikedCount
    comment.is_liked = originalIsLiked
    showMessage(error.message || '操作失败', 'error')
  }
}

// 显示回复输入框
const showReplyToReplyInput = (reply) => {
  replyingToReply.value = reply.id
  replyToReplyContent.value = ''
}

// 取消回复
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
  
  // 创建临时回复对象
  const tempReply = {
    id: Date.now(), // 临时ID
    user_id: localStorage.getItem('id'),
    username: localStorage.getItem('username'),
    content: `回复 ${reply.username}：${replyToReplyContent.value}`,
    time: new Date().toISOString(),
    is_liked: false,
    liked_count: 0
  }

  // 乐观更新：立即添加到评论的回复列表
  if (!comment.reply) {
    comment.reply = []
  }
  comment.reply.push(tempReply)
  comment.reply_count++
  
  replyToReplyContent.value = '' // 清空输入框
  replyingToReply.value = null // 关闭回复框

  try {
    const response = await commentApi.replyComment(comment.id, `回复 ${reply.username}：${replyToReplyContent.value}`)
    if (response.data) {
      showMessage('回复发表成功', 'success')
      // 使用真实数据替换临时回复
      const realReply = {
        ...tempReply,
        id: response.data.comment_id,
        time: response.data.create_time
      }
      const index = comment.reply.findIndex(r => r.id === tempReply.id)
      if (index !== -1) {
        comment.reply[index] = realReply
      }
    } else {
      // 如果失败，移除临时回复
      const index = comment.reply.findIndex(r => r.id === tempReply.id)
      if (index !== -1) {
        comment.reply.splice(index, 1)
      }
      comment.reply_count--
      showMessage(response.message || '回复发表失败', 'error')
    }
  } catch (error) {
    // 如果失败，移除临时回复
    const index = comment.reply.findIndex(r => r.id === tempReply.id)
    if (index !== -1) {
      comment.reply.splice(index, 1)
    }
    comment.reply_count--
    showMessage(error.message || '回复发表失败', 'error')
  }
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

.comment-item:last-child {
  border-bottom: none;
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

.show-more-replies {
  margin-top: 12px;
  text-align: center;
}

.show-more-replies button {
  padding: 6px 12px;
  background: none;
  border: 1px solid #eee;
  border-radius: 4px;
  color: #666;
  cursor: pointer;
  font-size: 13px;
}

.show-more-replies button:hover {
  background: #f5f5f5;
}

.load-more {
  padding: 20px;
  text-align: center;
}

.load-more button {
  padding: 8px 24px;
  background: none;
  border: 1px solid #ddd;
  border-radius: 4px;
  color: #666;
  cursor: pointer;
  transition: all 0.3s;
}

.load-more button:hover:not(:disabled) {
  background: #f5f5f5;
}

.load-more button:disabled {
  cursor: not-allowed;
  opacity: 0.6;
}

.no-comments {
  padding: 40px;
  text-align: center;
  color: #999;
  font-size: 14px;
}

.show-more-comments {
  padding: 20px;
  text-align: center;
}

.show-more-comments button {
  padding: 8px 24px;
  background: none;
  border: 1px solid #ddd;
  border-radius: 4px;
  color: #666;
  cursor: pointer;
  transition: all 0.3s;
}

.show-more-comments button:hover:not(:disabled) {
  background: #f5f5f5;
}

.collapse-comments {
  padding: 20px;
  text-align: center;
}

.collapse-comments button {
  padding: 8px 24px;
  background: none;
  border: 1px solid #ddd;
  border-radius: 4px;
  color: #666;
  cursor: pointer;
  transition: all 0.3s;
}

.collapse-comments button:hover:not(:disabled) {
  background: #f5f5f5;
}

.pagination {
  padding: 20px;
  text-align: center;
}

.pagination button {
  padding: 8px 24px;
  background: none;
  border: 1px solid #ddd;
  border-radius: 4px;
  color: #666;
  cursor: pointer;
  transition: all 0.3s;
}

.pagination button:hover:not(:disabled) {
  background: #f5f5f5;
}

.pagination button:disabled {
  cursor: not-allowed;
  opacity: 0.6;
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