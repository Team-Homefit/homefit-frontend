<template>
  <div class="comment-form">
    <textarea 
      v-model="content" 
      class="comment-textarea" 
      :placeholder="placeholder"
      rows="3"
      maxlength="500"
    ></textarea>
    <div class="form-footer">
      <div class="character-count">{{ content.length }}/500</div>
      <button 
        @click="submitComment" 
        class="submit-button"
        :disabled="!content.trim()"
      >
        등록
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

defineProps({
  placeholder: {
    type: String,
    default: '댓글을 작성해주세요'
  }
});

const emit = defineEmits(['submit']);

const content = ref('');

const submitComment = () => {
  if (!content.value.trim()) return;
  
  emit('submit', content.value);
  content.value = '';
};
</script>

<style scoped>
.comment-form {
  background-color: var(--light);
  border-radius: var(--border-radius);
  padding: 1rem;
  margin-bottom: 1rem;
}

.comment-textarea {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid var(--light-gray);
  border-radius: var(--border-radius);
  font-size: 0.875rem;
  color: var(--dark);
  background-color: var(--white);
  resize: vertical;
  transition: all 0.3s ease;
}

.comment-textarea:focus {
  outline: none;
  border-color: var(--primary);
  box-shadow: 0 0 0 0.25rem var(--primary-background);
}

.form-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 0.5rem;
}

.character-count {
  font-size: 0.75rem;
  color: var(--gray);
}

.submit-button {
  background-color: var(--primary);
  color: var(--white);
  border: none;
  border-radius: var(--border-radius);
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.submit-button:hover:not(:disabled) {
  background-color: var(--primary-dark);
}

.submit-button:disabled {
  background-color: var(--light-gray);
  cursor: not-allowed;
}
</style>