<template>
  <div class="floating-write-button-container">
    <button class="floating-write-button" @click="$emit('write')">
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
      </svg>
    </button>
  </div>
</template>

<script setup>
defineEmits(['write']);
</script>

<style scoped>
.floating-write-button-container {
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  z-index: 100;
}

.floating-write-button {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background-color: var(--primary);
  color: var(--white);
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
  cursor: pointer;
  transition: all 0.3s ease;
}

.floating-write-button:hover {
  background-color: var(--primary-dark);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.25);
}

@media (max-width: 768px) {
  .floating-write-button-container {
    bottom: 1.5rem;
    right: 1.5rem;
  }
}
</style>