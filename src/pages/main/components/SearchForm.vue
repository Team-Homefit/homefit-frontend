<template>
  <form @submit.prevent="handleSearch" class="search-form">
    <div class="form-row">
      <!-- 시도 선택 드롭다운 -->
      <div class="form-group">
        <label for="region">시/도</label>
        <search-drop-down
          id="region"
          v-model="searchParams.sido"
          :options="sidoOptions"
          placeholder="시/도 선택"
          :disabled="false"
        />
      </div>
      
      <!-- 시군구 선택 드롭다운 -->
      <div class="form-group">
        <label for="district">시/군/구</label>
        <search-drop-down
          id="district"
          v-model="searchParams.sgg"
          :options="sggOptions"
          placeholder="시/군/구 선택"
          :disabled="!searchParams.sido"
          empty-message="선택 가능한 시/군/구가 없습니다"
        />
      </div>
      
      <!-- 읍면동 선택 드롭다운 -->
      <div class="form-group">
        <label for="neighborhood">읍/면/동</label>
        <search-drop-down
          id="neighborhood"
          v-model="searchParams.umd"
          :options="umdOptions"
          placeholder="읍/면/동 선택"
          :disabled="!searchParams.sgg"
          empty-message="선택 가능한 읍/면/동이 없습니다"
        />
      </div>
    </div>
    
    <div class="form-actions">
      <button type="submit" class="btn-search">
        <i class="bi bi-search"></i>
        검색하기
      </button>
      <button type="button" class="btn-reset" @click="resetForm">
        <i class="bi bi-arrow-counterclockwise"></i>
        초기화
      </button>
    </div>
  </form>
</template>

<script setup>
import { ref, computed, onBeforeMount } from 'vue';
import { storeToRefs } from 'pinia';
import { useRegionStore } from '@/features/region/regionStore';
import { useDealSearchStore } from '@/features/house/dealSearchStore';
import SearchDropDown from '@/widgets/dropdown/CustomDropdown.vue';

const regionStore = useRegionStore();
const dealSearchStore = useDealSearchStore();
const { condition } = storeToRefs(dealSearchStore);

// 검색 파라미터
const searchParams = ref({
  sido: '',
  sgg: '',
  umd: ''
});

// emit 정의
const emit = defineEmits(['search']);

// 검색 처리
const handleSearch = () => {
  emit('search', { ...searchParams.value });
};


// region 데이터로 드롭다운 생성
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

// 폼 초기화
const resetForm = () => {
  searchParams.value = {
    sido: '',
    sgg: '',
    umd: ''
  };
  dealSearchStore.clear();
};

onBeforeMount(async () => {
  await regionStore.getRegions();

  searchParams.value.sido = condition.value.sidoCode;
  searchParams.value.sgg = condition.value.sggCode;
  searchParams.value.umd = condition.value.umdCode;
});
</script>

<style scoped>
@import url("https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.1/font/bootstrap-icons.css");

/* 폼 스타일 */
.search-form {
  width: 100%;
}

.form-row {
  display: flex;
  flex-wrap: wrap;
  margin: -0.5rem;
  margin-bottom: 1rem;
}

.form-group {
  flex: 1;
  min-width: 200px;
  padding: 0.5rem;
}

@media (max-width: 768px) {
  .form-group {
    flex: 0 0 100%;
  }
}

label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: var(--dark);
  font-size: 0.875rem;
}

/* 버튼 스타일 */
.form-actions {
  display: flex;
  gap: 1rem;
  margin-top: 1.5rem;
}

.btn-search {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.75rem 1.5rem;
  background-color: var(--primary);
  color: var(--white);
  border: none;
  border-radius: 0.75rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
}

.btn-search:hover {
  background-color: #1A7A94;
}

.btn-search i {
  margin-right: 0.5rem;
}

.btn-reset {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.75rem 1.5rem;
  background-color: transparent;
  color: #6c757d;
  border: 1px solid #e9ecef;
  border-radius: 0.75rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-reset:hover {
  background-color: #f8f9fa;
  border-color: #dee2e6;
}

.btn-reset i {
  margin-right: 0.5rem;
}

@media (max-width: 576px) {
  .form-actions {
    flex-direction: column;
  }
  
  .btn-search, .btn-reset {
    width: 100%;
  }
}
</style>