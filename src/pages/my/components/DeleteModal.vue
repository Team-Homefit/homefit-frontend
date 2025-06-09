<template>
  <div class="modal" v-if="show">
    <div class="modal-content delete-modal">
      <div class="modal-header">
        <h3>회원 탈퇴</h3>
        <button class="close-button" @click="onClose">
          <i class="bi bi-x-lg"></i>
        </button>
      </div>
      <div class="modal-body">
        <div class="warning-icon">
          <i class="bi bi-exclamation-triangle-fill"></i>
        </div>
        <p class="warning-text">정말 탈퇴하시겠습니까?</p>
        <p class="warning-description">
          탈퇴 시 모든 개인정보와 활동 내역이 삭제되며, 이 작업은 되돌릴 수 없습니다.
        </p>
        <div class="form-group">
          <label for="password">비밀번호 확인</label>
          <input 
            type="password" 
            id="password" 
            v-model="password" 
            placeholder="비밀번호를 입력하세요"
          />
        </div>
      </div>
      <div class="modal-footer">
        <button class="cancel-button" @click="onClose">취소</button>
        <button class="delete-button" @click="onDelete">탈퇴하기</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, defineProps, defineEmits } from 'vue';

defineProps({
  show: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['close', 'delete']);

const password = ref('');

const onClose = () => {
  password.value = '';
  emit('close');
};

const onDelete = () => {
  if (!password.value) {
    alert('비밀번호를 입력해주세요.');
    return;
  }
  emit('delete', password.value);
  password.value = '';
};
</script>

<style scoped>
.modal {
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

.modal-content {
  background-color: var(--white);
  border-radius: var(--border-radius);
  width: 90%;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  border-bottom: 1px solid var(--light-gray);
}

.modal-header h3 {
  font-size: 18px;
  font-weight: 600;
  margin: 0;
}

.close-button {
  background: transparent;
  border: none;
  font-size: 20px;
  cursor: pointer;
  color: var(--gray);
}

.modal-body {
  padding: 16px;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding: 16px;
  border-top: 1px solid var(--light-gray);
}

/* 폼 스타일 */
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

.form-group input[type="password"] {
  width: 100%;
  padding: 12px;
  border: 1px solid var(--light-gray);
  border-radius: var(--border-radius);
  font-size: 16px;
  background-color: var(--light);
}

/* 버튼 스타일 */
.cancel-button,
.delete-button {
  padding: 12px 20px;
  border-radius: var(--border-radius);
  font-size: 16px;
  font-weight: 500;
  border: none;
  cursor: pointer;
}

.cancel-button {
  background-color: var(--light);
  color: var(--gray);
}

.delete-button {
  background-color: #dc3545; /* 빨간색 */
  color: var(--white);
}

/* 탈퇴 모달 스타일 */
.delete-modal .warning-icon {
  display: flex;
  justify-content: center;
  margin-bottom: 16px;
  font-size: 48px;
  color: #dc3545; /* 빨간색 */
}

.delete-modal .warning-text {
  text-align: center;
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 8px;
}

.delete-modal .warning-description {
  text-align: center;
  font-size: 14px;
  color: var(--gray);
  margin-bottom: 24px;
}
</style>