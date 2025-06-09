<template>
  <div class="modal-overlay" @click="closeModal">
    <div class="modal-container" @click.stop>
      <div class="modal-header">
        <h3>사용자 정지</h3>
        <button class="close-button" @click="closeModal">
          <i class="bi bi-x-lg"></i>
        </button>
      </div>
      
      <div class="modal-body">
        <div class="user-info-section">
          <div class="user-avatar">
            <i class="bi bi-person-fill"></i>
          </div>
          <div class="user-details">
            <div class="user-name">{{ reportee.nickname }}</div>
            <div class="user-id">@{{ reportee.username }}</div>
            <div class="report-count">
              <i class="bi bi-flag-fill"></i>
              신고 {{ reportee.reportCount }}회
            </div>
          </div>
        </div>
        
        <div class="form-section">
          <div class="form-group">
            <label for="banReason">정지 사유</label>
            <textarea 
              id="reason" 
              v-model="formData.reason" 
              placeholder="정지 사유에 해당하는 문구를 입력하세요"
              rows="3"
              required
            ></textarea>
          </div>
          
          <div class="form-group">
            <label>정지 기간</label>
            <div class="duration-options">
              <label 
                v-for="duration in durations" 
                :key="duration.value" 
                class="duration-option"
                :class="{ active: formData.duration === duration.value }"
              >
                <input 
                  type="radio" 
                  name="duration" 
                  :value="duration.value" 
                  v-model="formData.duration"
                />
                <span>{{ duration.label }}</span>
              </label>
            </div>
          </div>
        </div>
      </div>
      
      <div class="modal-footer">
        <button class="cancel-button" @click="closeModal">취소</button>
        <button 
          class="submit-button" 
          @click="submitBan"
          :disabled="!isFormValid"
        >
          정지
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, defineProps, defineEmits } from 'vue';

const props = defineProps({
  reportee: {
    type: Object,
    required: true
  }
});

const emit = defineEmits(['close', 'submit']);

// 정지 기간 옵션
const durations = [
  { value: 'DAY', label: '1일' },
  { value: 'THREE_DAY', label: '3일' },
  { value: 'MONTH', label: '30일' }
];

// 폼 데이터
const formData = ref({
  reason: '',
  duration: 'DAY'
});

// 폼 유효성 검사
const isFormValid = computed(() => {
  return formData.value.reason && formData.value.duration;
});

// 모달 닫기
const closeModal = () => {
  emit('close');
};

// 정지 처리 제출
const submitBan = () => {
  if (isFormValid.value) {
    emit('submit', { ...formData.value, reporteeId: props.reportee.id });
  }
};
</script>

<style scoped>
.modal-overlay {
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
}

.modal-container {
  background-color: var(--white);
  border-radius: var(--border-radius);
  width: 90%;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  animation: modalFadeIn 0.3s ease;
}

@keyframes modalFadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  border-bottom: 1px solid var(--light-gray);
}

.modal-header h3 {
  font-size: 18px;
  font-weight: 600;
  margin: 0;
  color: var(--dark);
}

.close-button {
  background: transparent;
  border: none;
  font-size: 20px;
  cursor: pointer;
  color: var(--gray);
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-body {
  padding: 20px;
}

.user-info-section {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
}

.user-avatar {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background-color: var(--primary-background);
  color: var(--primary);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 30px;
  margin-right: 16px;
}

.user-details {
  flex: 1;
}

.user-name {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 4px;
}

.user-id {
  font-size: 14px;
  color: var(--gray);
  margin-bottom: 4px;
}

.report-count {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
  color: var(--primary);
}

.form-section {
  margin-bottom: 20px;
}

.form-group {
  margin-bottom: 16px;
}

.form-group label {
  display: block;
  font-size: 14px;
  font-weight: 500;
  margin-bottom: 8px;
  color: var(--dark);
}

.form-group textarea {
  width: 100%;
  padding: 12px;
  border: 1px solid var(--light-gray);
  border-radius: var(--border-radius);
  font-size: 14px;
  background-color: var(--light);
}

.form-group textarea:focus {
  border-color: var(--primary);
  outline: none;
}

.duration-options {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.duration-option {
  flex: 1;
  min-width: 70px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 10px;
  border: 1px solid var(--light-gray);
  border-radius: var(--border-radius);
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;
}

.duration-option input {
  position: absolute;
  opacity: 0;
  cursor: pointer;
}

.duration-option span {
  font-size: 14px;
  font-weight: 500;
}

.duration-option.active {
  background-color: var(--primary-background);
  border-color: var(--primary);
  color: var(--primary);
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding: 16px 20px;
  border-top: 1px solid var(--light-gray);
}

.cancel-button,
.submit-button {
  padding: 10px 16px;
  border-radius: var(--border-radius);
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
}

.cancel-button {
  background-color: var(--light);
  color: var(--gray);
  border: 1px solid var(--light-gray);
}

.submit-button {
  background-color: #dc3545;
  color: white;
  border: none;
}

.submit-button:disabled {
  background-color: var(--light-gray);
  color: var(--gray);
  cursor: not-allowed;
}

.cancel-button:hover {
  background-color: var(--light-gray);
}

.submit-button:not(:disabled):hover {
  background-color: #c82333;
}

@media (max-width: 576px) {
  .modal-container {
    width: 95%;
  }
  
  .duration-options {
    flex-direction: column;
  }
  
  .duration-option {
    width: 100%;
  }
}
</style>