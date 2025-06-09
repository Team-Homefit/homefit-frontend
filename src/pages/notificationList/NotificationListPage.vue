<template>
  <div class="notification-list-page">
    <div class="container">
      <!-- 로딩 상태 -->
      <LoadingPage v-if="loading" text="공지사항을 불러오는 중입니다..." />

      <!-- 에러 상태 -->
      <ErrorPage
        v-else-if="error"
        title="공지사항을 불러오는데 실패했습니다"
        :message="error"
        action-text="다시 시도"
        @action="fetchNotifications(currentPage)"
      />

      <!-- 공지사항 목록 -->
      <div v-else class="notification-list">
        <NotificationItem
          v-for="(notification, index) in paginatedNotifications"
          :key="notification.id"
          :notification="notification"
          :has-border="index !== paginatedNotifications.length - 1"
          @click="goToDetail"
        />
      </div>

      <!-- 공지사항이 없을 경우 -->
      <div v-if="!loading && notifications.length === 0" class="empty-state">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="40"
          height="40"
          fill="none"
          viewBox="0 0 24 24"
          stroke="#6c757d"
          class="empty-icon"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
          />
        </svg>
        <p class="empty-text">등록된 공지사항이 없습니다</p>
      </div>

      <!-- 페이지네이션 컴포넌트 -->
      <PaginationBar v-if="!loading && notifications.length > 0"
        :current-page="currentPage"
        :total-pages="totalPages"
        :max-visible-pages="5"
        @page-change="goToPage"
      />

      <!-- 글쓰기 버튼 -->
      <FloatingWriteButton @write="goToWritePage" v-if="isAdmin"/>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import NotificationItem from "./components/NotificationItem.vue";
import PaginationBar from "@/widgets/paginationBar/PaginationBar.vue";
import LoadingPage from "@/pages/loading/LoadingPage.vue";
import ErrorPage from "@/pages/error/ErrorPage.vue";
import FloatingWriteButton from "@/widgets/floatingWriteButton/FloatingWriteButton.vue";
import { getNotificationApi } from "@/entities/notification/getNotificationApi";
import { useRouter } from "vue-router";
import { useMemberStore } from "@/features/member/memberStore";

// 상태 관리
const notifications = ref([]);
const currentPage = ref(1);
const itemsPerPage = 8;
const totalPages = ref(0);
const totalElements = ref(0);
const loading = ref(false);
const error = ref(null);
const router = useRouter();
const memberStore = useMemberStore();

// API 호출 함수
const fetchNotifications = async (page) => {
  try {
    loading.value = true;
    error.value = null;
    const response = await getNotificationApi(page, itemsPerPage);

    notifications.value = response.notifications;
    totalPages.value = response.totalPages;
    totalElements.value = response.totalElements;
    currentPage.value = response.page;
  } catch (err) {
    error.value = err.message;
  } finally {
    loading.value = false;
  }
};

// 관리자 여부 확인
const isAdmin = computed(() => {
  return memberStore.member.role === 'ADMIN';
});

const goToWritePage = () => {
  console.log("공지사항 작성 페이지로 이동");
  router.push("/notification/post");
};

// 페이지 변경 핸들러
const goToPage = async (page) => {
  if (page >= 1 && page <= totalPages.value) {
    await fetchNotifications(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
};

// 초기 데이터 로딩
onMounted(async () => {
  await fetchNotifications(currentPage.value);
});

// 현재 페이지에 표시할 공지사항 목록
const paginatedNotifications = computed(() => {
  return notifications.value;
});

// 메서드
const goToDetail = (notificationId) => {
  console.log(`공지사항 상세 페이지로 이동: ${notificationId}`);
  router.push(`/notification/${notificationId}`);
};

</script>

<style scoped>
.notification-list-page {
  min-height: 100vh;
  background-color: var(--white);
  padding: 1rem;
  font-family: "Noto Sans KR", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: var(--dark);
}

.container {
  max-width: 1140px;
  margin: 0 auto;
  padding: 0 16px;
}

.notification-list {
  display: flex;
  flex-direction: column;
  margin-bottom: 1.5rem;
  background-color: var(--white);
}

.empty-state {
  text-align: center;
  padding: 3rem 0;
  background-color: var(--white);
  border-radius: var(--border-radius);
  border: 1px solid var(--light-gray);
  margin-top: 1rem;
}

.empty-icon {
  margin-bottom: 0.5rem;
  stroke: var(--gray);
}

.empty-text {
  color: var(--gray);
  margin: 0;
}
</style>
