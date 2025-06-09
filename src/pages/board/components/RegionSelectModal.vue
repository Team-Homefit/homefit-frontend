<template>
  <div class="modal-overlay" @click.self="$emit('close')">
    <div class="modal-container">
      <div class="modal-header">
        <h2 class="modal-title">관심지역 선택</h2>
        <button @click="$emit('close')" class="close-button">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      
      <div class="modal-body">
        <!-- 선택된 지역 표시 -->
        <div class="selected-regions">
          <div 
            v-for="region in selectedRegions" 
            :key="region.code" 
            class="region-tag"
          >
            <span>{{ region.name }}</span>
            <button 
              @click="handleRemoveRegion(region.code)" 
              class="remove-button"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <div v-if="selectedRegions.length === 0" class="no-regions-selected">
            관심지역을 선택해주세요 (최대 5개)
          </div>
        </div>
        
        <!-- 지역 선택 단계 -->
        <div v-if="!selectedSido" class="region-selection">
          <h3 class="section-title">시/도 선택</h3>
          <div class="region-grid">
            <button 
              v-for="sido in sidos" 
              :key="sido.code"
              @click="selectSido(sido)"
              class="region-button"
            >
              {{ sido.name }}
            </button>
          </div>
        </div>
        
        <div v-else class="region-selection">
          <div class="section-header">
            <h3 class="section-title">{{ selectedSido.name }} 시/군/구 선택</h3>
            <button @click="selectedSido = null" class="back-button">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
              </svg>
              뒤로
            </button>
          </div>
          
          <div class="region-grid">
            <button 
              v-for="sgg in filteredSggs" 
              :key="sgg.code"
              @click="toggleSgg(sgg.code)"
              class="region-button"
              :class="{ 'selected': isRegionSelected(sgg.code) }"
            >
              {{ sgg.name }}
            </button>
          </div>
        </div>
      </div>
      
      <div class="modal-footer">
        <div class="button-group">
          <button 
            @click="$emit('close')" 
            class="cancel-button"
          >
            취소
          </button>
          <button 
            @click="$emit('close')" 
            class="complete-button"
          >
            완료
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onBeforeMount } from 'vue';
import { useRegionStore } from '@/features/region/regionStore';

const props = defineProps({
  selectedRegions: {
    type: Array,
    required: true
  }
});

const emit = defineEmits(['close', 'add-region', 'remove-region']);

const searchTerm = ref('');
const selectedSido = ref(null);
const regionStore = useRegionStore();
const sidos = ref([]);
const sggs = ref([]);

onBeforeMount(() => {
  sidos.value = regionStore.getSidos();
});

// 시/도 선택
const selectSido = async (sido) => {
  selectedSido.value = sido;
  searchTerm.value = '';
  // 시도 선택 시 해당 시도의 시군구 데이터 로드
  sggs.value = await regionStore.getSggsOf(sido.code);
};

// 검색어에 따라 필터링된 구/군 목록
const filteredSggs = computed(() => {
  if (!selectedSido.value) return [];
  
  if (!searchTerm.value) return sggs.value;
  
  return sggs.value.filter(sgg => 
    sgg.name.includes(searchTerm.value)
  );
});

// 지역이 이미 선택되었는지 확인
const isRegionSelected = (regionCode) => {
  return props.selectedRegions.some(region => region.code === regionCode);
};

// 구/군 선택 토글
const toggleSgg = (sggCode) => {
// 이미 선택된 지역이면 제거
  if (isRegionSelected(sggCode)) {
    handleRemoveRegion(sggCode);
    return;
  }
  
  // 최대 5개까지만 선택 가능
  if (props.selectedRegions.length >= 5) {
    alert('관심지역을 최대 5개까지 설정할 수 있습니다.');
    return;
  }
  
  // 부모 컴포넌트에 이벤트 발생
  emit('add-region', sggCode);
};

