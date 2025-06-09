<template>
  <div class="notification-detail-page">
    <div class="container">
      <!-- 로딩 상태 -->
      <LoadingPage v-if="loading" text="공지사항을 불러오는 중입니다..." />

      <!-- 에러 상태 -->
      <ErrorPage
        v-else-if="error"
        title="공지사항을 불러오는데 실패했습니다"
        :message="error"
        action-text="다시 시도"
        @action="fetchNotificationDetail"
      />

      <!-- 공지사항 상세 내용 -->
      <template v-else>
        <div class="notification-card">
          <div class="notification-content">
            <!-- 제목 및 배지 -->
            <div class="title-section">
              <div class="badges">
                <span v-if="notification.isImportant" class="badge important-badge">중요</span>
                <span v-if="isNew" class="badge new-badge">NEW</span>
              </div>
              <h1 class="notification-title">{{ notification.title }}</h1>
              <div class="notification-meta">
                <div class="meta-item">
                  <i class="bi bi-calendar3"></i>
                  <span>{{ formatDate(notification.createdAt) }}</span>
                </div>
                
                <!-- 마지막 업데이트 시간 표시 -->
                <div v-if="notification.lastUpdatedAt" class="meta-item updated">
                  <i class="bi bi-pencil"></i>
                  <span>{{ formatDate(notification.lastUpdatedAt) }} 수정됨</span>
                </div>
              </div>
            </div>

            <!-- 공지사항 본문 - ByteMD Viewer로 마크다운 렌더링 -->
            <div class="notification-body">
              <Viewer 
                :value="notification.content || ''"
                :plugins="viewerPlugins"
              />
            </div>
          </div>
        </div>
        
        <!-- 작성자 액션 버튼 -->
        <div class="admin-actions" v-if="isWriter">
          <NotificationActions 
            @edit="goToEditPage" 
            @delete="handleDelete" 
          />
        </div>
      </template>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { Viewer } from '@bytemd/vue-next';
import gfm from '@bytemd/plugin-gfm';
import highlight from '@bytemd/plugin-highlight';

// ByteMD 스타일 import
import 'bytemd/dist/index.css';
import 'highlight.js/styles/default.css';

import LoadingPage from "@/pages/loading/LoadingPage.vue";
import ErrorPage from "@/pages/error/ErrorPage.vue";
import NotificationActions from "./components/NotificationActions.vue";
import { useMemberStore } from "@/features/member/memberStore";
import { getNotificationDetailApi } from "@/entities/notification/getNotificationDetailApi";
import { deleteNotificationApi } from "@/entities/notification/deleteNotificationApi";

const route = useRoute();
const router = useRouter();
const memberStore = useMemberStore();

// 상태 관리
const notification = ref({});
const loading = ref(false);
const error = ref(null);

// ByteMD 뷰어 플러그인 설정 (폼과 동일하게)
const viewerPlugins = [
  gfm(), // GitHub Flavored Markdown
  highlight() // 코드 하이라이팅
];

// 작성자 여부 확인
const isWriter = computed(() => {
  return String(memberStore.member.id) === String(notification.value.writerId);
});

// 새 공지사항 여부 확인
const isNew = computed(() => {
  if (!notification.value.createdAt) return false;
  try {
    const date = new Date(notification.value.createdAt);
    if (isNaN(date.getTime())) {
      console.error('잘못된 날짜 형식:', notification.value.createdAt);
      return false;
    }
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 7;
  } catch (error) {
    console.error('날짜 비교 에러:', error);
    return false;
  }
});

// API 호출 함수
const fetchNotificationDetail = async () => {
  if (loading.value) return;
  console.log('API 호출 시작 - ID:', route.params.id);
  try {
    loading.value = true;
    error.value = null;
    const response = await getNotificationDetailApi(route.params.id);
    if (response) {
      console.log("공지사항 상세 데이터:", response);
      notification.value = response;
    } else {
      console.error('응답 데이터가 없습니다');
      error.value = '데이터를 불러오는데 실패했습니다.';
    }
  } catch (err) {
    console.error('API 호출 에러:', err);
    error.value = err.message;
  } finally {
    loading.value = false;
  }
};

// 날짜 포맷팅
const formatDate = (dateString) => {
  if (!dateString) return '';
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      console.error('잘못된 날짜 형식:', dateString);
      return dateString;
    }
    return new Intl.DateTimeFormat("ko-KR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  } catch (error) {
    console.error('날짜 포맷팅 에러:', error);
    return dateString;
  }
};

// 메서드
const goToEditPage = () => {
  console.log("공지사항 수정 페이지로 이동");
  router.push(`/notification/modify/${route.params.id}`);
};

const handleDelete = async () => {
  if (confirm('정말 이 공지사항을 삭제하시겠습니까?')) {
    try {
      console.log("공지사항 삭제 요청");
      await deleteNotificationApi(route.params.id);
      alert('공지사항이 삭제되었습니다.');
      router.push('/notification');
    } catch (err) {
      console.error('삭제 에러:', err);
      alert('삭제에 실패했습니다. 다시 시도해주세요.');
    }
  }
};

onMounted(() => {
  console.log('컴포넌트 마운트됨');
  console.log('현재 라우트 파라미터:', route.params);
  if (route.params.id) {
    fetchNotificationDetail();
  } else {
    console.error('ID가 없습니다');
    error.value = '잘못된 접근입니다.';
  }
});
</script>

