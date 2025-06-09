<template>
  <div class="loading-page">
    <div class="loading-container">
      <div class="spinner"></div>
      <p class="loading-text">{{ text }}</p>
    </div>
  </div>
</template>

<script setup>
defineProps({
  text: {
    type: String,
    default: '로딩 중...'
  }
});
</script>

<style scoped>
.loading-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--white);
}

.loading-container {
  text-align: center;
}

.spinner {
  width: 50px;
  height: 50px;
  border: 4px solid var(--primary-background);
  border-top: 4px solid var(--primary);
  border-radius: 50%;
  margin: 0 auto 1rem;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.loading-text {
  font-size: 1rem;
  color: var(--gray);
  margin: 0;
}
</style>