<template>
  <div class="reply-item">
    <div class="reply-header">
      <div class="author-info">
        <span class="author-name">{{ reply.nickname }}</span>
        <span class="reply-date">{{ formatDate(reply.commentCreatedAt) }}</span>
      </div>
      <div v-if="!reply.isDeleted" class="reply-actions">
        <button 
          v-if="isAuthor" 
          @click="$emit('delete-comment', reply.commentId)" 
          class="action-link delete-link"
        >
          삭제
        </button>
        <button 
          v-else 
          @click="$emit('report-comment', reply.commentId)" 
          class="action-link"
        >
          신고
        </button>
      </div>
    </div>
    
    <div class="reply-content" :class="{ 'deleted': reply.isDeleted }">
      {{ reply.isDeleted ? '삭제된 댓글입니다.' : reply.commentContent }}
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  reply: {
    type: Object,
    required: true
  },
  currentUserId: {
    type: Number,
    required: true
  }
});

defineEmits(['report-comment', 'delete-comment']);

// 작성자인지 여부 확인
const isAuthor = computed(() => {
  return Number(props.currentUserId) === props.reply.commentWriterId;
});

// 날짜 포맷 함수
const formatDate = (dateString) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now - date;
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);
  
  if (diffSec < 60) {
    return '방금 전';
  } else if (diffMin < 60) {
    return `${diffMin}분 전`;
  } else if (diffHour < 24) {
    return `${diffHour}시간 전`;
  } else if (diffDay < 7) {
    return `${diffDay}일 전`;
  } else {
    return `${date.getFullYear()}.${date.getMonth() + 1}.${date.getDate()}`;
  }
};
</script>

<style scoped>
.reply-item {
  padding: 0.75rem 0;
  border-bottom: 1px solid var(--light-gray);
}

.reply-item:last-child {
  border-bottom: none;
}

.reply-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

.author-info {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.author-name {
  font-weight: 500;
  font-size: 0.875rem;
  color: var(--dark);
}

.reply-date {
  font-size: 0.75rem;
  color: var(--gray);
}

.reply-actions {
  display: flex;
  gap: 0.75rem;
}

.action-link {
  background: none;
  border: none;
  padding: 0;
  font-size: 0.75rem;
  color: var(--gray);
  cursor: pointer;
}

.action-link:hover {
  color: var(--primary);
  text-decoration: underline;
}

.delete-link {
  color: var(--error);
}

.delete-link:hover {
  color: var(--error);
}

.reply-content {
  font-size: 0.875rem;
  line-height: 1.5;
  color: var(--dark);
  word-break: keep-all;
  overflow-wrap: break-word;
}

.deleted {
  color: var(--gray);
  font-style: italic;
}
</style>