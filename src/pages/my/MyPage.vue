<template>
  <div class="my-page">
    <!-- 프로필 헤더 -->
    <div class="profile-header">
      <h1 class="profile-name">{{ member.nickname }}</h1>
      <p class="profile-username">{{ member.username }}</p>
    </div>

    <!-- 내 정보 섹션 -->
    <div class="section">
      <div class="section-header">
        <h2>내 정보</h2>
        <button class="edit-button" @click="openEditModal">
          <i class="bi bi-pencil"></i> 수정
        </button>
      </div>

      <!-- 정보 카드 컴포넌트 사용 -->
      <div class="info-card">
        <InfoCard label="닉네임" :value="member.nickname" icon="bi-person-fill"/>
        <InfoCard label="생년월일" :value="formatDate()" icon="bi-calendar-date"/>
        <InfoCard label="성별" :value="formatGender()" icon="bi-gender-ambiguous"/>
        <InfoCard label="전화번호" :value="formatTel()" icon="bi-telephone-fill"/>
      </div>
    </div>

    <!-- 활동 내역 섹션 -->
    <div class="section">
      <h2>활동 내역</h2>
      <div class="activity-buttons">
        <button class="activity-button" @click="navigateToFavorites">
          <div class="activity-icon">
            <i class="bi bi-heart-fill"></i>
          </div>
          <span>좋아요 한 게시글</span>
          <i class="bi bi-chevron-right"></i>
        </button>

        <button class="activity-button" @click="navigateToInterestAreas">
          <div class="activity-icon">
            <i class="bi bi-geo-alt-fill"></i>
          </div>
          <span>관심 지역</span>
          <i class="bi bi-chevron-right"></i>
        </button>
      </div>
    </div>

    <!-- 계정 관리 섹션 -->
    <div class="section">
      <h2>계정 관리</h2>
      <div class="account-actions">
        <button class="action-button password" @click="navigateToPasswordUpdate">
          <i class="bi bi-lock-fill"></i>
          <span>비밀번호 변경</span>
        </button>
        <button class="action-button logout" @click="logout">
          <i class="bi bi-box-arrow-right"></i>
          <span>로그아웃</span>
        </button>
        <button class="action-button delete" @click="openDeleteModal">
          <i class="bi bi-person-x-fill"></i>
          <span>회원 탈퇴</span>
        </button>
      </div>
    </div>

    <EditModal 
      :show="showEditModal" 
      :member="member" 
      @close="closeEditModal" 
      @save="editMember" 
    />

    <DeleteModal 
      :show="showDeleteModal" 
      @close="closeDeleteModal" 
      @delete="deleteAccount" 
    />
  </div>
</template>

<script setup>
import { ref, computed, onBeforeMount, watch } from 'vue';
import { useRouter } from 'vue-router';
import { storeToRefs } from 'pinia';
import { useMemberStore } from '@/features/member/memberStore.js';
import { signOut } from '@/shared/action/signOut'
import InfoCard from './components/InfoCard.vue';
import EditModal from './components/EditModal.vue';
import DeleteModal from './components/DeleteModal.vue';

const router = useRouter();

// 사용자 정보 데이터
const memberStore = useMemberStore();
const { member } = storeToRefs(memberStore);
// 모달 상태
const showEditModal = ref(false);
const showDeleteModal = ref(false);


onBeforeMount(() => {
  memberStore.getMember();
});

const formatDate = () => {
  if (!member.value.birthday) return '-'; 

  const date = new Date(member.value.birthday);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}년 ${month}월 ${day}일`;
};

const formatGender = () => {
  if (!member.value.gender) return '-';
  if (member.value.gender === 'M') return '남성';
  return '여성';
}

const formatTel = () => {
  if (!member.value.tel) return '-';
  return member.value.tel;
};


// 네비게이션
const navigateToPasswordUpdate = () => {
  router.push({ name: 'passwordUpdate' });
};

const navigateToFavorites = () => {
  router.push({ name: 'articleLike' });
};

const navigateToInterestAreas = () => {
  router.push({ name: 'boardList' });
};


// 수정
const openEditModal = () => {
  showEditModal.value = true;
};

const closeEditModal = () => {
  showEditModal.value = false;
};

const editMember = async (newMemberForm) => {
  const succeed = await memberStore.tryUpdateMember(newMemberForm);
  if (!succeed) {
    alert("사용자 정보 수정에 실패했습니다.");
  }
  closeEditModal();
};


// 로그아웃
const logout = async () => {
  const result = await signOut();
  
  if (result === false) {
    alert("로그아웃에 실패했습니다.");
    return;
  }

  router.push({ name: 'main' });
};


// 탈퇴
const openDeleteModal = () => {
  showDeleteModal.value = true;
};

const closeDeleteModal = () => {
  showDeleteModal.value = false;
};

const deleteAccount = (password) => {
  // TODO: 회원 탈퇴 구현
  alert('회원 탈퇴가 완료되었습니다.');
  closeDeleteModal();
};
</script>

<style scoped>
@import url("https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.1/font/bootstrap-icons.css");

/* 전체 컨테이너 */
.my-page {
  max-width: 1140px;
  margin: 0 auto;
  padding: 16px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
  color: var(--dark);
}

/* 프로필 헤더 */
.profile-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 24px;
  padding: 24px 0;
}

.profile-name {
  font-size: 24px;
  font-weight: 700;
  margin-bottom: 4px;
  color: var(--dark);
}

.profile-username {
  font-size: 16px;
  color: var(--gray);
}

/* 사용자 정보 */
.info-card {
  background-color: var(--light);
  border-radius: var(--border-radius);
  overflow: hidden;
}

/* 섹션 공통 스타일 */
.section {
  width: 800px;
  margin: 0 auto;
  margin-bottom: 24px;
  background-color: var(--white);
  border-radius: var(--border-radius);
  padding: 16px;
  box-shadow: var(--shadow);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.section h2 {
  font-size: 18px;
  font-weight: 600;
  color: var(--dark);
  margin: 0 0 16px 0;
}

.edit-button {
  background-color: transparent;
  color: var(--primary);
  border: none;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
}

.edit-button i {
  margin-right: 4px;
}

/* 활동 버튼 스타일 */
.activity-buttons {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.activity-button {
  display: flex;
  align-items: center;
  padding: 16px;
  border-radius: var(--border-radius);
  background-color: var(--light);
  border: none;
  cursor: pointer;
  font-size: 16px;
  font-weight: 500;
  text-align: left;
  transition: background-color 0.2s;
}

.activity-button:hover {
  background-color: var(--light-gray);
}

.activity-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: var(--primary-background);
  color: var(--primary);
  margin-right: 16px;
  flex-shrink: 0;
}

.activity-button span {
  flex: 1;
}

.activity-button i.bi-chevron-right {
  color: var(--gray);
}

/* 계정 관리 버튼 */
.account-actions {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.action-button {
  display: flex;
  align-items: center;
  padding: 16px;
  border-radius: var(--border-radius);
  background-color: var(--light);
  border: none;
  cursor: pointer;
  font-size: 16px;
  font-weight: 500;
  text-align: left;
  transition: background-color 0.2s;
  color: var(--dark); /* 기본 색상으로 변경 */
}

.action-button i {
  margin-right: 12px;
  font-size: 20px;
}

.action-button.delete {
  color: #dc3545; /* 회원 탈퇴만 빨간색 */
}

.action-button:hover {
  background-color: var(--light-gray);
}

/* 반응형 스타일 */
@media (max-width: 576px) {
  .modal-content {
    width: 95%;
  }
}
</style>