<template>
  <div class="post-notification-page">
    <div class="container">
      <div class="page-header">
        <h1>공지사항 작성</h1>
        <button class="back-button" @click="goBack">
          <i class="bi bi-arrow-left"></i>
          목록으로
        </button>
      </div>
      
      <NotificationForm 
        :notification="notification"
        :is-submitting="isSubmitting"
        @submit="handleSubmit"
        @cancel="goBack"
      />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import NotificationForm from '@/pages/notification/components/NotificationForm.vue';
import { postNotificationApi } from '@/entities/notification/postNotificationApi';

const router = useRouter();
// 공지사항 데이터
const notification = ref({
  title: '',
  content: ''
});

const isSubmitting = ref(false);

// 뒤로 가기
const goBack = () => {
  if (notification.value.title || notification.value.content) {
    if (confirm('작성 중인 내용이 있습니다. 정말 나가시겠습니까?')) {
      console.log('목록 페이지로 이동');
      router.go(-1);
    }
  } else {
    console.log('목록 페이지로 이동');
    router.go(-1);
  }
};

// 폼 제출 처리
const handleSubmit = async (formData) => {
  try {
    isSubmitting.value = true;
    notification.value = {
      ...notification.value,
      ...formData
    };
    
    console.log('공지사항 등록:', notification.value);
    await postNotificationApi(notification.value.title, notification.value.content);

    // 성공 시 목록 페이지로 이동
    alert('공지사항이 등록되었습니다.');
    router.push('/notification');
  } catch (error) {
    console.error('공지사항 등록 실패:', error);
    alert('공지사항 등록에 실패했습니다. 다시 시도해주세요.');
  } finally {
    isSubmitting.value = false;
  }
};
</script>

<style scoped>
.post-notification-page {
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

@media (max-width: 1140px) {
  .post-notification-page {
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