<template>
  <div class="empty-state">
    <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" fill="none" viewBox="0 0 24 24" stroke="currentColor" class="empty-icon">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1M19 20a2 2 0 002-2V8a2 2 0 00-2-2h-5M5 14h5m5 0h5" />
    </svg>
    <p class="empty-text">등록된 게시글이 없습니다</p>
    <button class="write-button" @click="$emit('write')">
      첫 게시글 작성하기
    </button>
  </div>
</template>

<script setup>
defineEmits(['write']);
</script>

<style scoped>
.empty-state {
  text-align: center;
  padding: 3rem 0;
  background-color: var(--white);
  border-radius: var(--border-radius);
  border: 1px solid var(--light-gray);
  margin-top: 1rem;
}

.empty-icon {
  margin-bottom: 0.5rem;
  color: var(--gray);
}

.empty-text {
  color: var(--gray);
  margin: 0 0 1rem 0;
}

.write-button {
  background-color: var(--primary);
  color: var(--white);
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 50rem;
  font-size: 0.875rem;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.write-button:hover {
  background-color: var(--primary-dark);
}
</style>