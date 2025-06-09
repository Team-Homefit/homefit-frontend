<template>
  <div class="info-item">
    <div class="info-icon">
      <i :class="`bi ${icon}`"></i>
    </div>
    <div class="info-content">
      <div class="info-label">{{ label }}</div>
      <div class="info-value">{{ value }}</div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  icon: String,
  label: String,
  value: String
});
</script>

<style scoped>

.info-item {
  display: flex;
  padding: 16px;
  border-bottom: 1px solid var(--light-gray);
}

.info-item:last-child {
  border-bottom: none;
}

.info-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: var(--primary-background);
  color: var(--primary);
  margin-right: 16px;
  flex-shrink: 0;
}

.info-content {
  flex: 1;
}

.info-label {
  font-size: 14px;
  color: var(--gray);
  margin-bottom: 4px;
}

.info-value {
  font-size: 16px;
  font-weight: 500;
  color: var(--dark);
}
</style>