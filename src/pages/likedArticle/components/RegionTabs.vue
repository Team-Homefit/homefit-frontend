<template>
  <div class="region-tabs">
    <div class="tabs-container">
      <!-- 전체 탭 -->
      <button 
        v-if="showAllTab"
        class="tab-button" 
        :class="{ 'active': activeRegionCode === 'all' }"
        @click="$emit('select-region', 'all')"
      >
        전체
      </button>
      
      <!-- 지역 탭 -->
      <button 
        v-for="region in regions" 
        :key="region.code"
        class="tab-button" 
        :class="{ 'active': activeRegionCode === region.code }"
        @click="$emit('select-region', region.code)"
      >
        {{ region.name }}
      </button>
    </div>
  </div>
</template>

<script setup>
defineProps({
  regions: {
    type: Array,
    required: true
  },
  activeRegionCode: {
    type: String,
    required: true
  },
  showAllTab: {
    type: Boolean,
    default: false
  }
});

defineEmits(['select-region']);
</script>

<style scoped>
.region-tabs {
  position: relative;
  margin-bottom: 1rem;
}

.tabs-container {
  display: flex;
  overflow-x: auto;
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* IE and Edge */
  gap: 0.5rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid var(--light-gray);
}

.tabs-container::-webkit-scrollbar {
  display: none; /* Chrome, Safari, Opera */
}

.tab-button {
  flex-shrink: 0;
  padding: 0.5rem 1rem;
  border: none;
  background: none;
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--gray);
  cursor: pointer;
  border-radius: var(--border-radius);
  transition: all 0.3s ease;
  white-space: nowrap;
}

.tab-button:hover {
  color: var(--dark);
  background-color: var(--light);
}

.tab-button.active {
  color: var(--primary);
  background-color: var(--primary-background);
  font-weight: 600;
}

@media (max-width: 576px) {
  .tab-button {
    padding: 0.5rem 0.75rem;
    font-size: 0.8125rem;
  }
}
</style>