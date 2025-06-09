<template>
  <div class="admin-page">
    <!-- 신고 목록 -->
    <div class="report-list">
      <div v-if="reportees.length === 0" class="empty-state">
        <i class="bi bi-clipboard-check"></i>
        <p>처리할 신고가 없습니다.</p>
      </div>
      <div v-else class="reports-container">
        <ReportItem 
          v-for="reportee in reportees" 
          :key="reportee.id"
          :reportee="reportee"
          @banned-user="openBanModal"
          @pass-report="openConfirmModal">
        </ReportItem>
      </div>
    </div>
    
    <!-- 사용자 정지 모달 -->
    <BanModal
      v-if="showBanModal"
      :reportee="reportee"
      @close="closeBanModal"
      @submit="handleBan"
    />

    <ConfirmModal
      v-model="shwoPassConfirmModal"
      title="신고 무시 확인"
      message="이 신고를 무시하시겠습니까?"
      confirm-text="무시"
      cancel-text="취소"
      @confirm="handlePassReport"
      @cancel="closeConfirmModal"
    />
  </div>
</template>

<script setup>
import { ref, computed, onBeforeMount } from 'vue';
import { getReportsApi, postBanApi } from '@/entities';
import ConfirmModal from '@/widgets/modal/ConfirmModal.vue';
import ReportItem from './components/ReportItem.vue';
import BanModal from './components/BanModal.vue';

// 모달 상태
const showBanModal = ref(false);
const reportees = ref([]);
const reportee = ref(null);
const shwoPassConfirmModal = ref(false);
const passedReporteeId = ref(null);


// 사용자 정지 모달
const openBanModal = (selectedMember) => {
  reportee.value = selectedMember;
  showBanModal.value = true;
};

const closeBanModal = () => {
  showBanModal.value = false;
  reportee.value = null;
};


// 사용자 정지 요청
const handleBan = async (banData) => {
  await postBanApi(banData);
  
  const result = await getReportsApi();
  reportees.value = result.reportees;
  
  closeBanModal();
};


// 신고 무시 요청
const openConfirmModal = (id) => {
  passedReporteeId.value = id;
  shwoPassConfirmModal.value = true;
}

const closeConfirmModal = () => {
  shwoPassConfirmModal.value = false;
  passedReporteeId.value = null;
}

const handlePassReport = async () => {
  await postBanApi({ reporteeId: passedReporteeId.value, duration: 'ZERO', reason: '' });
  
  const result = await getReportsApi();
  reportees.value = result.reportees;
}


onBeforeMount(async () => {
  const result = await getReportsApi();
  reportees.value = result.reportees;
})
</script>

<style scoped>
/* 부트스트랩 아이콘 CDN */
@import url("https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.1/font/bootstrap-icons.css");

/* 전체 컨테이너 */
.admin-page {
  max-width: 1140px;
  margin: 0 auto;
  padding: 0 16px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
  color: var(--dark);
  min-height: 100vh;
}

.report-list {
  padding: 20px;
}

.empty-state {
  display: flex;
  min-height: 60vh;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 0;
  color: var(--gray);
}

.empty-state i {
  font-size: 48px;
  margin-bottom: 16px;
}

.empty-state p {
  font-size: 16px;
}

/* 반응형 스타일 */
@media (max-width: 768px) {
  .admin-page {
    padding: 16px;
  }
}
</style>