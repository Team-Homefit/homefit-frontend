<template>
  <div class="login-page">
    <div class="login-container">
      <div class="login-header">
        <div class="logo">
          <i class="bi bi-building"></i>
        </div>
        <h1>HOMEFIT</h1>
        <p>계정에 로그인하여 더 많은 서비스를 이용하세요</p>
      </div>
      
      <form @submit.prevent="handleLogin" class="login-form">
        <div class="form-group">
          <label for="username">아이디</label>
          <div class="input-wrapper">
            <i class="bi bi-person"></i>
            <input 
              type="text" 
              id="username" 
              v-model="loginForm.username" 
              placeholder="username"
              autocomplete="username"
            />
          </div>
          <div class="error-message" v-if="errors.username">
            {{ errors.username }}
          </div>
        </div>
        
        <div class="form-group">
          <label for="password">비밀번호</label>
          <div class="input-wrapper">
            <i class="bi bi-lock"></i>
            <input 
              :type="showPassword ? 'text' : 'password'" 
              id="password" 
              v-model="loginForm.password" 
              placeholder="password"
              autocomplete="current-password"
            />
            <button 
              type="button" 
              class="toggle-password" 
              @click="togglePasswordVisibility"
              tabindex="-1"
            >
              <i class="bi" :class="showPassword ? 'bi-eye-slash' : 'bi-eye'"></i>
            </button>
          </div>
          <div class="error-message" v-if="errors.password">
            {{ errors.password }}
          </div>
        </div>
        
        <div class="form-options">
          <button type="button" class="forgot-password" @click="navigateToForgotPassword">
            비밀번호 찾기
          </button>
        </div>
        
        <button type="submit" class="login-button" :disabled="isLoading">
          <span v-if="!isLoading">로그인</span>
          <div v-else class="spinner"></div>
        </button>
        
        <!-- 로그인 실패 시 표시되는 전체 오류 메시지 -->
        <div class="error-message login-error" v-if="errors.login">
          {{ errors.login }}
        </div>
      </form>
      
      <div class="login-footer">
        <p>계정이 없으신가요? <button @click="navigateToSignup" class="signup-link">회원가입</button></p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';
import { useMemberStore } from '@/features/member/memberStore';
import { signInApi } from '@/entities';

const router = useRouter();
const memberStore = useMemberStore();

// 로그인 폼 상태
const loginForm = reactive({
  username: '',
  password: ''
});

// 에러 메시지
const errors = reactive({
  username: '',
  password: '',
  login: ''
});

// 비밀번호 표시 여부
const showPassword = ref(false);

// 로딩 상태
const isLoading = ref(false);

// 비밀번호 표시/숨김 토글
const togglePasswordVisibility = () => {
  showPassword.value = !showPassword.value;
};

// 로그인 처리
const handleLogin = async () => {
  // 에러 초기화
  errors.username = '';
  errors.password = '';
  errors.login = '';
  
  // 간단한 유효성 검사
  if (!loginForm.username.trim()) {
    errors.username = '아이디를 입력해주세요';
    return;
  }
  
  if (!loginForm.password) {
    errors.password = '비밀번호를 입력해주세요';
    return;
  }
  
  isLoading.value = true;
  const result = await signInApi({ username: loginForm.username, password: loginForm.password });
  isLoading.value = false;
  
  if (result === false) {
    console.error('로그인 실패: ', loginForm);
    errors.login = '로그인 중 오류가 발생했습니다. 다시 시도해주세요.';
    return;
  }
  
  memberStore.setInit({ id: result.memberId, role: result.role });
  memberStore.getMember();

  router.replace({ name: 'main' });
};


// 네비게이션
const navigateToForgotPassword = () => {
  router.push({ name: 'passwordUpdate' });
};

const navigateToSignup = () => {
  router.push({ name: 'signUp' });
};
</script>

<style scoped>
@import url("https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.1/font/bootstrap-icons.css");

/* 로그인 페이지 레이아웃 */
.login-page {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: var(--white);
  padding: 1rem;
}

.login-container {
  width: 100%;
  max-width: 600px;
  background-color: var(--white);
  border-radius: var(--border-radius);
  box-shadow: var(--shadow);
  padding: 2rem;
}

/* 로그인 헤더 */
.login-header {
  text-align: center;
  margin-bottom: 2rem;
}

.logo {
  width: 64px;
  height: 64px;
  background-color: var(--primary-background);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1rem;
}

.logo i {
  font-size: 2rem;
  color: var(--primary);
}

.login-header h1 {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--dark);
  margin: 0 0 0.5rem;
}

.login-header p {
  color: var(--gray);
  margin: 0;
}

/* 로그인 폼 */
.login-form {
  margin-bottom: 1.5rem;
}

.form-group {
  margin-bottom: 1.25rem;
}

label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: var(--dark);
  font-size: 0.875rem;
}

.input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
  background-color: var(--light-gray); /* iOS 스타일 그레이 배경 */
  border-radius: var(--border-radius);
  border: 1px solid transparent;
  transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
}

.input-wrapper:focus-within {
  border-color: var(--primary-light);
  box-shadow: 0 0 0 0.2rem rgba(33, 158, 188, 0.25);
}

.input-wrapper i {
  position: absolute;
  left: 1rem;
  color: var(--gray);
  z-index: 1;
}

.input-wrapper input {
  flex: 1;
  width: 100%;
  padding: 0.75rem 2.5rem 0.75rem 2.5rem;
  font-size: 1rem;
  line-height: 1.5;
  color: var(--dark);
  background-color: transparent;
  border: none;
  outline: none;
}

/* 비밀번호 토글 버튼 */
.toggle-password {
  position: absolute;
  right: 0.75rem;
  background: none;
  border: none;
  color: var(--gray);
  cursor: pointer;
  padding: 0.25rem;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2;
}

.toggle-password:hover {
  color: var(--primary);
}

.toggle-password i {
  font-size: 1.1rem;
  position: static; /* 아이콘 위치 재설정 */
}

.error-message {
  color: var(--orange); /* 요청하신 오렌지 색상 */
  font-size: 0.875rem;
  margin-top: 0.5rem;
  font-weight: 500;
}

.login-error {
  text-align: center;
  margin-top: 1rem;
}

/* 폼 옵션 */
.form-options {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 1.5rem;
}

.forgot-password {
  background: none;
  border: none;
  color: var(--primary);
  font-size: 0.875rem;
  cursor: pointer;
  padding: 0;
  transition: color 0.2s;
}

.forgot-password:hover {
  color: var(--primary-dark);
  text-decoration: underline;
}

/* 로그인 버튼 */
.login-button {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding: 0.75rem 1.5rem;
  background-color: var(--primary);
  color: var(--white);
  border: none;
  border-radius: var(--border-radius);
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
  height: 48px;
}

.login-button:hover {
  background-color: var(--primary-dark);
}

.login-button:disabled {
  background-color: var(--primary-light);
  cursor: not-allowed;
}

/* 로딩 스피너 */
.spinner {
  width: 20px;
  height: 20px;
  border: 2px solid var(--light-gray);
  border-radius: 50%;
  border-top-color: var(--white);
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* 로그인 푸터 */
.login-footer {
  text-align: center;
  color: var(--gray);
}

.signup-link {
  background: none;
  border: none;
  color: var(--primary);
  cursor: pointer;
  padding: 0;
  font-weight: 500;
  transition: color 0.2s;
}

.signup-link:hover {
  color: var(--primary-dark);
  text-decoration: underline;
}

/* 반응형 스타일 */
@media (max-width: 576px) {
  .login-container {
    padding: 1.5rem;
  }
}
</style>