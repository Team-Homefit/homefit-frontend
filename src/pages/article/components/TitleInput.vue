<template>
  <div class="form-group">
    <label for="title" class="form-label">제목</label>
    <input 
      id="title" 
      :value="modelValue"
      @input="$emit('update:modelValue', $event.target.value)"
      type="text" 
      class="form-input"
      placeholder="제목을 입력해주세요"
      required
      maxlength="50"
    />
    <div class="input-counter">{{ modelValue.length }}/50</div>
  </div>
</template>

<script setup>
defineProps({
  modelValue: {
    type: String,
    required: true
  }
});

defineEmits(['update:modelValue']);
</script>

<style scoped>
.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-label {
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--dark);
}

.form-input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid var(--light-gray);
  border-radius: var(--border-radius);
  font-size: 1rem;
  color: var(--dark);
  background-color: var(--white);
  transition: all 0.3s ease;
}

.form-input:focus {
  outline: none;
  border-color: var(--primary);
  box-shadow: 0 0 0 0.25rem var(--primary-background);
}

.input-counter {
  font-size: 0.75rem;
  color: var(--gray);
  text-align: right;
  margin-top: 0.25rem;
}
</style>