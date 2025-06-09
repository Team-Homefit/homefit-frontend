<template>
  <div class="notification-content">
    <div class="title-section">
      <div class="badges">
        <span v-if="notification.isImportant" class="badge important-badge">중요</span>
        <span v-if="isNew(notification.createdAt)" class="badge new-badge">NEW</span>
      </div>
      
      <h2 class="notification-title">{{ notification.title }}</h2>
      
      <div class="notification-meta">
        <div class="meta-item">
          <i class="bi bi-calendar3"></i>
          <span>{{ formatDate(notification.createdAt) }}</span>
        </div>
        
        <div v-if="notification.viewCount" class="meta-item">
          <i class="bi bi-eye"></i>
          <span>{{ notification.viewCount }}</span>
        </div>
      </div>
    </div>
    
    <div class="notification-body">
      {{ notification.content }}
    </div>
  </div>
</template>

<script setup>
import { defineProps } from 'vue';

const props = defineProps({
  notification: {
    type: Object,
    required: true
  }
});

// 날짜 포맷팅
const formatDate = (dateString) => {
  if (!dateString) return '';
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      console.error('잘못된 날짜 형식:', dateString);
      return dateString;
    }
    return new Intl.DateTimeFormat("ko-KR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  } catch (error) {
    console.error('날짜 포맷팅 에러:', error);
    return dateString;
  }
};

// 새 공지사항 여부 확인
const isNew = (dateString) => {
  if (!dateString) return false;
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      console.error('잘못된 날짜 형식:', dateString);
      return false;
    }
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 7;
  } catch (error) {
    console.error('날짜 비교 에러:', error);
    return false;
  }
};
</script>

<style scoped>
.notification-content {
  background-color: var(--white);
  border-radius: var(--border-radius);
  box-shadow: var(--shadow);
  padding: 1.5rem;
  margin-bottom: 1.5rem;
}

.title-section {
  margin-bottom: 1.5rem;
}

.badges {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 0.75rem;
}

.badge {
  font-size: 0.75rem;
  font-weight: 500;
  padding: 0.25rem 0.5rem;
  border-radius: 50rem;
  white-space: nowrap;
}

.important-badge {
  background-color: var(--orangeBackground);
  color: var(--orange);
}

.new-badge {
  background-color: var(--primary-background);
  color: var(--primary);
}

.notification-title {
  font-size: 1.25rem;
  font-weight: 600;
  margin: 0 0 0.75rem 0;
  color: var(--dark);
  line-height: 1.4;
}

.notification-meta {
  display: flex;
  align-items: center;
  gap: 1rem;
  font-size: 0.875rem;
  color: var(--gray);
  padding-bottom: 1rem;
  border-bottom: 1px solid var(--light-gray);
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.notification-body {
  font-size: 1rem;
  line-height: 1.6;
  color: var(--dark);
  white-space: pre-line;
}

@media (max-width: 768px) {
  .notification-content {
    padding: 1.25rem;
  }
  
  .notification-title {
    font-size: 1.125rem;
  }
  
  .notification-meta {
    flex-wrap: wrap;
    gap: 0.75rem;
  }
}
</style>