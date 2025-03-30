<template>
  <router-link :to="`/consultation/book/${consultant.id}`" class="consultant-card">
    <div class="consultant-info">
      <h3 class="consultant-name">{{ consultant.username }}</h3>
      <p class="consultant-profile">{{ consultant.profile }}</p>
    </div>
    <div class="consultant-tags">
      <span v-for="tag in consultant.tags" 
            :key="tag" 
            class="tag">
        {{ tag }}
      </span>
    </div>
  </router-link>
</template>

<script>
export default {
  name: 'ConsultantCard',
  props: {
    consultant: {
      type: Object,
      required: true
    }
  }
}
</script>

<style scoped>
.consultant-card {
  background: white;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  transition: transform 0.2s, box-shadow 0.2s;
  text-decoration: none;
  color: inherit;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.consultant-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
}

.consultant-info {
  flex: 1;
}

.consultant-name {
  font-size: 1.25rem;
  color: #333;
  margin: 0 0 0.5rem 0;
}

.consultant-profile {
  color: #666;
  font-size: 0.9rem;
  margin: 0;
  line-height: 1.4;
}

.consultant-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.tag {
  background: #f0f7ff;
  color: #4a90e2;
  padding: 4px 12px;
  border-radius: 16px;
  font-size: 0.85rem;
}
</style> 