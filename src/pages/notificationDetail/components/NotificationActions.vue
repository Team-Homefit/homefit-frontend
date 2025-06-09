<template>
  <div class="notification-actions">
    <button @click="$emit('edit')" class="action-button edit-button">
      <i class="bi bi-pencil-square"></i>
      <span>수정</span>
    </button>
    
    <button @click="$emit('delete')" class="action-button delete-button">
      <i class="bi bi-trash"></i>
      <span>삭제</span>
    </button>
  </div>
</template>

<script setup>
defineEmits(['edit', 'delete']);
</script>

<style scoped>
.notification-actions {
  display: flex;
  gap: 0.75rem;
}

.action-button {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.625rem 1.25rem;
  border-radius: var(--border-radius);
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.edit-button {
  background-color: var(--white);
  color: var(--primary);
  border: 1px solid var(--primary);
}

.edit-button:hover {
  background-color: var(--primary-background);
}

.delete-button {
  background-color: var(--white);
  color: var(--error);
  border: 1px solid var(--error);
}

.delete-button:hover {
  background-color: var(--error-background);
}

@media (max-width: 576px) {
  .notification-actions {
    width: 100%;
  }
  
  .action-button {
    flex: 1;
  }
}
</style>