// 지역 제거 핸들러
const handleRemoveRegion = (sggCode) => {
  console.log('모달에서 지역 제거:', sggCode);
  emit('remove-region', sggCode);
};
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999; /* 높은 z-index 값으로 설정 */
  padding: 1rem;
}

.modal-container {
  background-color: var(--white);
  border-radius: var(--border-radius);
  width: 100%;
  max-width: 500px;
  max-height: 90vh;
  overflow: hidden;
  box-shadow: var(--shadow);
  display: flex;
  flex-direction: column;
  position: relative; /* 상대 위치 설정 */
  margin: 2rem; /* 모달 주변에 여백 추가 */
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  border-bottom: 1px solid var(--light-gray);
  background-color: var(--white); /* 헤더 배경색 설정 */
  position: sticky; /* 스티키 포지션 설정 */
  top: 0; /* 상단에 고정 */
  z-index: 1; /* 모달 내부에서 최상위 레이어 */
}

.modal-title {
  font-size: 1.25rem;
  font-weight: 600;
  margin: 0;
  color: var(--dark);
}

.close-button {
  background: none;
  border: none;
  padding: 0;
  color: var(--gray);
  cursor: pointer;
}

.modal-body {
  padding: 1rem;
  overflow-y: auto;
  flex-grow: 1;
}

.selected-regions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1rem;
  min-height: 40px;
}

.region-tag {
  display: flex;
  align-items: center;
  background-color: var(--primary-background);
  color: var(--primary);
  font-size: 0.875rem;
  font-weight: 500;
  padding: 0.375rem 0.75rem;
  border-radius: 50rem;
}

.remove-button {
  background: none;
  border: none;
  padding: 0;
  margin-left: 0.5rem;
  width: 18px;
  height: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--primary);
  cursor: pointer;
}

.no-regions-selected {
  color: var(--gray);
  font-size: 0.875rem;
  display: flex;
  align-items: center;
  height: 40px;
}

.region-selection {
  margin-bottom: 1rem;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.75rem;
}

.section-title {
  font-size: 1rem;
  font-weight: 500;
  margin: 0;
  color: var(--dark);
}

.back-button {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  background: none;
  border: none;
  padding: 0;
  color: var(--primary);
  font-size: 0.875rem;
  cursor: pointer;
}

.region-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.5rem;
}

.region-button {
  text-align: center;
  padding: 0.75rem;
  background-color: var(--light);
  border: 1px solid var(--light-gray);
  border-radius: var(--border-radius);
  font-size: 0.875rem;
  color: var(--dark);
  cursor: pointer;
  transition: all 0.3s ease;
}

.region-button:hover {
  background-color: var(--primary-light-background);
  border-color: var(--primary-light);
}

.region-button.selected {
  background-color: var(--primary-background);
  border-color: var(--primary);
  color: var(--primary);
  font-weight: 500;
}

.modal-footer {
  padding: 1rem;
  border-top: 1px solid var(--light-gray);
  background-color: var(--white); /* 푸터 배경색 설정 */
  position: sticky; /* 스티키 포지션 설정 */
  bottom: 0; /* 하단에 고정 */
  z-index: 1; /* 모달 내부에서 최상위 레이어 */
}

.button-group {
  display: flex;
  gap: 0.5rem;
}

.cancel-button, .complete-button {
  padding: 0.75rem;
  border-radius: var(--border-radius);
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  flex: 1;
}

.cancel-button {
  background-color: var(--white);
  color: var(--gray);
  border: 1px solid var(--light-gray);
}

.cancel-button:hover {
  background-color: var(--light);
}

.complete-button {
  background-color: var(--primary);
  color: var(--white);
  border: none;
}

.complete-button:hover {
  background-color: var(--primary-dark);
}

/* 모바일 화면에서 모달 크기 조정 */
@media (max-width: 576px) {
  .modal-container {
    max-height: 80vh;
    margin: 1rem;
  }
  
  .region-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>