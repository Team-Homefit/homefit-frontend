<template>
  <div class="modify-notification-page">
    <div class="container">
      <div class="page-header">
        <h1>공지사항 수정</h1>
        <button class="back-button" @click="goBack">
          <i class="bi bi-arrow-left"></i>
          목록으로
        </button>
      </div>
      
      <div v-if="isLoading" class="loading-container">
        <div class="loading-spinner"></div>
        <p>공지사항을 불러오는 중입니다...</p>
      </div>
      
      <div v-else-if="error" class="error-container">
        <i class="bi bi-exclamation-triangle"></i>
        <p>{{ error }}</p>
        <button class="retry-button" @click="fetchNotification">다시 시도</button>
      </div>
      
      <NotificationForm 
        v-else
        :notification="notification"
        :is-submitting="isSubmitting"
        :is-modify="true"
        @submit="handleSubmit"
        @cancel="goBack"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import NotificationForm from '@/pages/notification/components/NotificationForm.vue';
import { getNotificationDetailApi } from '@/entities/notification/getNotificationDetailApi';
import { useRoute, useRouter } from 'vue-router';
import { updateNotificationApi } from '@/entities/notification/updateNotificationApi';


// 상태 변수
const notification = ref({
  id: null,
  title: '',
  content: '',
  createdAt: null,
  updatedAt: null
});

const isLoading = ref(true);
const isSubmitting = ref(false);
const error = ref(null);
const router = useRouter();
const route = useRoute();
const notificationId = route.params.id;

// 공지사항 데이터 가져오기
const fetchNotification = async () => {
  try {
    isLoading.value = true;
    error.value = null;
    
    const response = await getNotificationDetailApi(notificationId);
    notification.value = response;
  } catch (err) {
    console.error('공지사항 조회 실패:', err);
    error.value = '공지사항을 불러오는데 실패했습니다. 다시 시도해주세요.';
  } finally {
    isLoading.value = false;  
  }
};

// 뒤로 가기
const goBack = () => {
  console.log('목록 페이지로 이동');
  router.push('/notification');
};

// 폼 제출 처리
const handleSubmit = async (formData) => {
  try {
    isSubmitting.value = true;
    notification.value = {
      ...notification.value,
      ...formData
    };
    
    // 실제로는 API 호출하여 공지사항 수정
    console.log('공지사항 수정:', notification.value);
    await updateNotificationApi(notificationId, notification.value);
    // 성공 시 목록 페이지로 이동
    alert('공지사항이 수정되었습니다.');
    router.push('/notification');
  } catch (error) {
    console.error('공지사항 수정 실패:', error);
    alert('공지사항 수정에 실패했습니다. 다시 시도해주세요.');
  } finally {
    isSubmitting.value = false;
  }
};

// 컴포넌트 마운트 시 공지사항 데이터 가져오기
onMounted(fetchNotification);
</script>

<style scoped>
.modify-notification-page {
  min-height: 100vh;
  background-color: var(--light);
  padding: 1.5rem;
  font-family: 'Noto Sans KR', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
}

.container {
  max-width: 1140px;
  margin: 0 auto;
  background-color: var(--white);
  border-radius: var(--border-radius);
  box-shadow: var(--shadow);
  padding: 2rem;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid var(--light-gray);
}

.page-header h1 {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--dark);
  margin: 0;
}

.back-button {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: none;
  border: none;
  color: var(--primary);
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  padding: 0.5rem;
}

.back-button:hover {
  color: var(--primary-dark);
  text-decoration: underline;
}

.loading-container,
.error-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem 0;
  text-align: center;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 3px solid var(--light-gray);
  border-top: 3px solid var(--primary);
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.error-container i {
  font-size: 2rem;
  color: var(--error);
  margin-bottom: 1rem;
}

.error-container p {
  color: var(--gray);
  margin-bottom: 1rem;
}

.retry-button {
  background-color: var(--primary);
  color: var(--white);
  border: none;
  border-radius: var(--border-radius);
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
}

.retry-button:hover {
  background-color: var(--primary-dark);
}

@media (max-width: 768px) {
  .modify-notification-page {
    padding: 1rem;
  }
  
  .container {
    padding: 1.5rem;
  }
  
  .page-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
}
</style>