<style scoped>
.notification-detail-page {
  min-height: 100vh;
  background-color: var(--white);
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

.notification-card {
  background-color: var(--white);
  margin-bottom: 2rem;
}

.notification-content {
  padding: 0.5rem;
}

.title-section {
  margin-bottom: 1.5rem;
}

.badges {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 0.75rem;
}

.badge {
  font-size: 0.75rem;
  font-weight: 500;
  padding: 0.25rem 0.5rem;
  border-radius: 50rem;
  white-space: nowrap;
}

.important-badge {
  background-color: var(--orangeBackground);
  color: var(--orange);
}

.new-badge {
  background-color: var(--primary-background);
  color: var(--primary);
}

.notification-title {
  font-size: 1.25rem;
  font-weight: 600;
  margin: 0 0 0.5rem 0;
  color: var(--dark);
  line-height: 1.4;
}

.notification-meta {
  font-size: 0.875rem;
  color: var(--gray);
  margin-bottom: 1rem;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid var(--light-gray);
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.meta-item.updated {
  color: var(--primary);
  font-style: italic;
}

.notification-body {
  padding-bottom: 1rem;
  border-bottom: 1px solid var(--light-gray);
}

/* ByteMD Viewer 커스텀 스타일 - 폼의 미리보기와 완전히 동일 */
:deep(.bytemd-body) {
  font-family: var(--font-family);
  font-size: 1rem;
  line-height: 1.6;
  color: var(--dark);
  padding: 0;
}

:deep(.bytemd-body h1) {
  font-size: 1.5rem;
  font-weight: 700;
  margin: 1.5rem 0 1rem 0;
  color: var(--dark);
  border-bottom: 2px solid var(--light-gray);
  padding-bottom: 0.5rem;
}

:deep(.bytemd-body h2) {
  font-size: 1.25rem;
  font-weight: 600;
  margin: 1.25rem 0 0.75rem 0;
  color: var(--dark);
}

:deep(.bytemd-body h3) {
  font-size: 1.125rem;
  font-weight: 600;
  margin: 1rem 0 0.5rem 0;
  color: var(--dark);
}

:deep(.bytemd-body p) {
  margin: 0.75rem 0;
  line-height: 1.6;
}

:deep(.bytemd-body strong) {
  font-weight: 700;
  color: var(--dark);
}

:deep(.bytemd-body em) {
  font-style: italic;
  color: var(--gray);
}

:deep(.bytemd-body code) {
  background-color: var(--light);
  padding: 0.125rem 0.375rem;
  border-radius: 4px;
  font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
  font-size: 0.875em;
  color: var(--primary);
  border: 1px solid var(--light-gray);
}

:deep(.bytemd-body pre) {
  background-color: var(--light);
  border: 1px solid var(--light-gray);
  border-radius: var(--border-radius);
  padding: 1rem;
  margin: 1rem 0;
  overflow-x: auto;
}

:deep(.bytemd-body pre code) {
  background: none;
  border: none;
  padding: 0;
  color: var(--dark);
}

:deep(.bytemd-body blockquote) {
  border-left: 4px solid var(--primary);
  margin: 1rem 0;
  color: var(--gray);
  font-style: italic;
  background-color: var(--light);
  padding: 1rem 1rem 1rem 1.5rem;
  border-radius: 0 var(--border-radius) var(--border-radius) 0;
  position: relative;
}

:deep(.bytemd-body blockquote p) {
  margin: 0;
  line-height: 1.6;
}

:deep(.bytemd-body blockquote p:not(:last-child)) {
  margin-bottom: 0.5rem;
}

:deep(.bytemd-body ul),
:deep(.bytemd-body ol) {
  padding-left: 1.5rem;
  margin: 1rem 0;
}

:deep(.bytemd-body li) {
  margin: 0.5rem 0;
  line-height: 1.6;
}

:deep(.bytemd-body a) {
  color: var(--primary);
  text-decoration: none;
  border-bottom: 1px solid transparent;
  transition: border-color 0.2s;
}

:deep(.bytemd-body a:hover) {
  border-bottom-color: var(--primary);
}

:deep(.bytemd-body table) {
  width: 100%;
  border-collapse: collapse;
  margin: 1rem 0;
  border: 1px solid var(--light-gray);
  border-radius: var(--border-radius);
  overflow: hidden;
}

:deep(.bytemd-body th),
:deep(.bytemd-body td) {
  border: 1px solid var(--light-gray);
  padding: 0.75rem;
  text-align: left;
}

:deep(.bytemd-body th) {
  background-color: var(--light);
  font-weight: 600;
  color: var(--dark);
}

:deep(.bytemd-body tr:nth-child(even)) {
  background-color: var(--light);
}

:deep(.bytemd-body hr) {
  border: none;
  border-top: 1px solid var(--light-gray);
  margin: 2rem 0;
}

/* 체크박스 리스트 스타일 */
:deep(.bytemd-body .task-list-item) {
  list-style: none;
  margin-left: -1.5rem;
}

:deep(.bytemd-body .task-list-item input) {
  margin-right: 0.5rem;
}

.admin-actions {
  display: flex;
  justify-content: flex-end;
  margin-top: 1.5rem;
}

@media (max-width: 768px) {
  .container {
    padding: 1rem;
  }
  
  .notification-title {
    font-size: 1.125rem;
  }
  
  .notification-meta {
    gap: 0.75rem;
  }
  
  :deep(.bytemd-body h1) {
    font-size: 1.25rem;
  }
  
  :deep(.bytemd-body h2) {
    font-size: 1.125rem;
  }
  
  :deep(.bytemd-body h3) {
    font-size: 1rem;
  }
}
</style>
