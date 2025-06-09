<template>
  <div class="main-container">
    <!-- Main Content -->
    <main>
      <!-- Hero Section with Illustration -->
      <div class="hero-section">
        <div class="hero-bg-circle-1"></div>
        <div class="hero-bg-circle-2"></div>
        <div class="hero-bg-circle-3"></div>
        <div class="hero-bg-circle-4"></div>
        <div class="hero-bg-circle-5"></div>
        
        <div class="container">
          <div class="hero-content">
            <div class="hero-text">
              <span class="badge">
                신뢰할 수 있는 아파트 거래 정보
              </span>
              <h1>
                원하는 지역의<br />아파트 거래 정보를<br />한눈에 확인하세요
              </h1>
              <p>
                아파트 거래 정보부터 이웃과의 소통까지<br/>부동산의 모든 것을 홈핏에서!
              </p>
            </div>
            <div class="hero-illustration">
              <div class="illustration-bg"></div>
              <div class="building-illustration">
                <div class="building building-1"></div>
                <div class="building building-2"></div>
                <div class="building building-3"></div>
                <div class="building building-4"></div>
                <div class="building building-5"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Search Section -->
      <div class="container section">
        <div class="search-card">
          <div class="search-header">
            <div class="search-icon">
              <i class="bi bi-search"></i>
            </div>
            <div>
              <h2>아파트 거래 정보 검색</h2>
              <p>원하시는 지역의 아파트 거래 정보를 검색해보세요.</p>
            </div>
          </div>
          
          <!-- Search Form Component -->
          <search-form @search="handleSearch" />
        </div>
      </div>

      <!-- AI Chatbot Section -->
      <div class="container section">
        <div class="chatbot-card interactive-card">
          <div class="chatbot-header">
            <div class="chatbot-icon">
              <i class="bi bi-robot"></i>
            </div>
            <div class="chatbot-text">
              <h2>AI 부동산 상담</h2>
              <p>계약서 검토부터 부동산 지식까지, AI가 도와드립니다.</p>
            </div>
          </div>
          
          <div class="chatbot-content">
            <div class="chatbot-features">
              <div class="feature-item">
                <i class="bi bi-file-text"></i>
                <span>계약서 검토</span>
              </div>
              <div class="feature-item">
                <i class="bi bi-question-circle"></i>
                <span>부동산 지식 질의</span>
              </div>
              <div class="feature-item">
                <i class="bi bi-shield-check"></i>
                <span>전문적인 조언</span>
              </div>
            </div>
            
            <div class="chatbot-actions">
              <button 
                v-if="isLoggedIn" 
                class="btn-chatbot" 
                @click="goToChatbot"
              >
                <i class="bi bi-chat-dots"></i>
                AI 상담 시작하기
              </button>
              <div v-else class="login-required">
                <p>AI 상담 서비스는 로그인 후 이용 가능합니다.</p>
                <button class="btn-login" @click="goToLogin">
                  <i class="bi bi-person"></i>
                  로그인하기
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
    </main>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { storeToRefs } from 'pinia';
import { useDealSearchStore } from '@/features/house/dealSearchStore';
import { useMemberStore } from '@/features/member/memberStore';
import SearchForm from '@/pages/main/components/SearchForm.vue';

const router = useRouter();
const dealSearchStore = useDealSearchStore();
const memberStore = useMemberStore();
const { condition } = storeToRefs(dealSearchStore);

// 로그인 상태 확인
const isLoggedIn = computed(() => memberStore.member);

const handleSearch = (searchParams) => {
  condition.value.sidoCode = searchParams.sido;
  condition.value.sggCode = searchParams.sgg;
  condition.value.umdCode = searchParams.umd;
  router.push({ name: 'dealSearch' });
};

// 챗봇 페이지로 이동
const goToChatbot = () => {
  router.push('/chatbot');
};

// 로그인 페이지로 이동
const goToLogin = () => {
  router.push('/auth/sign-in');
};
</script>

