<template>
  <div class="user-info-form">
    <div class="step-icon">
      <i class="bi bi-person-fill"></i>
    </div>
    <h2>추가 정보 입력</h2>
    <p class="step-description">
      필수 정보와 선택 정보를 입력해주세요.
    </p>

    <div class="form-group">
      <label for="nickname">닉네임 <span class="required">*</span></label>
      <input 
        type="text" 
        id="nickname" 
        v-model="userInfo.nickname" 
        placeholder="닉네임을 입력하세요"
      />
      <p class="hint-text">닉네임은 필수 정보입니다.</p>
    </div>

    <div class="form-group">
      <label>성별 <span class="optional">(선택)</span></label>
      <div class="radio-group">
        <label class="radio-label">
          <input 
            type="radio" 
            name="gender" 
            value="M" 
            v-model="userInfo.gender"
          />
          <span>남성</span>
        </label>
        <label class="radio-label">
          <input 
            type="radio" 
            name="gender" 
            value="F" 
            v-model="userInfo.gender"
          />
          <span>여성</span>
        </label>
        <label class="radio-label">
          <input 
            type="radio" 
            name="gender" 
            value="" 
            v-model="userInfo.gender"
          />
          <span>선택 안함</span>
        </label>
      </div>
    </div>

    <div class="form-group">
      <label for="birthdate">생년월일 <span class="optional">(선택)</span></label>
      <input 
        type="date" 
        id="birthdate" 
        v-model="userInfo.birthdate"
      />
    </div>

    <div class="form-group">
      <label for="phoneNumber">전화번호 <span class="optional">(선택)</span></label>
      <input 
        type="tel" 
        id="phoneNumber" 
        v-model="userInfo.phoneNumber" 
        placeholder="전화번호를 입력하세요"
      />
      <p class="hint-text">'-' 없이 숫자만 입력해주세요.</p>
    </div>

    <button 
      class="primary-button" 
      @click="submitForm"
      :disabled="!isFormValid"
    >
      가입 완료
    </button>
  </div>
</template>

<script setup>
import { reactive, computed, defineEmits } from 'vue';

const emit = defineEmits(['submit']);

const userInfo = reactive({
  nickname: '',
  gender: 'none',
  birthdate: '',
  phoneNumber: ''
});

// 폼 유효성 검사 - 닉네임만 필수
const isFormValid = computed(() => {
  return userInfo.nickname.trim().length > 0;
});

// 폼 제출
const submitForm = () => {
  if (isFormValid.value) {
    emit('submit', { ...userInfo });
  }
};
</script>

<style scoped>
.user-info-form {
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

.step-icon {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background-color: var(--primary-background);
  color: var(--primary);
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 16px;
  font-size: 24px;
}

h2 {
  font-size: 20px;
  font-weight: 600;
  margin: 0 0 8px;
  text-align: center;
}

.step-description {
  text-align: center;
  color: var(--gray);
  margin-bottom: 24px;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  font-size: 14px;
  font-weight: 500;
  margin-bottom: 8px;
  color: var(--dark);
}

.form-group input[type="text"],
.form-group input[type="date"],
.form-group input[type="tel"] {
  width: 100%;
  padding: 12px 16px;
  border: 1px solid var(--light-gray);
  border-radius: var(--border-radius);
  font-size: 16px;
  background-color: var(--light);
  transition: border-color 0.2s;
}

.form-group input:focus {
  border-color: var(--primary);
  outline: none;
}

.radio-group {
  display: flex;
  gap: 16px;
}

.radio-label {
  display: flex;
  align-items: center;
  cursor: pointer;
}

.radio-label input {
  margin-right: 8px;
}

.checkbox-label {
  display: flex;
  align-items: center;
  cursor: pointer;
}

.checkbox-label input {
  margin-right: 8px;
}

.hint-text {
  font-size: 12px;
  color: var(--gray);
  margin-top: 8px;
}

.primary-button {
  width: 100%;
  padding: 14px;
  background-color: var(--primary);
  color: var(--white);
  border: none;
  border-radius: var(--border-radius);
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s;
  margin-top: 16px;
}

.primary-button:hover {
  background-color: var(--primary-dark);
}

.primary-button:disabled {
  background-color: var(--light-gray);
  color: var(--gray);
  cursor: not-allowed;
}

.required {
  color: #dc3545;
  margin-left: 4px;
}

.optional {
  color: var(--gray);
  font-size: 12px;
  font-weight: normal;
}
</style>