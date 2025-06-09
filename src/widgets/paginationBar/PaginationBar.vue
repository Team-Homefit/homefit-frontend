<template>
  <div v-if="totalPages > 1" class="pagination">
    <!-- 첫 페이지로 이동 -->
    <button
      @click="$emit('page-change', 1)"
      class="pagination-button"
      :disabled="currentPage === 1"
      :class="{ disabled: currentPage === 1 }"
      aria-label="첫 페이지로 이동"
    >
      <span class="pagination-icon">«</span>
    </button>

    <!-- 이전 페이지로 이동 -->
    <button
      @click="$emit('page-change', currentPage - 1)"
      class="pagination-button"
      :disabled="currentPage === 1"
      :class="{ disabled: currentPage === 1 }"
      aria-label="이전 페이지로 이동"
    >
      <span class="pagination-icon">‹</span>
    </button>

    <!-- 페이지 번호 버튼들 -->
    <button
      v-for="page in displayedPages"
      :key="page"
      @click="$emit('page-change', page)"
      class="pagination-button page-button"
      :class="{ active: currentPage === page }"
    >
      {{ page }}
    </button>

    <!-- 다음 페이지로 이동 -->
    <button
      @click="$emit('page-change', currentPage + 1)"
      class="pagination-button"
      :disabled="currentPage === totalPages"
      :class="{ disabled: currentPage === totalPages }"
      aria-label="다음 페이지로 이동"
    >
      <span class="pagination-icon">›</span>
    </button>

    <!-- 마지막 페이지로 이동 -->
    <button
      @click="$emit('page-change', totalPages)"
      class="pagination-button"
      :disabled="currentPage === totalPages"
      :class="{ disabled: currentPage === totalPages }"
      aria-label="마지막 페이지로 이동"
    >
      <span class="pagination-icon">»</span>
    </button>
  </div>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  currentPage: {
    type: Number,
    required: true,
  },
  totalPages: {
    type: Number,
    required: true,
  },
  maxVisiblePages: {
    type: Number,
    default: 5,
  },
});

defineEmits(["page-change"]);

// 표시할 페이지 번호 목록
const displayedPages = computed(() => {
  const pages = [];

  if (props.totalPages <= props.maxVisiblePages) {
    // 전체 페이지가 maxVisiblePages 이하면 모든 페이지 표시
    for (let i = 1; i <= props.totalPages; i++) {
      pages.push(i);
    }
  } else {
    // 전체 페이지가 maxVisiblePages보다 많으면 현재 페이지 주변 페이지 표시
    let startPage = Math.max(1, props.currentPage - Math.floor(props.maxVisiblePages / 2));
    let endPage = startPage + props.maxVisiblePages - 1;

    // endPage가 totalPages를 초과하면 조정
    if (endPage > props.totalPages) {
      endPage = props.totalPages;
      startPage = Math.max(1, endPage - props.maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
  }

  return pages;
});
</script>

<style scoped>
.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 2rem;
  gap: 0.5rem;
}

.pagination-button {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: var(--white);
  border: 1px solid var(--light-gray);
  color: var(--dark);
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.3s ease;
  padding: 0;
  line-height: 1;
}

.pagination-button:hover:not(.disabled):not(.active) {
  background-color: var(--light);
  border-color: var(--primary);
  color: var(--primary);
}

.pagination-button.disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.pagination-button.active {
  background-color: var(--primary);
  color: var(--white);
  border-color: var(--primary);
}

.pagination-icon {
  font-size: 1.25rem;
  line-height: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
}

.page-button {
  font-weight: 500;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* 반응형 조정 */
@media (max-width: 576px) {
  .pagination-button {
    width: 36px;
    height: 36px;
  }
}
</style>
