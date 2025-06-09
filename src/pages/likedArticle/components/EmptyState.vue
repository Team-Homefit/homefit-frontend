<template>
  <div class="empty-state">
    <div class="empty-icon">
      <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
      </svg>
    </div>
    <h3 class="empty-title">{{ message }}</h3>
    <p class="empty-description">{{ subMessage }}</p>
    <button 
      v-if="showButton" 
      @click="$emit('button-click')" 
      class="action-button"
    >
      {{ buttonText }}
    </button>
  </div>
</template>

<script setup>
defineProps({
  message: {
    type: String,
    default: '좋아요한 게시글이 없습니다'
  },
  subMessage: {
    type: String,
    default: '관심 있는 게시글에 좋아요를 눌러보세요'
  },
  showButton: {
    type: Boolean,
    default: true
  },
  buttonText: {
    type: String,
    default: '게시판 둘러보기'
  }
});

defineEmits(['button-click']);
</script>

<style scoped>
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem 1rem;
  text-align: center;
}

.empty-icon {
  color: var(--light-gray);
  margin-bottom: 1.5rem;
}

.empty-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--dark);
  margin: 0 0 0.5rem 0;
}

.empty-description {
  font-size: 0.875rem;
  color: var(--gray);
  margin: 0 0 1.5rem 0;
  line-height: 1.5;
}

.action-button {
  background-color: var(--primary);
  color: var(--white);
  border: none;
  border-radius: var(--border-radius);
  padding: 0.75rem 1.5rem;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.action-button:hover {
  background-color: var(--primary-dark);
}

@media (max-width: 576px) {
  .empty-state {
    padding: 2rem 1rem;
  }
  
  .empty-icon {
    margin-bottom: 1rem;
  }
  
  .empty-title {
    font-size: 1rem;
  }
}
</style>