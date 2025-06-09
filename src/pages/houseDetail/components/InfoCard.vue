<template>
  <div class="info-card">
    <i :class="imageClass"></i>
    <div class="info-value">{{ value }}</div>
  </div>
</template>

<script setup>
import { defineProps } from 'vue';

defineProps({
  imageClass: String,
  value: String
})
</script>

<style scoped>
.info-card {
  width: 100%;
  display: flex;
  align-items: center;
  padding: 12px;

  background-color: var(--light);
  border-radius: var(--border-radius);
  box-shadow: var(--shadow);
}

i {
  color: var(--primary);
  width: 24px;
  height: 24px;
  margin-right: 4px;
  flex-shrink: 0;
}

.info-value {
  font-size: 16px;
  color: var(--dark);
}
</style>