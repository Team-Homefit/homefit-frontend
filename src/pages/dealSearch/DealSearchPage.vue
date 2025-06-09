<template>
  <div class="search-page">
    <div class="container">
      
      <!-- 검색 폼 -->
      <div class="search-form-container">
        <div class="search-form">
          <div class="search-filters">
            <div class="filter-group">
              <label>시/도</label>
              <CustomDropdown
                v-model="searchParams.sido"
                :options="sidoOptions"
                placeholder="시/도 선택"
                id="city-dropdown"
                @update:modelValue="handleSidoChange"
              />
            </div>
            
            <div class="filter-group">
              <label>시/군/구</label>
              <CustomDropdown
                v-model="searchParams.sgg"
                :options="sggOptions"
                placeholder="시/군/구 선택"
                id="district-dropdown"
                :disabled="!searchParams.sido"
                @update:modelValue="handleSggChange"
                :emptyMessage="!searchParams.sido ? '시/도를 먼저 선택하세요' : '선택 가능한 항목이 없습니다'"
              />
            </div>
            
            <div class="filter-group">
              <label>읍/면/동</label>
              <CustomDropdown
                v-model="searchParams.umd"
                :options="umdOptions"
                placeholder="읍/면/동 선택"
                id="neighborhood-dropdown"
                :disabled="!searchParams.sgg"
                :emptyMessage="!searchParams.sgg ? '시/군/구를 먼저 선택하세요' : '선택 가능한 항목이 없습니다'"
              />
            </div>
          </div>
          
          <div class="search-actions">
            <button class="reset-button" @click="resetFilters">
              <i class="bi bi-arrow-counterclockwise"></i> 초기화
            </button>
            <button class="search-button" @click="searchDeals">
              <i class="bi bi-search"></i> 검색
            </button>
          </div>
        </div>
      </div>
      
      <MapLoader 
        @request-api="requestApi"
      />
      
      <SearchResult
        @request-api="requestApi"
      />
      
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onBeforeMount, watch, onMounted } from 'vue';
import { storeToRefs } from 'pinia';
import { useRegionStore } from '@/features/region/regionStore';
import { useDealSearchStore } from '@/features/house/dealSearchStore';
import CustomDropdown from '@/widgets/dropdown/CustomDropdown.vue';
import MapLoader from './components/MapLoader.vue';
import SearchResult from './components/SearchResult.vue';

// 거래 검색 조건 & 결과 상태 관리
const dealSearchStore = useDealSearchStore();
const { page, condition } = storeToRefs(dealSearchStore);
const regionStore = useRegionStore();

const searchParams = ref({
  sido: condition.value.sidoCode,
  sgg: condition.value.sggCode,
  umd: condition.value.umdCode
});

const sidoOptions = computed(() => {
  if (!regionStore.regions) return [];
  
  return regionStore.getSidos().map(sido => ({ value: sido.code, label: sido.name }));
});

const sggOptions = computed(() => {
  if (!searchParams.value.sido) return [];

  const sggList = regionStore.getSggsOf(searchParams.value.sido) || [];
  return sggList.map(sgg => ({ value: sgg.code, label: sgg.name }));
});

const umdOptions = computed(() => {
  if (!searchParams.value.sgg) return [];

  const umdList = regionStore.getUmdsOf(searchParams.value.sgg) || [];
  return umdList.map(umd => ({ value: umd.code, label: umd.name }));
});

// 핸들러
const handleSidoChange = () => {
  searchParams.value.sgg = '';
  searchParams.value.umd = '';
  condition.value.sggCode = null;
  condition.value.umdCode = null;
};

const handleSggChange = () => {
  searchParams.value.umd = '';
  condition.value.umdCode = null;
};

const resetFilters = () => {
  searchParams.value.sido = '';
  searchParams.value.sgg = '';
  searchParams.value.umd = '';
  dealSearchStore.clear();
};

watch(searchParams.value.sido, condition.value.sidoCode = searchParams.value.sido);
watch(searchParams.value.sgg, condition.value.sggCode = searchParams.value.sgg);
watch(searchParams.value.umd, condition.value.umdCode = searchParams.value.umd);


// 검색 요청
const searchDeals = async () => {
  if (!searchParams.value.sido) {
    alert('시/도를 선택해주세요.');
    return;
  }

  page.value = 1;
  condition.value.sggCode = searchParams.value.sgg;
  condition.value.umdCode = searchParams.value.umd;
  condition.value.swLatitude = null;
  condition.value.swLongitude = null;
  condition.value.neLatitude = null;
  condition.value.neLongitude = null;
  
  await requestApi();
};


const requestApi = async () => {
  await dealSearchStore.tryGetDeals();
}

onMounted(async () => {
  if (condition.value.sggCode) {
    await requestApi();
  }
})

onBeforeMount(async () => {
  await regionStore.getRegions();

  searchParams.value.sido = condition.value.sidoCode,
  searchParams.value.sgg = condition.value.sggCode,
  searchParams.value.umd = condition.value.umdCode
})
</script>

<style scoped>
@import url("https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.1/font/bootstrap-icons.css");

/* 페이지 레이아웃 */
.search-page {
  padding: 2rem 0;
  background-color: var(--white);
  min-height: 100vh;
}

.container {
  max-width: 1140px;
  margin: 0 auto;
  padding: 0 16px;
}

/* 검색 폼 */
.search-form-container {
  background-color: var(--white);
  border-radius: 0.75rem;
  box-shadow: var(--shadow);
  margin-bottom: 2rem;
  padding: 1.5rem;
}

.search-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.search-filters {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
}

.filter-group {
  flex: 1;
  min-width: 200px;
}

.filter-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: var(--dark);
  font-size: 0.875rem;
}

.filter-row {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
}

/* 검색 버튼 */
.search-actions {
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-top: 0.5rem;
}

.search-button, .reset-button {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  font-weight: 500;
  border: none;
  border-radius: 0.75rem;
  cursor: pointer;
  transition: all 0.2s;
}

.search-button {
  background-color: var(--primary);
  color: var(--white);
  min-width: 120px;
}

.search-button:hover {
  background-color: var(--primary);
}

.reset-button {
  background-color: var(--white);
  color: var(--gray);
}

.reset-button:hover {
  background-color: var(--white);
}

/* 반응형 스타일 */
@media (max-width: 768px) {
  .search-filters, .filter-row {
    flex-direction: column;
  }
  
  .filter-group {
    width: 100%;
  }
}
</style>