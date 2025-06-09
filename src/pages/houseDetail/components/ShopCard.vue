<template>
  <div class="shop-card" :class="{ negative: isNagative, hard: isHard }">
    <i :class="iconClass"></i>
    <div class="shop-value">{{ name }} {{ count }}</div>
  </div>
</template>

<script setup>
import { defineProps } from 'vue';

const props = defineProps({
  iconClass: {
    type: String,
    default: 'bi bi-shop-window',
  },
  name: String,
  count: Number,
  isNagative: {
    type: Boolean,
    default: false,
  },
  isHard: {
    type: Boolean,
    default: false,
  },
})
</script>

<style scoped>
.shop-card {
  display: flex;
  align-items: center;
  padding: 12px;

  background-color: var(--light);
  border-radius: var(--border-radius);
  box-shadow: var(--shadow);
}

.negative i {
  color: var(--orange);
}

.hard {
  font-weight: 500;
}

i {
  color: var(--primary);
  width: 24px;
  height: 24px;
  margin-right: 4px;
  flex-shrink: 0;
}

.shop-value {
  font-size: 16px;
  line-height: 1.6;
  color: var(--dark);
}
</style>