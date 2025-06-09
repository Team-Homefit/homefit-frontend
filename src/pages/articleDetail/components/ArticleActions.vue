<template>
  <div class="article-actions">
    <div class="like-button-container">
      <button 
        @click="toggleLike" 
        class="like-button"
        :class="{ 'liked': isLiked }"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" :class="{ 'filled': isLiked }">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
        <span>좋아요 {{ likeCount }}</span>
      </button>
    </div>
    
    <div class="action-buttons">
      <button v-if="!isAuthor" @click="$emit('report')" class="action-button report-button">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
        <span class="report-text">신고하기</span>
      </button>
      
      <template v-else>
        <button @click="$emit('edit')" class="action-button edit-button">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
          <span>수정하기</span>
        </button>
        
        <button @click="$emit('delete')" class="action-button delete-button">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
          <span>삭제하기</span>
        </button>
      </template>
    </div>
  </div>
</template>

<script setup>
import { ref, defineProps, defineEmits } from 'vue';

const props = defineProps({
  isAuthor: {
    type: Boolean,
    default: false
  },
  initialLikeCount: {
    type: Number,
    default: 0
  },
  initialLiked: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['edit', 'delete', 'report', 'like', 'unlike']);

// 좋아요 상태 관리
const isLiked = ref(props.initialLiked);
const likeCount = ref(props.initialLikeCount);

// 좋아요 토글 함수
const toggleLike = () => {
  if (isLiked.value) {
    isLiked.value = false;
    likeCount.value--;
    emit('unlike');
  } else {
    isLiked.value = true;
    likeCount.value++;
    emit('like');
  }
};
</script>

<style scoped>
.article-actions {
  margin-bottom: 2rem;
  border-bottom: 1px solid var(--light-gray);
  padding-bottom: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.like-button-container {
  display: flex;
  align-items: center;
}

.like-button {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border-radius: var(--border-radius);
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 1px solid var(--light-gray);
  background-color: var(--white);
  color: var(--gray);
}

.like-button:hover {
  background-color: var(--light);
  border-color: var(--primary-light);
  color: var(--primary);
}

.like-button.liked {
  background-color: var(--primary-background);
  border-color: var(--primary);
  color: var(--primary);
}

.like-button svg {
  transition: all 0.3s ease;
}

.like-button svg.filled {
  fill: var(--primary);
  stroke: var(--primary);
}

.action-buttons {
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
}

.action-button {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.5rem 0.75rem;
  border-radius: var(--border-radius);
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 1px solid var(--light-gray);
}

.report-button {
  background-color: var(--white);
  color: var(--gray);
}

.report-button:hover {
  background-color: var(--light);
  color: var(--dark);
}

.report-button .report-text {
  position: relative;
  top: -2px;
}

.edit-button {
  background-color: var(--white);
  color: var(--primary);
  border-color: var(--primary-light);
}

.edit-button:hover {
  background-color: var(--primary-background);
}

.delete-button {
  background-color: var(--white);
  color: var(--error);
  border-color: var(--error-light);
}

.delete-button:hover {
  background-color: var(--error-background);
}

@media (max-width: 576px) {
  .article-actions {
    flex-direction: column;
    gap: 1rem;
    align-items: stretch;
  }
  
  .like-button-container {
    justify-content: center;
  }
  
  .like-button {
    width: 100%;
    justify-content: center;
  }
  
  .action-buttons {
    flex-wrap: wrap;
  }
  
  .action-button {
    flex: 1;
    justify-content: center;
  }
}
</style>