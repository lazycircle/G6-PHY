<template>
    <div v-if="dialogVisible" class="dialog-overlay">
      <div class="dialog-content">
        <div class="dialog-header">
          <h2>发布文章</h2>
          <button class="close-btn" @click="handleClose">×</button>
        </div>
        
        <div class="publish-container">
          <!-- 文章表单 -->
          <div class="form-section">
            <div class="form-item">
              <label>文章标题</label>
              <input 
                v-model="articleForm.title"
                type="text"
                placeholder="请输入文章标题"
                maxlength="50"
                class="input-field"
              >
              <span class="word-count">{{ articleForm.title.length }}/50</span>
            </div>
            
            <div class="form-item">
              <label>文章内容</label>
              <textarea
                v-model="articleForm.content"
                placeholder="请输入文章内容"
                class="textarea-field"
                rows="10"
              ></textarea>
            </div>
  
            <div class="form-item">
              <label>文章标签 (最多选择3个)</label>
              <div class="tags-selector">
                <span
                  v-for="tag in availableTags"
                  :key="tag"
                  :class="['tag-item', { active: articleForm.tags.includes(tag) }]"
                  @click="toggleTag(tag)"
                >
                  {{ tag }}
                </span>
              </div>
            </div>
          </div>
        </div>
  
        <!-- 底部操作区 -->
        <div class="dialog-footer">
          <div class="selected-tags" v-if="articleForm.tags.length">
            已选标签：{{ articleForm.tags.join('、') }}
          </div>
          <div class="actions">
            <button class="btn btn-cancel" @click="handleClose">取消</button>
            <button
              class="btn btn-submit"
              :disabled="!isFormValid"
              @click="handleSubmit"
            >
              发布文章
            </button>
          </div>
        </div>
  
        <!-- 消息提示 -->
        <div v-if="message.show" :class="['message', message.type]">
          {{ message.text }}
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, computed, watch, defineProps, defineEmits } from 'vue'
  import { useRouter } from 'vue-router'
  import articleApi from '@/api/articleapi'
  
  const props = defineProps({
    visible: Boolean
  })
  
  const emit = defineEmits(['update:visible'])
  const router = useRouter()
  
  const dialogVisible = ref(props.visible)
  const articleForm = ref({
    title: '',
    content: '',
    tags: []
  })
  
  const availableTags = ref(['焦虑', '抑郁', '人际关系', '生活', '成长'])
  const message = ref({ show: false, text: '', type: '' })
  const publishing = ref(false)
  
  // 表单验证
  const isFormValid = computed(() => {
    return articleForm.value.title.trim() && articleForm.value.content.trim()
  })
  
  // 监听visible属性变化
  watch(() => props.visible, (val) => {
    dialogVisible.value = val
  })
  
  // 监听对话框可见性变化
  watch(dialogVisible, (val) => {
    emit('update:visible', val)
    if (!val) {
      resetForm()
    }
  })
  
  // 显示消息提示
  const showMessage = (text, type = 'success') => {
    message.value = { show: true, text, type }
    setTimeout(() => {
      message.value.show = false
    }, 3000)
  }
  
  // 切换标签
  const toggleTag = (tag) => {
    const index = articleForm.value.tags.indexOf(tag)
    if (index === -1) {
      if (articleForm.value.tags.length >= 3) {
        showMessage('最多只能选择3个标签', 'error')
        return
      }
      articleForm.value.tags.push(tag)
    } else {
      articleForm.value.tags.splice(index, 1)
    }
  }
  
  // 重置表单
  const resetForm = () => {
    articleForm.value = {
      title: '',
      content: '',
      tags: []
    }
  }
  
  // 处理关闭
  const handleClose = () => {
    dialogVisible.value = false
  }
  
  // 处理提交
  const handleSubmit = async () => {
    if (!isFormValid.value) return
    
    publishing.value = true
    try {
      const response = await articleApi.publishArticle(articleForm.value)
      if (response.data) {
        showMessage('文章发布成功')
        dialogVisible.value = false
        router.push(`/article/${response.data.article_id}`)
      }
    } catch (error) {
      showMessage(error.message || '发布失败，请重试', 'error')
    } finally {
      publishing.value = false
    }
  }
  </script>
  
  <style scoped>
  .dialog-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
  }
  
  .dialog-content {
    background: white;
    border-radius: 8px;
    width: 90%;
    max-width: 800px;
    max-height: 90vh;
    display: flex;
    flex-direction: column;
  }
  
  .dialog-header {
    padding: 20px;
    border-bottom: 1px solid #eee;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  
  .dialog-header h2 {
    margin: 0;
    font-size: 1.5rem;
    color: #333;
  }
  
  .close-btn {
    background: none;
    border: none;
    font-size: 24px;
    cursor: pointer;
    color: #666;
  }
  
  .publish-container {
    flex: 1;
    overflow-y: auto;
    padding: 20px;
  }
  
  .form-section {
    display: flex;
    flex-direction: column;
    gap: 20px;
  }
  
  .form-item {
    position: relative;
  }
  
  .form-item label {
    display: block;
    margin-bottom: 8px;
    font-weight: 500;
    color: #333;
  }
  
  .input-field {
    width: 100%;
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 1rem;
    transition: border-color 0.3s;
  }
  
  .textarea-field {
    width: 100%;
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 4px;
    resize: vertical;
    min-height: 200px;
    font-size: 1rem;
    line-height: 1.6;
  }
  
  .input-field:focus,
  .textarea-field:focus {
    border-color: #4a90e2;
    outline: none;
  }
  
  .word-count {
    position: absolute;
    right: 10px;
    top: 40px;
    color: #999;
    font-size: 0.9rem;
  }
  
  .tags-selector {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
  }
  
  .tag-item {
    padding: 6px 12px;
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
  
  .dialog-footer {
    padding: 20px;
    border-top: 1px solid #eee;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  
  .selected-tags {
    color: #666;
    font-size: 0.9rem;
  }
  
  .actions {
    display: flex;
    gap: 10px;
  }
  
  .btn {
    padding: 8px 20px;
    border-radius: 4px;
    border: none;
    cursor: pointer;
    font-size: 14px;
    transition: all 0.3s;
  }
  
  .btn-cancel {
    background: #f5f5f5;
    color: #666;
  }
  
  .btn-cancel:hover {
    background: #e8e8e8;
  }
  
  .btn-submit {
    background: #4a90e2;
    color: white;
  }
  
  .btn-submit:hover:not(:disabled) {
    background: #357abd;
  }
  
  .btn-submit:disabled {
    background: #ccc;
    cursor: not-allowed;
  }
  
  .message {
    position: fixed;
    top: 20px;
    left: 50%;
    transform: translateX(-50%);
    padding: 10px 20px;
    border-radius: 4px;
    color: white;
    z-index: 1001;
  }
  
  .message.success {
    background: #67c23a;
  }
  
  .message.error {
    background: #f56c6c;
  }
  </style>