<style scoped>
@import 'bootstrap-icons/font/bootstrap-icons.css';

/* 컨테이너 */
.container {
  width: 100%;
  max-width: 1140px;
  margin: 0 auto;
  padding: 0 16px;
}

.section {
  padding: 2rem 0;
}

/* 히어로 섹션 - 동적 배경 */
.hero-section {
  position: relative;
  overflow: hidden;
  background-color: var(--light);
  padding: 3rem 0;
}

.hero-bg-circle-1 {
  position: absolute;
  top: 0;
  right: 0;
  width: 300px;
  height: 300px;
  border-radius: 50%;
  background-color: var(--primary-light-background);
  transform: translate(30%, -30%);
  animation: float-1 6s ease-in-out infinite;
}

.hero-bg-circle-2 {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 300px;
  height: 300px;
  border-radius: 50%;
  background-color: var(--primary-background);
  transform: translate(-30%, 30%);
  animation: float-2 7s ease-in-out infinite;
}

.hero-bg-circle-3 {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 200px;
  height: 200px;
  border-radius: 50%;
  background-color: rgba(142, 202, 230, 0.05);
  transform: translate(-50%, -50%);
  animation: float-3 8s ease-in-out infinite;
}

.hero-bg-circle-4 {
  position: absolute;
  top: 20%;
  right: 20%;
  width: 150px;
  height: 150px;
  border-radius: 50%;
  background-color: rgba(142, 202, 230, 0.08);
  animation: float-4 5s ease-in-out infinite;
}

.hero-bg-circle-5 {
  position: absolute;
  bottom: 20%;
  right: 40%;
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background-color: rgba(33, 158, 188, 0.06);
  animation: float-5 4s ease-in-out infinite;
}

/* 배경 원들의 애니메이션 */
@keyframes float-1 {
  0%, 100% {
    transform: translate(30%, -30%) scale(1);
  }
  25% {
    transform: translate(40%, -20%) scale(1.1);
  }
  50% {
    transform: translate(20%, -40%) scale(0.9);
  }
  75% {
    transform: translate(35%, -25%) scale(1.05);
  }
}

@keyframes float-2 {
  0%, 100% {
    transform: translate(-30%, 30%) scale(1);
  }
  33% {
    transform: translate(-40%, 40%) scale(1.1);
  }
  66% {
    transform: translate(-20%, 20%) scale(0.95);
  }
}

@keyframes float-3 {
  0%, 100% {
    transform: translate(-50%, -50%) scale(1);
  }
  20% {
    transform: translate(-45%, -55%) scale(1.2);
  }
  40% {
    transform: translate(-55%, -45%) scale(0.8);
  }
  60% {
    transform: translate(-50%, -60%) scale(1.1);
  }
  80% {
    transform: translate(-40%, -50%) scale(0.9);
  }
}

@keyframes float-4 {
  0%, 100% {
    transform: translate(0, 0) scale(1);
  }
  50% {
    transform: translate(10%, 10%) scale(1.1);
  }
}

@keyframes float-5 {
  0%, 100% {
    transform: translate(0, 0) scale(1);
  }
  50% {
    transform: translate(-5%, -5%) scale(0.9);
  }
}

.hero-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  z-index: 1;
}

@media (min-width: 768px) {
  .hero-content {
    flex-direction: row;
    gap: 2rem;
  }
  
  .hero-text {
    flex: 1;
  }
  
  .hero-illustration {
    flex: 1;
    display: block;
  }
}

.hero-text {
  margin-bottom: 2rem;
}

.hero-illustration {
  position: relative;
  display: none;
}

.illustration-bg {
  position: absolute;
  top: 0;
  right: 0;
  width: 200px;
  height: 200px;
  border-radius: 50%;
  background-color: var(--primary-background);
  filter: blur(40px);
  z-index: 0;
  animation: pulse 4s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% {
    transform: scale(1);
    opacity: 0.7;
  }
  50% {
    transform: scale(1.1);
    opacity: 0.9;
  }
}

