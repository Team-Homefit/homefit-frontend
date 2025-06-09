<template>
  <div class="ban-page">
    <div class="page-header">
      <h1>서비스 이용 제한 안내</h1>
    </div>

    <div class="ban-container">
      <!-- 단계 1: 정지 정보 표시 -->
      <div v-if="currentStep === 1" class="step-container">
        <BanInfo 
          :ban-info="banInfo" 
          @continue="goToNextStep" 
        />
      </div>

      <!-- 단계 2: 반성문 작성 -->
      <div v-if="currentStep === 2" class="step-container">
        <ApologyForm 
          :ban-info="banInfo" 
          @submit="handleApologySubmit" 
          @back="goToBeforeStep"
        />
      </div>

      <!-- 단계 3: 결과 표시 -->
      <div v-if="currentStep === 3" class="step-container">
        <BanResult 
          :ban-info="banInfo"
          @go-to-home="goToHome" 
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeMount } from 'vue';
import BanInfo from './components/BanInfo.vue';
import ApologyForm from './components/ApologyForm.vue';
import BanResult from './components/BanResult.vue';
import { getBanApi, postApologyApi } from '@/entities';
import { useMemberStore } from '@/features/member/memberStore';

// 현재 단계
const currentStep = ref(1);
const banInfo = ref({});
const memberStore = useMemberStore();

onBeforeMount(async () => {
  const response = await getBanApi();

  banInfo.value = response;
  if (banInfo.value.submitApology === true) {
    currentStep.value = 3;
  }
});


const goToBeforeStep = () => {
  if (currentStep.value == 1) {
    return;
  }

  currentStep.value--;
}

const goToNextStep = () => {
  if (currentStep.value < 3) {
    currentStep.value++;
  }
};


// 반성문 제출
const handleApologySubmit = async () => {
  const response = await postApologyApi({ banId: banInfo.value.banId });

  if (response === false) {
    alert("동의서 제출 중에 오류가 발생하였습니다.");
    return;
  }

  await memberStore.getMember();
  banInfo.value.submitApology = true;
  
  goToNextStep();
};

// 홈으로 이동
const goToHome = () => {
  // 실제 구현에서는 홈 페이지로 이동
  window.location.href = '/';
};
</script>

<style scoped>
@import url("https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.1/font/bootstrap-icons.css");

/* 전체 컨테이너 */
.ban-page {
  max-width: 768px;
  margin: 0 auto;
  padding: 24px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
  color: var(--dark);
  min-height: 100vh;
}

/* 페이지 헤더 */
.page-header {
  text-align: center;
  margin-bottom: 32px;
}

.page-header h1 {
  font-size: 24px;
  font-weight: 600;
  color: #dc3545;
}

/* 정지 컨테이너 */
.ban-container {
  background-color: var(--white);
  border-radius: var(--border-radius);
  box-shadow: var(--shadow);
  overflow: hidden;
}

/* 단계 컨테이너 */
.step-container {
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

/* 반응형 스타일 */
@media (max-width: 576px) {
  .ban-page {
    padding: 16px;
  }
}
</style>