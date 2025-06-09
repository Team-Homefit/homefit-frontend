<template>
  <div class="email-verification">
    <div class="step-icon">
      <i class="bi bi-envelope-fill"></i>
    </div>
    <h2>이메일 인증</h2>
    <p class="step-description">
      가입할 이메일 주소를 입력해주세요.<br/>인증코드는 10분 간 유효합니다.
    </p>

    <div class="form-group">
      <label for="email">이메일</label>
      <div class="input-with-button">
        <input 
          type="email" 
          id="email" 
          v-model="email" 
          placeholder="이메일을 입력하세요"
          :disabled="emailSent"
        />
        <button 
          class="action-button"
          @click="sendVerificationCode"
          :disabled="!isValidEmail || isLoading"
        >
          <span v-if="isLoading">
            <i class="bi bi-arrow-repeat spin"></i>
            로딩 중...
          </span>
          <span v-else>
            {{ emailSent ? '재전송' : '인증코드 받기' }}
          </span>
        </button>
      </div>
    </div>

    <div v-if="emailSent" class="form-group">
      <label for="verificationCode">인증코드</label>
      <div class="verification-code-container">
        <input 
          type="text" 
          id="verificationCode" 
          v-model="verificationCode" 
          placeholder="6자리 인증코드"
          maxlength="6"
          class="verification-code-input"
        />
        <div class="timer" v-if="remainingTime > 0">{{ formatTime(remainingTime) }}</div>
      </div>
      <p class="hint-text">이메일로 전송된 6자리 인증코드를 입력하세요.</p>
    </div>

    <button 
      class="primary-button" 
      @click="verifyCode"
      :disabled="!emailSent || verificationCode.length !== 6"
    >
      다음
    </button>

    <NotificationModal
      :model-value="showNotiModal"
      title="회원가입 안내"
      :message="notiModalText"
      :isFail="notiAboutFail"
      @close="handleCloseNotiModal"
    />
  </div>
</template>

<script setup>
import { ref, computed, onUnmounted, defineProps, defineEmits } from 'vue';
import { issueCodeApi, verifyCodeApi } from '@/entities';
import NotificationModal from '@/widgets/modal/NotificationModal.vue';

const emit = defineEmits(['verified']);

// 상태 변수
const email = ref('');
const verificationCode = ref('');
const isLoading = ref(false);
const emailSent = ref(false);
const remainingTime = ref(0);
const showNotiModal = ref(false);
const notiModalText = ref('');
const notiAboutFail = ref(false);

// 타이머 ID
let timerId = null;

// 이메일 유효성 검사
const isValidEmail = computed(() => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.value);
});


// 타이머 포맷팅
const formatTime = (seconds) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};


// 인증코드 전송
const sendVerificationCode = async () => {  
  // 타이머 설정 (10분)
  remainingTime.value = 60 * 10;
  
  if (timerId) {
    clearInterval(timerId);
  }
  
  timerId = setInterval(() => {
    if (remainingTime.value > 0) {
      remainingTime.value--;
    } else {
      clearInterval(timerId);
      // 인증코드 만료 처리
      emailSent.value = false;
      verificationCode.value = '';
    }
  }, 1000);

  isLoading.value = true;
  const response = await issueCodeApi({ username: email.value, isSignUp: true });
  isLoading.value = false;

  if (response === 200) {
    notiAboutFail.value = false;
    showNotiModal.value = true;
    notiModalText.value = `${email.value}로 인증코드가 전송되었습니다.`;
    emailSent.value = true;
    return;
  }
  
  if (response === 400) {
    notiAboutFail.value = true;
    showNotiModal.value = true;
    notiModalText.value = "이미 가입한 이메일입니다.";
  } else {
    notiAboutFail.value = true;
    showNotiModal.value = true;
    notiModalText.value = "인증코드 전송에 실패했습니다.";
  }
  clearInterval(timerId);

};

// 인증코드 확인
const verifyCode = async () => {
  const response = await verifyCodeApi({ username: email.value, code: verificationCode.value });

  if (response.status === 200) {
    if (timerId) {
      clearInterval(timerId);
      timerId = null;
    }

    emit('verified', email.value);

    return;
  }
  
  notiAboutFail.value = true;
  showNotiModal.value = true;
  notiModalText.value = "인증코드가 올바르지 않습니다.";
};

const handleCloseNotiModal = () => {
  notiAboutFail.value = true;
  showNotiModal.value = false;
  notiModalText.value = '';
}

// 컴포넌트 언마운트 시 타이머 정리
onUnmounted(() => {
  if (timerId) {
    clearInterval(timerId);
    timerId = null;
  }
});
</script>

<style scoped>
.email-verification {
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

.form-group input {
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

.input-with-button {
  display: flex;
  gap: 8px;
}

.input-with-button input {
  flex: 1;
}

.action-button {
  padding: 0 16px;
  background-color: var(--primary);
  color: var(--white);
  border: none;
  border-radius: var(--border-radius);
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  white-space: nowrap;
  transition: background-color 0.2s;
}

.action-button:disabled {
  background-color: var(--light-gray);
  color: var(--gray);
  cursor: not-allowed;
}

.spin {
  display: inline-block;
  animation: spin 1s linear infinite;
  font-size: 16px;
  margin-right: 6px;
}

@keyframes spin {
  100% { transform: rotate(360deg); }
}

.verification-code-container {
  display: flex;
  align-items: center;
  gap: 12px;
}

.verification-code-input {
  font-size: 18px;
  letter-spacing: 4px;
  text-align: center;
  font-weight: 600;
}

.timer {
  font-size: 14px;
  color: var(--orange);
  font-weight: 500;
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
</style>