.badge {
  display: inline-block;
  padding: 0.35em 0.65em;
  font-size: 0.75em;
  font-weight: 500;
  line-height: 1;
  color: var(--primary);
  background-color: var(--primary-background);
  border-radius: 50rem;
  margin-bottom: 1rem;
}

.hero-text h1 {
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 1rem;
  color: var(--dark);
}

.hero-text p {
  font-size: 1.1rem;
  color: var(--gray);
  margin-bottom: 1.5rem;
}

/* 인터랙티브 카드 - 챗봇 카드용 */
.interactive-card {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
  /* cursor: pointer 제거 - 기본 커서 유지 */
}

.interactive-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(255, 255, 255, 0.2),
    transparent
  );
  transition: left 0.5s;
}

.interactive-card:hover {
  transform: translateY(-3px) scale(1.005);
  box-shadow: 0 12px 25px rgba(0, 0, 0, 0.08);
}

.interactive-card:hover::before {
  left: 100%;
}

.interactive-card:hover .chatbot-icon {
  transform: scale(1.1);
  box-shadow: 0 8px 25px var(--primary-background);
}

/* 검색 카드 - 호버 효과 제거 */
.search-card {
  background-color: var(--white);
  border-radius: var(--border-radius);
  box-shadow: var(--shadow);
  padding: 1.5rem;
  border: 1px solid var(--light-gray);
}

.search-header {
  display: flex;
  align-items: center;
  margin-bottom: 1.5rem;
}

.search-icon {
  width: 3rem;
  height: 3rem;
  border-radius: 50%;
  background-color: var(--primary-background);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 1rem;
}

.search-icon i {
  color: var(--primary);
  font-size: 1.25rem;
}

.search-header h2 {
  font-size: 1.5rem;
  font-weight: 700;
  margin: 0;
  color: var(--dark);
}

.search-header p {
  color: var(--gray);
  margin: 0;
}

/* 챗봇 카드 */
.chatbot-card {
  background-color: var(--white);
  border-radius: var(--border-radius);
  box-shadow: var(--shadow);
  padding: 2rem;
  border: 1px solid var(--light-gray);
  position: relative;
}

.chatbot-header {
  display: flex;
  align-items: center;
  margin-bottom: 2rem;
}

.chatbot-icon {
  width: 3.5rem;
  height: 3.5rem;
  border-radius: 50%;
  background-color: var(--primary);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 1.5rem;
  box-shadow: 0 4px 12px var(--primary-background);
  transition: all 0.3s ease;
  cursor: pointer; /* 아이콘에만 클릭 커서 */
}

.chatbot-icon i {
  color: var(--white);
  font-size: 1.5rem;
  transition: all 0.3s ease;
}

.chatbot-text h2 {
  font-size: 1.75rem;
  font-weight: 700;
  margin: 0 0 0.5rem 0;
  color: var(--dark);
}

.chatbot-text p {
  color: var(--gray);
  margin: 0;
  font-size: 1.1rem;
}

