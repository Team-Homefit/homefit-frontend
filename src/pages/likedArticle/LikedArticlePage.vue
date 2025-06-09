<template>
  <div class="liked-article-page">
    <div class="container">      
      <!-- 지역 탭 -->
      <RegionTabs
        :regions="regions"
        :active-region-code="activeRegionCode"
        @select-region="setActiveRegion"
        show-all-tab
      />
      
      <!-- 게시글 목록 -->
      <div v-if="filteredArticles.length > 0" class="article-list-container">
        <ArticleList 
          :articles="filteredArticles" 
          @view-article="goToArticleDetail"
          @unlike-article="unlikeArticle"
        />
        
        <!-- 페이지네이션 -->
        <div class="pagination-container" v-if="filteredArticles.length > itemsPerPage">
          <PaginationBar
            :current-page="currentPage"
            :total-pages="totalPages"
            :max-visible-pages="5"
            @page-change="goToPage"
          />
        </div>
      </div>
      
      <!-- 좋아요한 게시글이 없는 경우 -->
      <EmptyState 
        v-else 
        :message="emptyStateMessage"
        :sub-message="emptyStateSubMessage"
        :show-button="activeRegionCode === 'all'"
        button-text="게시판 둘러보기"
        @button-click="goToBoardList"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import RegionTabs from './components/RegionTabs.vue';
import ArticleList from './components/ArticleList.vue';
import EmptyState from './components/EmptyState.vue';
import PaginationBar from '../../widgets/paginationBar/PaginationBar.vue';

// 사용자 관심 지역 (실제로는 API에서 가져옴)
const regions = ref([
  { code: 'seoul-gangnam', name: '서울시 강남구' },
  { code: 'seoul-seocho', name: '서울시 서초구' },
  { code: 'seoul-mapo', name: '서울시 마포구' }
]);

// 현재 선택된 지역 코드 (기본값: 전체)
const activeRegionCode = ref('all');

// 좋아요한 게시글 데이터 (실제로는 API에서 가져옴)
const likedArticles = ref([
  {
    id: 1,
    title: '강남구 맛집 추천 부탁드립니다',
    content: '강남에 새로 이사왔는데 맛집 추천 부탁드립니다.',
    author: {
      id: 101,
      nickname: '동네주민'
    },
    region: 'seoul-gangnam',
    regionName: '서울시 강남구',
    createdAt: '2025-05-15T09:30:00Z',
    viewCount: 128,
    likeCount: 12,
    commentCount: 8,
    likedAt: '2025-05-15T10:15:00Z'
  },
  {
    id: 2,
    title: '서초구 신축 아파트 정보 있나요?',
    content: '서초구 신축 아파트 정보 찾고 있습니다.',
    author: {
      id: 102,
      nickname: '집구하는중'
    },
    region: 'seoul-seocho',
    regionName: '서울시 서초구',
    createdAt: '2025-05-14T14:20:00Z',
    viewCount: 95,
    likeCount: 7,
    commentCount: 4,
    likedAt: '2025-05-14T15:30:00Z'
  },
  {
    id: 3,
    title: '강남역 근처 주차장 정보 공유합니다',
    content: '강남역 근처 저렴한 주차장 정보 공유합니다.',
    author: {
      id: 103,
      nickname: '주차달인'
    },
    region: 'seoul-gangnam',
    regionName: '서울시 강남구',
    createdAt: '2025-05-13T11:45:00Z',
    viewCount: 76,
    likeCount: 5,
    commentCount: 3,
    likedAt: '2025-05-13T12:10:00Z'
  },
  {
    id: 4,
    title: '마포구 한강공원 러닝 모임 있나요?',
    content: '마포구 한강공원에서 함께 러닝할 모임을 찾고 있습니다.',
    author: {
      id: 104,
      nickname: '러닝러버'
    },
    region: 'seoul-mapo',
    regionName: '서울시 마포구',
    createdAt: '2025-05-12T08:30:00Z',
    viewCount: 112,
    likeCount: 9,
    commentCount: 6,
    likedAt: '2025-05-12T09:15:00Z'
  },
  {
    id: 5,
    title: '서초구 반려동물 동반 카페 추천',
    content: '강아지와 함께 갈 수 있는 카페 추천 부탁드립니다.',
    author: {
      id: 105,
      nickname: '강아지맘'
    },
    region: 'seoul-seocho',
    regionName: '서울시 서초구',
    createdAt: '2025-05-11T16:20:00Z',
    viewCount: 143,
    likeCount: 15,
    commentCount: 9,
    likedAt: '2025-05-11T17:05:00Z'
  },
  {
    id: 6,
    title: '마포구 홍대 근처 스터디 카페 추천해주세요',
    content: '홍대 근처에서 조용하고 집중하기 좋은 스터디 카페 추천 부탁드립니다.',
    author: {
      id: 106,
      nickname: '대학생'
    },
    region: 'seoul-mapo',
    regionName: '서울시 마포구',
    createdAt: '2025-05-10T13:10:00Z',
    viewCount: 88,
    likeCount: 6,
    commentCount: 5,
    likedAt: '2025-05-10T14:25:00Z'
  }
]);

