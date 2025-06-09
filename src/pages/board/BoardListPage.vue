<template>
  <div class="board-list-page">
    <div class="container">
      <!-- 관심지역이 없을 경우 -->
      <NoRegionState
        v-if="selectedRegions.length === 0"
        @add-region="openRegionModal"
      />
      
      <!-- 관심지역이 있는 경우 -->
      <div class="region-list" v-else>
        <!-- 지역 탭 -->
        <RegionTabs
          :regions="selectedRegions"
          :active-info="activeInfo"
          @select-region="setActiveRegion"
          @add-region="openRegionModal"
        />
        
        <!-- 게시판 목록 -->
         <!-- TODO: 게시글에 조회수 달기 -->
        <div class="board-list" v-if="articles.length > 0">
          <BoardItem
            v-for="(board, index) in articles" 
            :key="board.id"
            :board="board"
            :has-border="index !== articles.length - 1"
            @click="goToBoardDetail(board.id)"
          />
        </div>
        
        <!-- 게시글이 없을 경우 -->
        <EmptyState
          v-else
          @write="goToWritePage"
        />
        
        <!-- 페이지네이션 -->
        <div class="pagination-container" v-if="totalPages > 1">
          <PaginationBar
            :current-page="currentPage"
            :total-pages="totalPages"
            :max-visible-pages="5"
            @page-change="goToPage"
          />
        </div>
        
        <!-- 글쓰기 버튼 -->
        <FloatingWriteButton @click="goToWritePage" />
      </div>
    </div>
    
    <!-- 관심지역 선택 모달 -->
    <RegionSelectModal
      v-if="isRegionModalOpen"
      :selected-regions="selectedRegions"
      @close="closeRegionModal"
      @add-region="addRegion"
      @remove-region="removeRegion"
    />
  </div>
</template>

<script setup>
import { ref, computed, watch, nextTick, onBeforeMount } from 'vue';
import BoardItem from './components/BoardItem.vue';
import RegionTabs from './components/RegionTabs.vue';
import EmptyState from './components/EmptyState.vue';
import NoRegionState from './components/NoRegionState.vue';
import FloatingWriteButton from '@/widgets/floatingWriteButton/FloatingWriteButton.vue';
import RegionSelectModal from './components/RegionSelectModal.vue';
import PaginationBar from '../../widgets/paginationBar/PaginationBar.vue';
import { useInterestedRegionStore } from "@/features/interestedRegion/interestedRegionStore";
import { getArticlesApi } from '@/entities/board/getArticlesApi';
import { addInterestedRegionApi } from '@/entities/interestedRegion/addInterestedRegionApi';
import { deleteInterestedRegionApi } from '@/entities/interestedRegion/deleteInterestedRegionApi';
import { useRouter } from 'vue-router';

const router = useRouter();

const interestedRegionStore = useInterestedRegionStore();
const activeInfo = ref({
  boardId: '',
  code: '',
  name: ''
});
const isRegionModalOpen = ref(false);
const selectedRegions = ref([]);

onBeforeMount(async () => {
  try {
    await interestedRegionStore.fetchInterestRegions();
    console.log("관심지역 목록", interestedRegionStore.regions);
    console.log("selectedRegions", selectedRegions.value);
    if(interestedRegionStore.regions.length > 0) {
      activeInfo.value.boardId = interestedRegionStore.regions[0].boardId;
      activeInfo.value.code = interestedRegionStore.regions[0].code;
      activeInfo.value.name = interestedRegionStore.regions[0].name;
    }
    selectedRegions.value = interestedRegionStore.regions;
    await getArticles();
  } catch (error) {
    console.error("관심지역 목록 조회 실패:", error);
  }
});

watch(interestedRegionStore.regions, (newRegions) => {
  selectedRegions.value = newRegions;
  
  // 현재 activeInfo가 삭제된 지역을 가리키고 있는지 확인
  const currentRegionExists = newRegions.some(region => region.code === activeInfo.value.code);
  
  if (!currentRegionExists) {
    // 현재 지역이 삭제되었다면
    if (newRegions.length > 0) {
      // 다른 지역이 있다면 첫 번째 지역으로 전환
      activeInfo.value.boardId = newRegions[0].boardId;
      activeInfo.value.code = newRegions[0].code;
      activeInfo.value.name = newRegions[0].name;
    } else {
      // 모든 지역이 삭제되었다면 activeInfo 초기화
      activeInfo.value.boardId = '';
      activeInfo.value.code = '';
      activeInfo.value.name = '';
    }

    if(newRegions.length === 1) {
      activeInfo.value.boardId = newRegions[0].boardId;
      activeInfo.value.code = newRegions[0].code;
      activeInfo.value.name = newRegions[0].name;
    }
  }
}, { deep: true });

