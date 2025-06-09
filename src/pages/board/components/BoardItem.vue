<template>
  <div 
    class="board-item"
    :class="{ 'border-bottom': hasBorder }"
    @click="$emit('click', board.id)"
  >
    <div class="board-content">
      <div class="title-row">
        <h3 class="board-title">{{ board.title }}</h3>
      </div>
      <div class="board-meta">
        <span class="author">{{ board.nickname }}</span>
        <span class="date">{{ formatDate(board.date) }}</span>
        <div class="stats">
          <span class="view-count">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            <span>{{ board.viewCount }}</span>
          </span>

          <span class="comment-count">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" class="icon">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            {{ board.commentCount }}
          </span>
          <span class="like-count" :class="{ liked: isLiked }">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              :fill="isLiked ? '#ff4d4f' : 'none'"
              viewBox="0 0 24 24"
              :stroke="isLiked ? '#ff4d4f' : 'currentColor'"
              class="icon"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              />
            </svg>
            {{ board.likeCount }}
          </span>
        </div>
      </div>
    </div>
    <div class="chevron">
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
      </svg>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue';

const props = defineProps({
  board: {
    type: Object,
    required: true
  },
  hasBorder: {
    type: Boolean,
    default: true
  },
});

onMounted(() => {
  console.log(props.board);
});

defineEmits(['click']);

const formatDate = (date) => {
  return new Intl.DateTimeFormat('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  }).format(date);
};

const isLiked = computed(() => props.board.isLiked);
</script>

<style scoped>
.board-item {
  display: flex;
  align-items: center;
  padding: 1.2rem;
  cursor: pointer;
  transition: background-color 0.3s ease;
  min-height: 72px;
  background-color: var(--white);
}

.board-item:hover {
  background-color: var(--light);
}

.border-bottom {
  border-bottom: 1px solid var(--light-gray);
}

.board-content {
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

.board-title {
  font-size: 1rem;
  font-weight: 500;
  margin: 0;
  color: var(--dark);
}

.board-meta {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.75rem;
  font-size: 0.75rem;
  color: var(--gray);
}

.author {
  font-weight: 500;
}

.stats {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.view-count, .comment-count, .like-count {
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.icon {
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