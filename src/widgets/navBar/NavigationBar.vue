<template>
  <div class="navbar-wrapper">
    <nav class="navbar">
      <div class="container">
        <div class="navbar-content">
          <button class="navbar-brand" @click="navigateToBack">
            <img src="@/assets/logo.png" class="logo" v-if="route.name === 'main'"></img>
            <i class="bi bi-chevron-left" v-else ></i>
            <div class="nav-bar-title"> {{ route.meta.title }} </div>
          </button>
          
          <button 
            class="mobile-toggle" 
            @click="toggleMobileMenu"
            aria-label="Toggle navigation"
          >
            <i class="bi" :class="isMobileMenuOpen ? 'bi-x-lg' : 'bi-list'"></i>
          </button>
          
          <div class="desktop-menu">
            <ul class="navbar-nav">
              <li class="nav-item" v-if="route.name !== 'main'">
                <RouterLink class="nav-link" :to="{ name: 'main' }">홈</RouterLink>
              </li>
              <li class="nav-item" v-if="member?.role === 'BASIC'">
                <RouterLink class="nav-link" :to="{ name: 'chatbot' }">챗봇</RouterLink>
              </li>
              <li class="nav-item" v-if="member?.role === 'BASIC'">
                <RouterLink class="nav-link" :to="{ name: 'dealSearch' }">아파트 거래 목록</RouterLink>
              </li>
              <li class="nav-item" v-if="member?.role === 'BASIC'">
                <RouterLink class="nav-link" :to="{ name: 'boardList' }">커뮤니티</RouterLink>
              </li>
              <li class="nav-item" v-if="member?.role === 'BASIC' || member?.role === 'ADMIN'">
                <RouterLink class="nav-link" :to="{ name: 'notificationList' }">공지</RouterLink>
              </li>
              <li class="nav-item" v-if="member?.role === 'ADMIN'">
                <RouterLink class="nav-link" :to="{ name: 'reportHistory' }">신고</RouterLink>
              </li>
              <li class="nav-item" v-if="member?.role === 'BASIC'">
                <RouterLink class="nav-link" :to="{ name: 'my' }">마이페이지</RouterLink>
              </li>
              <li class="nav-item">
                <RouterLink class="nav-link" :to="{ name: 'signIn' }" v-if="!member">로그인</RouterLink>
                <button @click="onSignOut" class="nav-link login-button" v-else>로그아웃</button>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </nav>
    
    <!-- 모바일 메뉴 오버레이 -->
    <div 
      v-if="isMobileMenuOpen" 
      class="mobile-menu-overlay"
      @click="closeMobileMenu"
    ></div>
    
    <!-- 모바일 메뉴 -->
    <div v-if="isMobileMenuOpen" class="mobile-menu">
      <div class="mobile-menu-container">
        <ul class="navbar-nav">
          <li class="nav-item"  v-if="route.name !== 'main'">
            <RouterLink class="nav-link" :to="{ name: 'main' }">홈</RouterLink>
          </li>
          <li class="nav-item" v-if="member?.role === 'BASIC'">
            <RouterLink class="nav-link" :to="{ name: 'chatbot' }">챗봇</RouterLink>
          </li>
          <li class="nav-item" v-if="member?.role == 'BASIC'">
            <RouterLink class="nav-link" :to="{ name: 'dealSearch' }">아파트 거래 목록</RouterLink>
          </li>
          <li class="nav-item" v-if="member?.role == 'BASIC'">
            <RouterLink class="nav-link" :to="{ name: 'boardList' }">커뮤니티</RouterLink>
          </li>
          <li class="nav-item" v-if="member?.role === 'BASIC' || member?.role === 'ADMIN'">
            <RouterLink class="nav-link" :to="{ name: 'notificationList' }">공지</RouterLink>
          </li>
          <li class="nav-item" v-if="member?.role === 'ADMIN'">
            <RouterLink class="nav-link" :to="{ name: 'reportHistory' }">신고</RouterLink>
          </li>
          <li class="nav-item" v-if="member?.role === 'BASIC'">
            <RouterLink class="nav-link" :to="{ name: 'my' }">마이페이지</RouterLink>
          </li>
          <li class="nav-item">
            <RouterLink class="nav-link" :to="{ name: 'signIn' }" v-if="!member">로그인</RouterLink>
            <button @click="onSignOut" class="nav-link login-button" v-else>로그아웃</button>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted, onBeforeUnmount } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { storeToRefs } from 'pinia';
import { useMemberStore } from '@/features/member/memberStore';
import { signOut } from '@/shared/action/signOut'

const router = useRouter();
const route = useRoute();


// 사용자 정보 데이터
const memberStore = useMemberStore();
const { member } = storeToRefs(memberStore);

// 모바일 네비게이션 바
const isMobileMenuOpen = ref(false);

const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value;
};

const closeMobileMenu = () => {
  isMobileMenuOpen.value = false;
};

watch(isMobileMenuOpen, (isOpen) => {
  // 모바일 메뉴가 열릴 때 body에 클래스 추가하여 스크롤 방지
  if (isOpen) {
    document.body.classList.add('mobile-menu-open');
  } else {
    document.body.classList.remove('mobile-menu-open');
  }
});

