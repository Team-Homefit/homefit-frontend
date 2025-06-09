<template>
  <div class="search-results">
    <div class="results-header">
      <h2 class="results-title">
        검색 결과 <span class="results-count">{{ totalElements }}건</span>
      </h2>
    </div>
    
    <div class="results-container" v-if="deals.length > 0">
      <DealItem 
        v-for="(deal, index) in deals" 
        :key="index" 
        :deal="deal"
      />
    </div>
    
    <div class="no-results" v-else>
      <i class="bi bi-search"></i>
      <p>검색 결과가 없습니다.</p>
      <p class="no-results-sub">다른 검색 조건을 시도해보세요.</p>
    </div>
    
    <!-- 페이지네이션 -->
     <PaginationBar
        :currentPage="page"
        :totalPages="totalPages"
        :maxVisiblePages="10"
        @page-change="changePage"
     />
  </div>
</template>

<script setup>
import { storeToRefs } from 'pinia';
import { useDealSearchStore } from '@/features/house/dealSearchStore';
import DealItem from './DealItem.vue';
import PaginationBar from '@/widgets/paginationBar/PaginationBar.vue';

const dealSearchStore = useDealSearchStore();
const { deals, page, totalPages, totalElements } = storeToRefs(dealSearchStore);

const emit = defineEmits(['request-api']);

const changePage = (nextPage) => {
  page.value = nextPage;
  window.scrollTo({ top: 0, behavior: 'smooth' });

  emit('request-api');
};

</script>

<style scoped>

/* 검색 결과 */
.search-results {
  background-color: #ffffff;
  border-radius: 0.75rem;
  box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.075);
  padding: 1.5rem;
  margin-top: 2rem;
}

.results-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.results-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: #212529;
  margin: 0;
  display: flex;
  align-items: center;
}

.results-count {
  font-size: 1rem;
  color: #219EBC;
  margin-left: 0.5rem;
}

.results-sort {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.results-sort label {
  font-size: 0.9rem;
  color: #6c757d;
}

.results-sort select {
  padding: 0.5rem;
  border: 1px solid #dee2e6;
  border-radius: 0.5rem;
  background-color: #ffffff;
  font-size: 0.9rem;
  color: #212529;
  cursor: pointer;
}

.results-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

/* 검색 결과 없음 */
.no-results {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem 0;
  color: #6c757d;
}

.no-results i {
  font-size: 3rem;
  margin-bottom: 1rem;
  color: #E8EAED;
}

.no-results p {
  font-size: 1.1rem;
  margin: 0;
}

.no-results-sub {
  font-size: 0.9rem !important;
  margin-top: 0.5rem !important;
}

/* 페이지네이션 */
.pagination {
  display: flex;
  justify-content: center;
  gap: 0.5rem;
  margin-top: 2rem;
}

.page-button {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #dee2e6;
  background-color: #ffffff;
  border-radius: 0.5rem;
  font-size: 0.9rem;
  color: #6c757d;
  cursor: pointer;
  transition: all 0.2s;
}

.page-button:hover:not(:disabled) {
  background-color: #f8f9fa;
  border-color: #ced4da;
}

.page-button.active {
  background-color: #219EBC;
  border-color: #219EBC;
  color: white;
}

.page-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

@media (max-width: 768px) {
  .results-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
  
  .results-sort {
    width: 100%;
  }
  
  .results-sort select {
    flex: 1;
  }
  
  .results-container {
    grid-template-columns: 1fr;
  }
}
</style>