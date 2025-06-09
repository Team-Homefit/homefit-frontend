<template>
  <div class="password-change-page">

    <div class="progress-bar">
      <div :class="currentStep === 1 ? 'progress' : 'progress-disable'"></div>
      <div :class="currentStep === 2 ? 'progress' : 'progress-disable'"></div>
      <div :class="currentStep === 3 ? 'progress' : 'progress-disable'"></div>
    </div>

    <!-- 단계 1: 이메일 인증 -->
    <div v-if="currentStep === 1" class="step-container">
      <div class="step-icon">
        <i class="bi bi-envelope-fill"></i>
      </div>
      <h2>이메일 인증</h2>
      <p class="step-description">
        가입하신 이메일로 인증코드를 보내드립니다.
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
            :class="{ 'sent': emailSent }" 
            @click="sendVerificationCode"
            :disabled="!isValidEmail"
          >
            {{ emailSent ? '재전송' : '인증코드 받기' }}
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
    </div>

    <!-- 단계 2: 비밀번호 변경 -->
    <div v-if="currentStep === 2" class="step-container">
      <div class="step-icon">
        <i class="bi bi-lock-fill"></i>
      </div>
      <h2>비밀번호 변경</h2>
      <p class="step-description">
        새로운 비밀번호를 입력해주세요.
      </p>

      <div class="form-group">
        <label for="newPassword">새 비밀번호</label>
        <div class="password-input">
          <input 
            :type="showNewPassword ? 'text' : 'password'" 
            id="newPassword" 
            v-model="newPassword" 
            placeholder="새 비밀번호"
          />
          <button 
            class="toggle-password" 
            @click="showNewPassword = !showNewPassword"
          >
            <i :class="showNewPassword ? 'bi bi-eye-slash-fill' : 'bi bi-eye-fill'"></i>
          </button>
        </div>
        <p class="hint-text">8자 이상, 영문, 숫자, 특수문자를 포함해주세요.</p>
      </div>

      <div class="form-group">
        <label for="confirmPassword">새 비밀번호 확인</label>
        <div class="password-input">
          <input 
            :type="showConfirmPassword ? 'text' : 'password'" 
            id="confirmPassword" 
            v-model="confirmPassword" 
            placeholder="새 비밀번호 확인"
          />
          <button 
            class="toggle-password" 
            @click="showConfirmPassword = !showConfirmPassword"
          >
            <i :class="showConfirmPassword ? 'bi bi-eye-slash-fill' : 'bi bi-eye-fill'"></i>
          </button>
        </div>
        <p class="error-text" v-if="passwordMismatch">
          비밀번호가 일치하지 않습니다.
        </p>
      </div>

      <button 
        class="primary-button" 
        @click="changePassword"
        :disabled="!isFormValid"
      >
        비밀번호 변경
      </button>
    </div>

    <!-- 단계 3: 완료 -->
    <div v-if="currentStep === 3" class="step-container success-container">
      <div class="success-icon">
        <i class="bi bi-check-circle-fill"></i>
      </div>
      <h2>비밀번호 변경 완료</h2>
      <p class="success-description">
        비밀번호가 성공적으로 변경되었습니다.<br>
        새로운 비밀번호로 로그인해주세요.
      </p>
      <button class="primary-button" @click="navigateToSignIn">
        로그인 페이지로 이동
      </button>
    </div>

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
import { ref, computed, watch } from 'vue';
import { useRouter } from 'vue-router';
import { issueCodeApi, verifyCodeApi, updatePasswordApi } from '@/entities';
import NotificationModal from '@/widgets/modal/NotificationModal.vue';

const router = useRouter();
// 상태 변수
const currentStep = ref(1);
const email = ref('');
const verificationCode = ref('');
const emailSent = ref(false);
const remainingTime = ref(0);
const newPassword = ref('');
const confirmPassword = ref('');
const showNewPassword = ref(false);
const showConfirmPassword = ref(false);
const showNotiModal = ref(false);
const notiModalText = ref('');
const notiAboutFail = ref(false);


// 타이머 ID
let timerId = null;

// 진행 상태 바 너비
const progressWidth = computed(() => {
  return `${(currentStep.value / 3) * 100}%`;
});

// 타이머 포맷팅
const formatTime = (seconds) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};


// 이메일 유효성 검사
const isValidEmail = computed(() => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.value);
});