// ESC 키를 누르면 모바일 메뉴 닫기
const handleEscKey = (event) => {
  if (event.key === 'Escape' && isMobileMenuOpen.value) {
    closeMobileMenu();
  }
};


const onSignOut = async () => {
  const result = await signOut();
  
  if (result === false) {
    alert("로그아웃에 실패했습니다.");
    return;
  }

  router.replace({ name: 'main' });
}


const navigateToBack = () => {
  if (route.name === "main") {
    return;
  }

  router.go(-1)
}


onMounted(() => {
  document.addEventListener('keydown', handleEscKey);
});

onBeforeUnmount(() => {
  document.removeEventListener('keydown', handleEscKey);
  document.body.classList.remove('mobile-menu-open');
});
</script>

<style scoped>
@import url("https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.1/font/bootstrap-icons.css");

.container {
  width: 100%;
  max-width: 1140px;
  margin: 0 auto;
  padding: 0 16px;
}

/* 네비게이션 바 래퍼 */
.navbar-wrapper {
  position: relative;
  z-index: 9999; /* 매우 높은 z-index 값 */
}

.navbar {
  background-color: var(--white) !important; /* 네비게이션 바 배경색 강제 적용 */
  box-shadow: var(--shadow);
  padding: 0.75rem 0;
  position: relative;
  z-index: 9999; /* 매우 높은 z-index 값 */
}

.navbar::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: var(--white);
  z-index: -1; /* 배경을 위한 가상 요소 */
}

.navbar-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 3.5rem;
  position: relative;
  z-index: 9999; /* 매우 높은 z-index 값 */
}

.navbar-brand {
  display: flex;
  align-items: center;
  text-decoration: none;
  position: relative;
  z-index: 9999; /* 매우 높은 z-index 값 */
  border: none;
  color: none;
  background: none;
  cursor: pointer;
}

.navbar-brand i {
  color: var(--primary);
  font-size: 1.5rem;
  margin-right: 0.5rem;
}

.logo {
  width: 48px;
  margin: 2px;
}

.nav-bar-title {
  color: var(--dark);
  font-weight: 700;
  font-size: 1.25rem;
  text-decoration: none;
  line-height: 1;
  vertical-align: middle;
}

.mobile-toggle {
  display: flex;
  align-items: center;
  justify-content: center;
  background: none;
  border: none;
  color: var(--dark);
  font-size: 1.5rem;
  cursor: pointer;
  padding: 0.25rem;
  position: relative;
  z-index: 10000; /* 가장 높은 z-index 값 */
}

@media (min-width: 992px) {
  .mobile-toggle {
    display: none;
  }
}

/* 모바일 메뉴 오버레이 */
.mobile-menu-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
  z-index: 1000; /* 낮은 z-index 값 */
}

/* 데스크톱 메뉴 */
.desktop-menu {
  display: none;
  position: relative;
  z-index: 9999; /* 매우 높은 z-index 값 */
}

@media (min-width: 992px) {
  .desktop-menu {
    display: block;
  }
}

/* 모바일 메뉴 */
.mobile-menu {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  z-index: 9998; /* 네비게이션 바보다 낮지만 오버레이보다 높은 z-index 값 */
  animation: slideDown 0.3s ease-out;
}

.mobile-menu-container {
  background-color: var(--white) !important; /* 흰색 배경 강제 적용 */
  box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15);
  border-bottom-left-radius: 8px;
  border-bottom-right-radius: 8px;
  overflow: hidden; /* 내용이 경계를 넘어가지 않도록 */
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (min-width: 992px) {
  .mobile-menu {
    display: none;
  }
}

.navbar-nav {
  display: flex;
  flex-direction: column;
  padding: 0.5rem 0;
  margin: 0;
  list-style: none;
  background-color: var(--white);
}

@media (min-width: 992px) {
  .navbar-nav {
    flex-direction: row;
    padding: 0;
  }
}

.nav-item {
  margin: 0;
  background-color: var(--white); /* 각 항목의 배경색 */
}

@media (min-width: 992px) {
  .nav-item {
    margin-left: 1.5rem;
  }
}

.nav-link {
  display: block;
  padding: 0.75rem 1.5rem;
  color: var(--dark);
  text-decoration: none;
  font-weight: 500;
  transition: color 0.2s, background-color 0.2s;
  background-color: var(--white); /* 링크 배경색 */
}

.nav-link:hover {
  color: var(--primary);
  background-color: var(--primary-light-background);
}

@media (min-width: 992px) {
  .nav-link {
    padding: 0.5rem 0;
    background-color: transparent;
  }
  
  .nav-link:hover {
    background-color: transparent;
  }
}

.login-button {
  background: none;
  border: none;
  margin: 0;
  cursor: pointer;
  font-size: 1rem;
  text-align: left;
  width: 100%;
  background-color: var(--white); /* 로그인 버튼 배경색 */
}

@media (min-width: 992px) {
  .login-button {
    width: auto;
    background-color: transparent;
  }
}
</style>

<style>
/* 전역 스타일 - 모바일 메뉴가 열렸을 때 body 스크롤 방지 */
body.mobile-menu-open {
  overflow: hidden;
}
</style>