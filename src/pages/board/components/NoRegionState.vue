<template>
  <div class="no-region">
    <svg xmlns="http://www.w3.org/2000/svg" width="60" height="60" fill="none" viewBox="0 0 24 24" stroke="currentColor" class="no-region-icon">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
    <h2 class="no-region-title">관심지역을 설정해주세요</h2>
    <p class="no-region-text">관심지역을 설정하면 해당 지역의 게시판을 볼 수 있습니다.</p>
    <button class="add-region-button" @click="$emit('add-region')">
      관심지역 설정하기
    </button>
  </div>
</template>

<script setup>
defineEmits(['add-region']);
</script>

<style scoped>
.no-region {
  text-align: center;
  padding: 3rem 1rem;
  background-color: var(--white);
  border-radius: var(--border-radius);
  border: 1px solid var(--light-gray);
}

.no-region-icon {
  color: var(--primary);
  margin-bottom: 1rem;
}

.no-region-title {
  font-size: 1.25rem;
  font-weight: 600;
  margin: 0 0 0.5rem 0;
  color: var(--dark);
}

.no-region-text {
  color: var(--gray);
  margin: 0 0 1.5rem 0;
}

.add-region-button {
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

.add-region-button:hover {
  background-color: var(--primary-dark);
}
</style>