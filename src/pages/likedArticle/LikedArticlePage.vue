<template>
  <div class="liked-article-page">
    <div class="container">      
      <!-- 지역 탭 -->
      <!-- <RegionTabs
        :regions="regions"
        :active-region-code="activeRegionCode"
        @select-region="setActiveRegion"
        show-all-tab
      /> -->
      
      <!-- 게시글 목록 -->
      <div v-if="filteredArticles.length > 0" class="article-list-container">
        <ArticleList 
          :articles="filteredArticles" 
          @view-article="goToArticleDetail"
          @unlike-article="unlikeArticle"
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
import { ref, computed, onBeforeMount } from 'vue';
import ArticleList from './components/ArticleList.vue';
import EmptyState from './components/EmptyState.vue';
import PaginationBar from '../../widgets/paginationBar/PaginationBar.vue';
import { getArticlesApi } from '@/entities/board/getArticlesApi';
import { useRouter } from 'vue-router';

const router = useRouter();

onBeforeMount(async () => {
  console.log('onBeforeMount');
  await getArticles();
});

const getArticles = async () => {
  const response = await getArticlesApi({
    isLiked: true,
    page: currentPage.value,
    size: itemsPerPage
  });
  likedArticles.value = response.articles;
  totalPages.value = response.totalPages;
};

// 현재 선택된 지역 코드 (기본값: 전체)
const activeRegionCode = ref('all');

// 좋아요한 게시글 데이터
const likedArticles = ref([]);

// 페이지네이션 관련 상태
const currentPage = ref(1);
const itemsPerPage = 5;
const totalPages = ref(0);

// 선택된 지역에 따라 필터링된 게시글 목록
const filteredArticles = computed(() => {
  console.log('filteredArticles', likedArticles.value);
  if (activeRegionCode.value === 'all') {
    return likedArticles.value;
  }
  return likedArticles.value.filter(article => article.region === activeRegionCode.value);
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
const goToPage = async (page) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page;
    await getArticles();
    // 페이지 상단으로 스크롤
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
};

// 게시글 상세 페이지로 이동
const goToArticleDetail = (articleId) => {
  router.push(`/board/article/${articleId}`);
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
  router.push({ name: 'boardList' });
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