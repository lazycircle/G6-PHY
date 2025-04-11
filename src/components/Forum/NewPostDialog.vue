<template>
  <div class="dialog-overlay" v-if="modelValue" @click="closeDialog">
    <div class="dialog-content" @click.stop>
      <div class="dialog-header">
        <h2>发布新帖子</h2>
        <button class="close-btn" @click="closeDialog">×</button>
      </div>
      
      <div class="dialog-body">
        <div class="form-group">
          <label>标题</label>
          <input 
            v-model="formData.title" 
            type="text" 
            placeholder="请输入帖子标题"
            :class="{ 'error': errors.title }"
          >
          <span class="error-text" v-if="errors.title">{{ errors.title }}</span>
        </div>

        <div class="form-group">
          <label>内容</label>
          <textarea 
            v-model="formData.content" 
            placeholder="请输入帖子内容"
            rows="6"
            :class="{ 'error': errors.content }"
          ></textarea>
          <span class="error-text" v-if="errors.content">{{ errors.content }}</span>
        </div>

        <div class="form-group">
          <label>标签 (最多选择3个)</label>
          <div class="tags-container">
            <div 
              v-for="tag in availableTags" 
              :key="tag.id"
              :class="['tag-item', { active: selectedTags.includes(tag.id) }]"
              @click="toggleTag(tag.id)"
            >
              {{ tag.name }}
            </div>
          </div>
          <span class="error-text" v-if="errors.tags">{{ errors.tags }}</span>
        </div>
      </div>

      <div class="dialog-footer">
        <button class="cancel-btn" @click="closeDialog">取消</button>
        <button class="submit-btn" @click="handleSubmit" :disabled="isSubmitting">
          {{ isSubmitting ? '发布中...' : '发布' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, reactive } from 'vue';
import { createForum } from '@/api/forum';

export default {
  name: 'NewPostDialog',
  props: {
    modelValue: {
      type: Boolean,
      required: true
    }
  },
  emits: ['update:modelValue', 'created'],
  setup(props, { emit }) {
    const formData = reactive({
      title: '',
      content: '',
    });

    const selectedTags = ref([]);
    const errors = reactive({
      title: '',
      content: '',
      tags: ''
    });
    const isSubmitting = ref(false);

    const availableTags = [
      { id: 95, name: '焦虑' },
      { id: 38, name: '就业' },
      { id: 36, name: '职场' },
      { id: 42, name: '学习' },
      { id: 55, name: '压力' },
      { id: 66, name: '恋爱' },
      { id: 77, name: '家庭' },
      { id: 88, name: '社交' },
      { id: 99, name: '抑郁' },
      { id: 100, name: '升学' }
    ];

    const validateForm = () => {
      let isValid = true;
      errors.title = '';
      errors.content = '';
      errors.tags = '';

      if (!formData.title.trim()) {
        errors.title = '请输入标题';
        isValid = false;
      }

      if (!formData.content.trim()) {
        errors.content = '请输入内容';
        isValid = false;
      }

      if (selectedTags.value.length === 0) {
        errors.tags = '请至少选择一个标签';
        isValid = false;
      }

      if (selectedTags.value.length > 3) {
        errors.tags = '最多只能选择3个标签';
        isValid = false;
      }

      return isValid;
    };

    const toggleTag = (tagId) => {
      const index = selectedTags.value.indexOf(tagId);
      if (index === -1) {
        if (selectedTags.value.length < 3) {
          selectedTags.value.push(tagId);
        }
      } else {
        selectedTags.value.splice(index, 1);
      }
    };

    const handleSubmit = async () => {
      if (!validateForm()) return;

      isSubmitting.value = true;
      try {
        const response = await createForum({
          title: formData.title,
          content: formData.content,
          tags: selectedTags.value
        });
        
        emit('created', response.data.data);
        closeDialog();
      } catch (error) {
        console.error('发布帖子失败:', error);
        // 可以添加错误提示
      } finally {
        isSubmitting.value = false;
      }
    };

    const closeDialog = () => {
      emit('update:modelValue', false);
      // 重置表单
      formData.title = '';
      formData.content = '';
      selectedTags.value = [];
      Object.keys(errors).forEach(key => errors[key] = '');
    };

    return {
      formData,
      selectedTags,
      availableTags,
      errors,
      isSubmitting,
      toggleTag,
      handleSubmit,
      closeDialog
    };
  }
};
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
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
}

.dialog-header {
  padding: 1rem 1.5rem;
  border-bottom: 1px solid #eee;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.dialog-header h2 {
  margin: 0;
  font-size: 1.25rem;
  color: #333;
}

.close-btn {
  background: none;
  border: none;
  font-size: 1.5rem;
  color: #666;
  cursor: pointer;
}

.dialog-body {
  padding: 1.5rem;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  color: #333;
  font-weight: 500;
}

input, textarea {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
}

input.error, textarea.error {
  border-color: #ff4d4f;
}

.error-text {
  color: #ff4d4f;
  font-size: 0.875rem;
  margin-top: 0.25rem;
}

.tags-container {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 0.5rem;
}

.tag-item {
  padding: 0.5rem 1rem;
  background: #f0f0f0;
  border-radius: 16px;
  cursor: pointer;
  transition: all 0.2s;
}

.tag-item.active {
  background: #4a90e2;
  color: white;
}

.dialog-footer {
  padding: 1rem 1.5rem;
  border-top: 1px solid #eee;
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
}

.cancel-btn, .submit-btn {
  padding: 0.5rem 1.5rem;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
  transition: all 0.2s;
}

.cancel-btn {
  background: white;
  border: 1px solid #ddd;
  color: #666;
}

.submit-btn {
  background: #4a90e2;
  border: none;
  color: white;
}

.submit-btn:hover {
  background: #357abd;
}

.submit-btn:disabled {
  background: #ccc;
  cursor: not-allowed;
}
</style> 