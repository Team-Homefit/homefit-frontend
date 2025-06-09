<template>
  <div class="region-tabs">
    <button 
      v-for="region in regions" 
      :key="region.code"
      @click="$emit('select-region', {
        code: region.code,
        name: region.name,
        boardId: region.boardId
      })"
      class="region-tab"
      :class="{ 'active': activeInfo.code === region.code }"
    >
      {{ region.name }}
    </button>
    <button class="add-button" @click="$emit('add-region')">
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
      </svg>
    </button>
  </div>
</template>

<script setup>
defineProps({
  activeInfo: {
    type: Object,
    required: true
  },
  regions: {
    type: Array,
    required: true
  }
});

defineEmits(['select-region', 'add-region']);
</script>

<style scoped>
.region-tabs {
  display: flex;
  overflow-x: auto;
  margin-bottom: 1rem;
  border-bottom: 1px solid var(--light-gray);
  scrollbar-width: none; /* Firefox */
  padding-bottom: 0.5rem;
}

.region-tabs::-webkit-scrollbar {
  display: none; /* Chrome, Safari, Edge */
}

.region-tab {
  padding: 0.75rem 1.25rem;
  white-space: nowrap;
  background: none;
  border: none;
  font-weight: 500;
  color: var(--gray);
  cursor: pointer;
  transition: all 0.3s ease;
  border-bottom: 2px solid transparent;
}

.region-tab.active {
  color: var(--primary);
  border-bottom: 2px solid var(--primary);
}

.add-button {
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: var(--primary);
  border: none;
  color: var(--white);
  cursor: pointer;
  transition: background-color 0.3s ease;
  margin-left: 0.5rem;
}

.add-button:hover {
  background-color: var(--primary-dark);
}
</style>