<template>
  <div class="button-group">
    <button 
      type="button" 
      @click="$emit('cancel')" 
      class="cancel-button"
    >
      취소
    </button>
    <button 
      type="button"
      @click="$emit('submit')" 
      class="submit-button"
      :disabled="!isFormValid || isSubmitting"
    >
      {{ isSubmitting ? '처리 중...' : buttonText }}
    </button>
  </div>
</template>

<script setup>
defineProps({
  isSubmitting: {
    type: Boolean,
    default: false
  },
  isFormValid: {
    type: Boolean,
    default: false
  },
  buttonText: {
    type: String,
    required: true
  }
});

defineEmits(['cancel', 'submit']);
</script>

<style scoped>
.button-group {
  display: flex;
  gap: 0.75rem;
  margin-top: 1rem;
}

.cancel-button,
.submit-button {
  flex: 1;
  padding: 0.875rem;
  border-radius: var(--border-radius);
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  text-align: center;
}

.cancel-button {
  background-color: var(--white);
  color: var(--gray);
  border: 1px solid var(--light-gray);
}

.cancel-button:hover {
  background-color: var(--light);
}

.submit-button {
  background-color: var(--primary);
  color: var(--white);
  border: none;
}

.submit-button:hover:not(:disabled) {
  background-color: var(--primary-dark);
}

.submit-button:disabled {
  background-color: var(--light-gray);
  cursor: not-allowed;
}

@media (max-width: 576px) {
  .button-group {
    flex-direction: column;
  }
}
</style>