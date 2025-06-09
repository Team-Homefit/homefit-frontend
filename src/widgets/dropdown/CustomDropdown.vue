<template>
  <div 
    class="custom-dropdown" 
    :class="{ 
      'active': isActive, 
      'disabled': disabled,
      'has-value': modelValue 
    }"
  >
    <div 
      class="dropdown-header" 
      @click="!disabled && toggle()"
      :id="id"
    >
      <span>{{ displayLabel }}</span>
      <i class="bi" :class="isActive ? 'bi-chevron-up' : 'bi-chevron-down'"></i>
    </div>
    <div class="dropdown-menu" v-show="isActive">
      <div 
        class="dropdown-item" 
        v-for="option in options" 
        :key="option.value"
        @click="selectOption(option.value)"
        :class="{ 'selected': modelValue === option.value }"
      >
        {{ option.label }}
      </div>
      <div class="dropdown-empty" v-if="options.length === 0">
        {{ emptyMessage }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onBeforeUnmount } from 'vue';
import 'bootstrap-icons/font/bootstrap-icons.css';

// props 정의
const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  },
  options: {
    type: Array,
    default: () => []
  },
  placeholder: {
    type: String,
    default: '선택하세요'
  },
  disabled: {
    type: Boolean,
    default: false
  },
  id: {
    type: String,
    required: true
  },
  emptyMessage: {
    type: String,
    default: '선택 가능한 항목이 없습니다'
  }
});

// emit 정의
const emit = defineEmits(['update:modelValue']);

// 드롭다운 활성화 상태
const isActive = ref(false);

// 드롭다운 토글
const toggle = () => {
  if (!props.disabled) {
    isActive.value = !isActive.value;
  }
};

// 옵션 선택
const selectOption = (value) => {
  emit('update:modelValue', value);
  isActive.value = false;
};

// 표시할 라벨 계산
const displayLabel = computed(() => {
  if (!props.modelValue) {
    return props.placeholder;
  }
  
  const selectedOption = props.options.find(option => option.value === props.modelValue);
  return selectedOption ? selectedOption.label : props.placeholder;
});

// 드롭다운 외부 클릭 시 닫기
const handleClickOutside = (event) => {
  const dropdown = document.getElementById(props.id)?.closest('.custom-dropdown');
  if (dropdown && !dropdown.contains(event.target) && isActive.value) {
    isActive.value = false;
  }
};

// 이벤트 리스너 등록 및 해제
onMounted(() => {
  document.addEventListener('click', handleClickOutside);
});

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside);
});

// 비활성화 상태가 되면 드롭다운 닫기
watch(() => props.disabled, (newValue) => {
  if (newValue && isActive.value) {
    isActive.value = false;
  }
});
</script>

<style scoped>
/* 커스텀 드롭다운 스타일 */
.custom-dropdown {
  position: relative;
  width: 100%;
  border-radius: 0.75rem;
  background-color: var(--light);
  transition: all 0.2s ease;
}

.custom-dropdown.active {
  box-shadow: var(--primary-background);
}

.custom-dropdown.has-value .dropdown-header {
  color: var(--dark);
}

.custom-dropdown.disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.dropdown-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem 1rem;
  cursor: pointer;
  color: var(--gray);
  border-radius: 0.75rem;
  user-select: none;
}

.dropdown-header i {
  color: var(--primary);
  transition: transform 0.2s ease;
}

.custom-dropdown.active .dropdown-header i {
  transform: rotate(180deg);
}

.dropdown-menu {
  position: absolute;
  top: calc(100% + 5px);
  left: 0;
  width: 100%;
  max-height: 250px;
  overflow-y: auto;
  background-color: var(--white);
  border-radius: 0.75rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  animation: fadeIn 0.2s ease;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.dropdown-item {
  padding: 0.75rem 1rem;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.dropdown-item:hover {
  background-color: var(--primary-light-background);
}

.dropdown-item.selected {
  color: var(--primary);
  font-weight: 500;
}

.dropdown-empty {
  padding: 0.75rem 1rem;
  color: var(--gray);
  text-align: center;
  font-style: italic;
}

/* 스크롤바 스타일링 */
.dropdown-menu::-webkit-scrollbar {
  width: 6px;
}

.dropdown-menu::-webkit-scrollbar-track {
  background: var(--light);
  border-radius: 3px;
}

.dropdown-menu::-webkit-scrollbar-thumb {
  background: var(--primary-light);
  border-radius: 3px;
}

.dropdown-menu::-webkit-scrollbar-thumb:hover {
  background: var(--primary);
}
</style>