// 페이지네이션 관련 상태
const currentPage = ref(1);
const itemsPerPage = 5;

// 선택된 지역에 따라 필터링된 게시글 목록
const filteredArticles = computed(() => {
  if (activeRegionCode.value === 'all') {
    return likedArticles.value;
  }
  return likedArticles.value.filter(article => article.region === activeRegionCode.value);
});

// 총 페이지 수 계산
const totalPages = computed(() => {
  const filteredCount = filteredArticles.value.length;
  return Math.ceil(filteredCount / itemsPerPage);
});

// 현재 페이지에 표시할 게시글 목록
const paginatedArticles = computed(() => {
  const startIndex = (currentPage.value - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  return filteredArticles.value.slice(startIndex, endIndex);
});

// 빈 상태 메시지
const emptyStateMessage = computed(() => {
  if (activeRegionCode.value === 'all') {
    return '좋아요한 게시글이 없습니다';
  }
  
  const region = regions.value.find(r => r.code === activeRegionCode.value);
  return `${region ? region.name : '선택한 지역'}에 좋아요한 게시글이 없습니다`;
});

const emptyStateSubMessage = computed(() => {
  if (activeRegionCode.value === 'all') {
    return '관심 있는 게시글에 좋아요를 눌러보세요';
  }
  return '다른 지역을 선택하거나 관심 있는 게시글에 좋아요를 눌러보세요';
});

// 지역 선택 변경
const setActiveRegion = (regionCode) => {
  activeRegionCode.value = regionCode;
  currentPage.value = 1; // 지역 변경 시 첫 페이지로 이동
};

// 페이지 이동
const goToPage = (page) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page;
    // 페이지 상단으로 스크롤
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
};

// 게시글 상세 페이지로 이동
const goToArticleDetail = (articleId) => {
  console.log(`게시글 상세 페이지로 이동: ${articleId}`);
  // 실제로는 라우터 사용
  // router.push(`/article/${articleId}`);
};

// 게시글 좋아요 취소
const unlikeArticle = (articleId) => {
  console.log(`게시글 좋아요 취소: ${articleId}`);
  // 실제로는 API 호출 후 목록 업데이트
  if (confirm('이 게시글의 좋아요를 취소하시겠습니까?')) {
    likedArticles.value = likedArticles.value.filter(article => article.id !== articleId);
  }
};

// 게시판 목록으로 이동
const goToBoardList = () => {
  console.log('게시판 목록으로 이동');
  // 실제로는 라우터 사용
  // router.push('/board');
};
</script>

<style scoped>
.liked-article-page {
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
  padding: 0 16px;
}

.page-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--dark);
  margin: 0;
}

.article-list-container {
  margin-top: 1.5rem;
}

.pagination-container {
  margin-top: 2rem;
  margin-bottom: 2rem;
  display: flex;
  justify-content: center;
}

@media (max-width: 576px) {
  .liked-article-page {
    padding: 0.75rem;
  }
  
  .page-title {
    font-size: 1.25rem;
  }
}
</style>