// activeInfo가 변경될 때마다 게시글 목록 갱신
watch(activeInfo, async () => {
  await getArticles();
}, { deep: true });

// 페이지네이션 관련
const articles = ref([]);
const totalElements = ref(0);
const totalPages = ref(0);
const currentPage = ref(1);
const itemsPerPage = 8;

const getArticles = async () => {
  try {
    console.log("activeInfo", activeInfo.value);
    const response = await getArticlesApi({
      boardId: activeInfo.value.boardId,
      page: currentPage.value,
      size: itemsPerPage
    });
    articles.value = response.articles;
    totalElements.value = response.totalElements;
    totalPages.value = response.totalPages;
    console.log("totalElements", totalElements.value);
    console.log("totalPages", totalPages.value);
    console.log("selectedRegions", selectedRegions.value);
  } catch (error) {
    console.error('게시글 목록 조회 실패:', error);
  }
};

// 관심지역이 변경될 때 activeRegionCode 업데이트
watch(selectedRegions, (newRegions) => {
  if (newRegions.length > 0) {
    // 현재 활성화된 지역이 삭제되었는지 확인
    const regionExists = newRegions.some(region => region.boardId === activeInfo.value.boardId);
    if (!regionExists) {
      // 활성화된 지역이 없으면 첫 번째 지역으로 설정
      activeInfo.value.boardId = newRegions[0].boardId;
      activeInfo.value.code = newRegions[0].code;
      activeInfo.value.name = newRegions[0].name;
    }
  }
}, { deep: true });

// 메서드
const setActiveRegion = async (newActiveInfo) => {
  activeInfo.value.code = newActiveInfo.code;
  activeInfo.value.name = newActiveInfo.name;
  activeInfo.value.boardId = newActiveInfo.boardId;
  currentPage.value = 1; // 지역 변경 시 첫 페이지로 이동
  await getArticles();
};

const goToBoardDetail = (articleId) => {
  console.log(`게시글 상세 페이지로 이동: ${articleId}`);
  router.push(`/board/article/${articleId}`); 
};

const goToWritePage = () => {
  console.log('게시글 작성 페이지로 이동');
  router.push(`/board/${activeInfo.value.boardId}/article/post`);
};

const goToPage = async (page) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page;
    await getArticles();
    // 페이지 상단으로 스크롤
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
};

const openRegionModal = () => {
  isRegionModalOpen.value = true;
};

const closeRegionModal = () => {
  isRegionModalOpen.value = false;
};

const addRegion = async (sggCode) => {
  console.log("sggCode", sggCode);
  if (!selectedRegions.value.some(r => r.code === sggCode)) {
    console.log("selectedRegions", selectedRegions.value);

    await addInterestedRegionApi(sggCode);
    await interestedRegionStore.fetchInterestRegions();
    selectedRegions.value = interestedRegionStore.regions;
    if (selectedRegions.value.length === 1) {
      activeInfo.value.boardId = selectedRegions.value[0].boardId;
      activeInfo.value.code = selectedRegions.value[0].code;
      activeInfo.value.name = selectedRegions.value[0].name;
    }
  }
};

const removeRegion = async (sggCode) => {
  // 활성 지역이 삭제된 경우 다른 지역으로 변경
  if (activeInfo.value.code === sggCode && selectedRegions.value.length > 0) {
    nextTick(() => {
      activeInfo.value.boardId = selectedRegions.value[0].boardId;
      activeInfo.value.code = selectedRegions.value[0].code;
      activeInfo.value.name = selectedRegions.value[0].name;
    });
  }
  await deleteInterestedRegionApi(sggCode);
  await interestedRegionStore.fetchInterestRegions();
  selectedRegions.value = interestedRegionStore.regions;
};
</script>

<style scoped>
.board-list-page {
  min-height: 100vh;
  background-color: var(--white);
  padding: 1rem;
  font-family: 'Noto Sans KR', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: var(--dark);
}

.container {
  max-width: 1140px;
  margin: 0 auto;
  padding-bottom: 80px; /* 하단 글쓰기 버튼 공간 확보 */
}

.board-list {
  display: flex;
  flex-direction: column;
  background-color: var(--white);
  margin-bottom: 1rem;
}

.pagination-container {
  margin-top: 2rem;
  margin-bottom: 2rem;
  display: flex;
  justify-content: center;
}
</style>