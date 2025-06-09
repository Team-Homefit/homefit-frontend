<template>
  <!-- 모달 백드롭 -->
  <div 
    v-if="isVisible" 
    class="modal-backdrop" 
    @click="handleBackdropClick"
  >
    <!-- 모달 컨테이너 -->
    <div 
      class="modal-container" 
      @click.stop
    >
      <!-- 모달 헤더 -->
      <div class="modal-header">
        <h3 class="modal-title">{{ title }}</h3>
        <button 
          class="close-button" 
          @click="handleColse"
          aria-label="닫기"
        >
          <i class="bi bi-x-lg"></i>
        </button>
      </div>

      <!-- 모달 바디 -->
      <div class="modal-body">
        <div class="modal-icon">
            <i class="bi bi-exclamation-circle" v-if="!isFail"></i>
            <i class="bi bi-exclamation-octagon fail" v-else></i>
        </div>
        <p class="modal-message">{{ message }}</p>
      </div>

      <!-- 모달 푸터 -->
      <div class="modal-footer">
        <button 
          class="confirm-button" 
          @click="handleColse"
        >
          확인
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  title: {
    type: String,
    default: '확인'
  },
  message: {
    type: String,
    required: true
  },
  isFail: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['update:modelValue', 'close']);

const isVisible = ref(props.modelValue);

// props.modelValue 변경 감지
watch(() => props.modelValue, (newValue) => {
  isVisible.value = newValue;
});

// 모달 열기
const openModal = () => {
  isVisible.value = true;
  emit('update:modelValue', true);
  // 모달이 열릴 때 body 스크롤 방지
  document.body.style.overflow = 'hidden';
};

// 모달 닫기
const closeModal = () => {
  isVisible.value = false;
  emit('update:modelValue', false);
  // 모달이 닫힐 때 body 스크롤 복원
  document.body.style.overflow = '';
};

// 확인 버튼 클릭
const handleColse = () => {
  emit('close');
  closeModal();
};

// 백드롭 클릭 (모달 외부 클릭)
const handleBackdropClick = () => {
  handleColse();
};

// 컴포넌트에서 사용할 수 있도록 expose
defineExpose({
  openModal,
  closeModal
});
</script>

<style scoped>
/* 모달 백드롭 */
.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 16px;
  animation: fadeIn 0.2s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

/* 모달 컨테이너 */
.modal-container {
  background-color: var(--white);
  border-radius: var(--border-radius);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
  width: 100%;
  max-width: 400px;
  max-height: 90vh;
  overflow: hidden;
  animation: slideIn 0.3s ease-out;
}

@keyframes slideIn {
  from {
    transform: translateY(-20px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

/* 모달 헤더 */
.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px 16px 24px;
  border-bottom: 1px solid var(--light-gray);
}

.modal-title {
  font-size: 18px;
  font-weight: 600;
  color: var(--dark);
  margin: 0;
}

.close-button {
  background: none;
  border: none;
  color: var(--gray);
  cursor: pointer;
  font-size: 16px;
  padding: 4px;
  border-radius: 4px;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.close-button:hover {
  background-color: var(--background);
  color: var(--dark);
}

/* 모달 바디 */
.modal-body {
  padding: 24px;
  text-align: center;
}

.modal-icon {
  margin-bottom: 16px;
}

.modal-icon i {
  font-size: 48px;
  color: var(--primary);
}

.modal-icon i.fail {
  color: var(--error);
}

.modal-message {
  font-size: 16px;
  line-height: 1.5;
  color: var(--dark);
  margin: 0;
}

/* 모달 푸터 */
.modal-footer {
  display: flex;
  justify-content: center;
  gap: 12px;
  padding: 16px 24px 24px 24px;
  border-top: 1px solid var(--light-gray);
}

/* 버튼 스타일 */
.cancel-button,
.confirm-button {
  padding: 10px 20px;
  border-radius: var(--border-radius);
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  border: 1px solid;
  min-width: 80px;
}

.cancel-button {
  background-color: var(--white);
  color: var(--gray);
  border-color: var(--light-gray);
}

.cancel-button:hover {
  background-color: var(--background);
  border-color: var(--gray);
  color: var(--dark);
}

.confirm-button {
  background-color: var(--primary);
  color: var(--white);
  border-color: var(--primary);
}

.confirm-button:hover {
  background-color: var(--primary-dark);
  border-color: var(--primary-dark);
}

/* 반응형 스타일 */
@media (max-width: 480px) {
  .modal-container {
    margin: 16px;
    max-width: calc(100% - 32px);
  }
  
  .modal-header {
    padding: 16px 20px 12px 20px;
  }
  
  .modal-body {
    padding: 20px;
  }
  
  .modal-footer {
    padding: 12px 20px 20px 20px;
    flex-direction: column-reverse;
  }
  
  .cancel-button,
  .confirm-button {
    width: 100%;
    min-width: auto;
  }
  
  .modal-icon i {
    font-size: 40px;
  }
  
  .modal-message {
    font-size: 15px;
  }
}
</style>