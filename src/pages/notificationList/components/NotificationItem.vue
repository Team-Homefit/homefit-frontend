<template>
  <div class="notification-item" :class="{ 'border-bottom': hasBorder }" @click="$emit('click', notification.id)">
    <div class="notification-content">
      <div class="title-row">
        <h3 class="notification-title">{{ notification.title }}</h3>
        <div class="notification-badges">
          <span v-if="notification.isImportant" class="badge important-badge"> 중요 </span>
          <span v-if="isNew(notification.createdAt)" class="badge new-badge"> NEW </span>
        </div>
      </div>
      <div class="notification-meta">
        <span>{{ formatDate(notification.createdAt) }}</span>
      </div>
    </div>
    <div class="chevron">
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="#6c757d">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
      </svg>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  notification: {
    type: Object,
    required: true,
  },
  hasBorder: {
    type: Boolean,
    default: true,
  },
});

defineEmits(["click"]);

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
.notification-item {
  display: flex;
  align-items: center;
  padding: 1rem;
  cursor: pointer;
  transition: background-color 0.3s ease;
  min-height: 72px; /* 일정한 높이 유지 */
}

.notification-item:hover {
  background-color: var(--light);
}

.border-bottom {
  border-bottom: 1px solid var(--light-gray);
}

.notification-content {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.title-row {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
}

.notification-title {
  font-size: 1rem;
  font-weight: 500;
  margin: 0;
  color: var(--dark);
}

.notification-badges {
  display: flex;
  align-items: center;
  gap: 0.5rem;
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

.notification-meta {
  font-size: 0.75rem;
  color: var(--gray);
}

.chevron {
  margin-left: 0.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--gray);
}
</style>
