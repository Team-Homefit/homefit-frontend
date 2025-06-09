<template>
  <div class="error-page">
    <div class="error-container">
      <div class="error-icon">
        <svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      </div>
      <h1 class="error-title">{{ props.title }}</h1>
      <p class="error-message">{{ props.message }}</p>
      <button @click="handleAction" class="action-button">
        {{ props.actionText }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { defineProps } from 'vue';
import { useRouter } from 'vue-router';
const router = useRouter();

const props = defineProps({
  title: {
    type: String,
    default: '오류가 발생했습니다'
  },
  message: {
    type: String,
    default: '페이지를 불러오는 중 문제가 발생했습니다. 다시 시도해주세요.'
  },
  actionText: {
    type: String,
    default: '홈으로 돌아가기'
  }
});

console.log(props.title);
const handleAction = () => {
  router.push('/');
};
</script>

<style scoped>
.error-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--white);
  padding: 1rem;
}

.error-container {
  max-width: 500px;
  text-align: center;
  padding: 2rem;
}

.error-icon {
  color: var(--orange);
  margin-bottom: 1.5rem;
}

.error-title {
  font-size: 1.5rem;
  font-weight: 600;
  margin: 0 0 1rem 0;
  color: var(--dark);
}

.error-message {
  font-size: 1rem;
  margin: 0 0 2rem 0;
  color: var(--gray);
  line-height: 1.6;
}

.action-button {
  background-color: var(--primary);
  color: var(--white);
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 50rem;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.action-button:hover {
  background-color: var(--primary-dark);
}
</style>