// 인증코드 발급
const sendVerificationCode = async () => {
  remainingTime.value = 60 * 10;

  if (timerId) {
    clearInterval(timerId);
  }
  timerId = setInterval(() => {
    if (remainingTime.value > 0) {
      remainingTime.value--;
    } else {
      clearInterval(timerId);
      emailSent.value = false;
      verificationCode.value = '';
    }
  }, 1000);

  const result = await issueCodeApi({ username: email.value, isSignUp: false });

  if (result === false) {
    notiAboutFail.value = true;
    showNotiModal.value = true;
    notiModalText.value = "이메일 전송에 실패했습니다.";
    clearInterval(timerId);
    return;
  }
  
  emailSent.value = true;
  notiAboutFail.value = false;
  showNotiModal.value = true;
  notiModalText.value = "이메일이 전송되었습니다.";
};

// 인증코드 검증
const verifyCode = async () => {
  const response = await verifyCodeApi({ username: email.value, code: verificationCode.value });

  if (timerId) {
    clearInterval(timerId);
    timerId = null;
  }

  if (response === true) {
    notiAboutFail.value = true;
    showNotiModal.value = true;
    notiModalText.value = "인증코드가 올바르지 않습니다.";
    return;
  }

  currentStep.value++;
};


// 비밀번호 일치 여부
const passwordMismatch = computed(() => {
  return confirmPassword.value && newPassword.value !== confirmPassword.value;
});

// 폼 유효성 검사
const isFormValid = computed(() => {
  return (
    newPassword.value.length >= 8 &&
    newPassword.value === confirmPassword.value
  );
});

// 비밀번호 변경
const changePassword = async () => {
  const result = await updatePasswordApi({ newPassword: newPassword.value });

  if (result === 400) {
    notiAboutFail.value = true;
    showNotiModal.value = true;
    notiModalText.value = "기존 비밀번호와 동일합니다.";
    return;
  }

  if (result === 0) {
    notiAboutFail.value = true;
    showNotiModal.value = true;
    notiModalText.value = "비밀번호 변경에 실패했습니다.";
    return;
  }

  currentStep.value = 3;
};


// 로그인 페이지로 이동
const navigateToSignIn = () => {
  router.replace({ name: 'signIn' });
};


const handleCloseNotiModal = () => {
  notiAboutFail.value = true;
  showNotiModal.value = false;
  notiModalText.value = '';
}


// 컴포넌트 언마운트 시 타이머 정리
watch(() => currentStep.value, (newStep) => {
  if (newStep !== 1 && timerId) {
    clearInterval(timerId);
    timerId = null;
  }
});
</script>

<style scoped>
@import url("https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.1/font/bootstrap-icons.css");

/* 전체 컨테이너 */
.password-change-page {
  max-width: 1140px;
  margin: 0 auto;
  padding: 16px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
  color: var(--dark);
  min-height: 100vh;
  background-color: var(--white);
}

/* 진행 상태 바 */
.progress-bar {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-around;

  height: 4px;
  border-radius: 2px;
  margin-top: 32px;
  margin-bottom: 32px;
  overflow: hidden;
}

.progress {
  width: 28%;
  height: 100%;
  background-color: var(--primary);
  transition: width 0.3s ease;
}

.progress-disable {
  width: 28%;
  height: 100%;
  background-color: var(--light-gray);
  transition: width 0.3s ease;
}

/* 단계 컨테이너 */
.step-container {
  min-width: 500px;
  background-color: var(--white);
  border-radius: var(--border-radius);
  padding: 24px;
  box-shadow: var(--shadow);
  margin-bottom: 24px;
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

.step-container h2 {
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

/* 폼 스타일 */
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

.action-button.sent {
  background-color: var(--primary-light);
}

/* 인증코드 입력 */
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

/* 비밀번호 입력 */
.password-input {
  position: relative;
}

.toggle-password {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  background: transparent;
  border: none;
  color: var(--gray);
  cursor: pointer;
  font-size: 16px;
}

.error-text {
  font-size: 12px;
  color: #dc3545;
  margin-top: 8px;
}

/* 버튼 스타일 */
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

/* 성공 화면 */
.success-container {
  text-align: center;
  padding: 32px 24px;
}

.success-icon {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background-color: rgba(40, 167, 69, 0.1);
  color: #28a745;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 24px;
  font-size: 40px;
}

.success-description {
  color: var(--gray);
  margin-bottom: 32px;
  line-height: 1.6;
}

/* 반응형 스타일 */
@media (max-width: 576px) {
  .password-change-page {
    padding: 12px;
  }
  
  .step-container {
    padding: 20px 16px;
  }
}
</style>