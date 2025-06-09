<template>
  <div class="signup-page">

    <div class="progress-bar">
      <div :class="currentStep === 1 ? 'progress' : 'progress-disable'"></div>
      <div :class="currentStep === 2 ? 'progress' : 'progress-disable'"></div>
      <div :class="currentStep === 3 ? 'progress' : 'progress-disable'"></div>
    </div>

    <!-- 단계 1: 이메일 인증 -->
    <div v-if="currentStep === 1" class="step-container">
      <EmailVerification
        @verified="handleEmailVerified" 
      />
    </div>

    <!-- 단계 2: 비밀번호 설정 -->
    <div v-if="currentStep === 2" class="step-container">
      <div class="step-icon">
        <i class="bi bi-lock-fill"></i>
      </div>
      <h2>비밀번호 설정</h2>
      <p class="step-description">
        안전한 비밀번호를 설정해주세요.
      </p>

      <PasswordInput 
        id="password"
        label="비밀번호"
        placeholder="비밀번호를 입력하세요"
        hint="8자 이상, 영문, 숫자, 특수문자를 포함해주세요."
        v-model="password"
      />

      <PasswordInput 
        id="confirmPassword"
        label="비밀번호 확인"
        placeholder="비밀번호를 다시 입력하세요"
        :error="passwordMismatchError"
        v-model="confirmPassword"
      />

      <button 
        class="primary-button" 
        @click="goToNextStep"
        :disabled="!isPasswordValid"
      >
        다음
      </button>
    </div>

    <!-- 단계 3: 추가 정보 입력 -->
    <div v-if="currentStep === 3" class="step-container">
      <UserInfoForm @submit="handleFormSubmit" />
    </div>

    <!-- 단계 4: 가입 완료 -->
    <div v-if="currentStep === 4" class="step-container success-container">
      <div class="success-icon">
        <i class="bi bi-check-circle-fill"></i>
      </div>
      <h2>회원가입 완료</h2>
      <p class="success-description">
        회원가입이 성공적으로 완료되었습니다.<br>
        로그인하여 서비스를 이용해보세요.
      </p>
      <button class="primary-button" @click="goToLogin">
        로그인으로 이동
      </button>
    </div>

    <NotificationModal
      :model-value="showNotiModal"
      title="회원가입 안내"
      :message="notiModalText"
      isFail=true
      @close="handleCloseNotiModal"
    />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { signUpApi } from '@/entities';
import NotificationModal from '@/widgets/modal/NotificationModal.vue';
import EmailVerification from './components/EmailVerification.vue';
import PasswordInput from './components/PasswordInput.vue';
import UserInfoForm from './components/UserInfoForm.vue';

const router = useRouter();
// 상태 변수
const currentStep = ref(1);
const email = ref('');
const password = ref('');
const confirmPassword = ref('');
const showNotiModal = ref(false);
const notiModalText = ref('');

// 비밀번호 일치 여부 에러
const passwordMismatchError = computed(() => {
  if (confirmPassword.value && password.value !== confirmPassword.value) {
    return '비밀번호가 일치하지 않습니다.';
  }
  return '';
});

// 비밀번호 유효성 검사
const isPasswordValid = computed(() => {
  return (
    password.value.length >= 8 &&
    password.value === confirmPassword.value
  );
});

// 이메일 인증 완료 처리
const handleEmailVerified = (verifiedEmail) => {
  email.value = verifiedEmail;
  currentStep.value = 2;
};

// 다음 단계로 이동
const goToNextStep = () => {
  if (currentStep.value < 4) {
    currentStep.value++;
  }
};


// 회원가입 요청
const handleFormSubmit = async (userInfo) => {
  const request = { password: password.value, ...userInfo }

  const result = await signUpApi(request);
  if (!result) {
    notiModalText.value = "회원가입에 실패했습니다.";
    showNotiModal.value = true;
    return;
  }
  
  currentStep.value = 4;
};

const handleCloseNotiModal = () => {
  showNotiModal.value = false;
  notiModalText.value = '';
}

// 로그인 페이지로 이동
const goToLogin = () => {
  router.push({ name: 'signIn' });
};
</script>

<style scoped>
@import url("https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.1/font/bootstrap-icons.css");

/* 전체 컨테이너 */
.signup-page {
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
  .signup-page {
    padding: 12px;
  }
  
  .step-container {
    padding: 20px 16px;
  }
}
</style>