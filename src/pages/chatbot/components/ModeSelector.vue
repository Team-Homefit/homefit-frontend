<template>
  <div class="mode-selector">
    <div class="mode-toggle">
      <button 
        class="mode-button"
        :class="{ active: currentMode === 'analyze' }"
        @click="changeMode('analyze')"
      >
        <i class="bi bi-file-text"></i>
        <span>계약서 검토</span>
      </button>
      <button 
        class="mode-button"
        :class="{ active: currentMode === 'knowledge' }"
        @click="changeMode('knowledge')"
      >
        <i class="bi bi-question-circle"></i>
        <span>지식 질의</span>
      </button>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  currentMode: {
    type: String,
    required: true,
    validator: (value) => ['analyze', 'knowledge'].includes(value)
  }
});

const emit = defineEmits(['change-mode']);

const changeMode = (mode) => {
  if (mode !== props.currentMode) {
    emit('change-mode', mode);
  }
};
</script>

<style scoped>
.mode-selector {
  display: flex;
  align-items: center;
}

.mode-toggle {
  display: flex;
  border-radius: var(--border-radius);
  overflow: hidden;
  border: 1px solid var(--light-gray);
  background-color: var(--white);
}

.mode-button {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 12px;
  background-color: var(--white);
  border: none;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;
  color: var(--gray);
}

.mode-button:not(:last-child) {
  border-right: 1px solid var(--light-gray);
}

.mode-button:hover {
  background-color: var(--background);
  color: var(--dark);
}

.mode-button.active {
  background-color: var(--primary);
  color: var(--white);
}

.mode-button i {
  font-size: 16px;
}

.mode-button span {
  font-weight: 500;
  white-space: nowrap;
}

/* 반응형 스타일 */
@media (max-width: 768px) {
  .mode-button {
    padding: 6px 10px;
    font-size: 12px;
  }
  
  .mode-button i {
    font-size: 14px;
  }
  
  .mode-button span {
    display: none;
  }
}
</style>