.chatbot-content {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

@media (min-width: 768px) {
  .chatbot-content {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  }
}

.chatbot-features {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

@media (min-width: 768px) {
  .chatbot-features {
    flex-direction: row;
    gap: 2rem;
  }
}

.feature-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  background-color: var(--light);
  border-radius: 8px;
  box-shadow: var(--shadow);
  border: 1px solid var(--light-gray);
  transition: all 0.2s ease;
}

.interactive-card:hover .feature-item {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.feature-item i {
  color: var(--primary);
  font-size: 1.25rem;
}

.feature-item span {
  font-weight: 500;
  color: var(--dark);
}

.chatbot-actions {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

/* 버튼에만 클릭 커서 적용 */
.btn-chatbot {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem 2rem;
  background-color: var(--primary);
  color: var(--white);
  border: none;
  border-radius: 50px;
  font-weight: 600;
  font-size: 1.1rem;
  cursor: pointer; /* 버튼에만 클릭 커서 */
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px var(--primary-background);
  min-width: 200px;
  justify-content: center;
}

.btn-chatbot:hover {
  background-color: var(--primary-dark);
  transform: translateY(-3px) scale(1.05);
  box-shadow: 0 8px 25px var(--primary-background);
}

.btn-chatbot i {
  font-size: 1.25rem;
}

.login-required {
  text-align: center;
}

.login-required p {
  color: var(--gray);
  margin-bottom: 1rem;
  font-size: 0.95rem;
}

.btn-login {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background-color: var(--white);
  color: var(--primary);
  border: 2px solid var(--primary);
  border-radius: 50px;
  font-weight: 500;
  cursor: pointer; /* 버튼에만 클릭 커서 */
  transition: all 0.3s ease;
  justify-content: center;
}

.btn-login:hover {
  background-color: var(--primary);
  color: var(--white);
  transform: translateY(-2px) scale(1.03);
  box-shadow: 0 6px 15px var(--primary-background);
}

/* 빌딩 일러스트레이션 */
.building-illustration {
  position: relative;
  width: 300px;
  height: 300px;
  margin: 0 auto;
}

.building {
  position: absolute;
  bottom: 0;
  background-color: var(--white);
  border: 2px solid var(--primary);
  border-radius: 8px 8px 0 0;
  box-shadow: 0 4px 6px var(--primary-light-background);
  transition: all 0.3s ease;
}

.building:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 15px var(--primary-background);
}

.building-1 {
  left: 20px;
  width: 60px;
  height: 180px;
  background-color: var(--primary-light-background);
  animation: building-sway 5s ease-in-out infinite;
}

.building-2 {
  left: 90px;
  width: 70px;
  height: 220px;
  background-color: var(--primary-background);
  animation: building-sway 6s ease-in-out infinite 0.5s;
}

.building-3 {
  left: 170px;
  width: 80px;
  height: 250px;
  background-color: var(--primary-light-background);
  animation: building-sway 7s ease-in-out infinite 1s;
}

.building-4 {
  left: 260px;
  width: 50px;
  height: 150px;
  background-color: var(--primary-background);
  animation: building-sway 4s ease-in-out infinite 0.75s;
}

.building-5 {
  left: 0;
  width: 40px;
  height: 120px;
  background-color: var(--primary-light-background);
  animation: building-sway 5.5s ease-in-out infinite 0.25s;
}

@keyframes building-sway {
  0%, 100% {
    transform: translateY(0) rotate(0deg);
  }
  25% {
    transform: translateY(-3px) rotate(0.5deg);
  }
  50% {
    transform: translateY(-1px) rotate(0deg);
  }
  75% {
    transform: translateY(-2px) rotate(-0.3deg);
  }
}

.building::before {
  content: "";
  position: absolute;
  top: 20px;
  left: 10px;
  right: 10px;
  bottom: 20px;
  background: repeating-linear-gradient(
    to bottom,
    transparent,
    transparent 15px,
    var(--primary-light-background) 15px,
    var(--primary-light-background) 20px
  );
}

.building::after {
  content: "";
  position: absolute;
  top: 10px;
  left: 50%;
  transform: translateX(-50%);
  width: 20px;
  height: 10px;
  background-color: var(--primary-light);
  border-radius: 3px;
}

/* 반응형 스타일 */
@media (max-width: 768px) {
  .interactive-card:hover {
    transform: translateY(-4px) scale(1.01);
  }
  
  .chatbot-header {
    flex-direction: column;
    text-align: center;
    gap: 1rem;
  }
  
  .chatbot-icon {
    margin-right: 0;
  }
  
  .chatbot-features {
    gap: 1rem;
  }
  
  .feature-item {
    justify-content: center;
  }
}

/* 접근성을 위한 애니메이션 비활성화 */
@media (prefers-reduced-motion: reduce) {
  .hero-bg-circle-1,
  .hero-bg-circle-2,
  .hero-bg-circle-3,
  .illustration-bg,
  .building {
    animation: none;
  }
  
  .interactive-card {
    transition: none;
  }
}
</style>