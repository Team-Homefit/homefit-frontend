<template>
  <div class="region-notice-box">
    <div class="notice-icon">
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    </div>
    <div class="notice-content">
      <p class="notice-text">댓글을 확인하려면 관심지역으로 설정해 주세요.</p>
      <button @click="showModal = true" class="add-region-button">
        관심지역 설정하기
      </button>
    </div>

    <!-- 관심지역 선택 모달 -->
    <RegionSelectModal
      v-if="showModal"
      :selected-regions="selectedRegions"
      @close="showModal = false"
      @add-region="addRegion"
      @remove-region="removeRegion"
    />
  </div>
</template>

<script setup>
import { ref, onBeforeMount } from 'vue';
import RegionSelectModal from '@/pages/board/components/RegionSelectModal.vue';
import { useInterestedRegionStore } from "@/features/interestedRegion/interestedRegionStore";
import { addInterestedRegionApi } from '@/entities/interestedRegion/addInterestedRegionApi';
import { deleteInterestedRegionApi } from '@/entities/interestedRegion/deleteInterestedRegionApi';

const interestedRegionStore = useInterestedRegionStore();
const showModal = ref(false);
const selectedRegions = ref([]);

onBeforeMount(async () => {
  await interestedRegionStore.fetchInterestRegions();
  selectedRegions.value = interestedRegionStore.regions;
});

// 지역 추가 핸들러
const addRegion = async (sggCode) => {
  if (!selectedRegions.value.some(r => r.code === sggCode)) {
    await addInterestedRegionApi(sggCode);
    await interestedRegionStore.fetchInterestRegions();
    selectedRegions.value = interestedRegionStore.regions;
  }
};

// 지역 제거 핸들러
const removeRegion = async (sggCode) => {
  selectedRegions.value = selectedRegions.value.filter(
    region => region.code !== sggCode
  );
  await deleteInterestedRegionApi(sggCode);
  await interestedRegionStore.fetchInterestRegions();
  selectedRegions.value = interestedRegionStore.regions;
};
</script>

<style scoped>
.region-notice-box {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  background-color: var(--primary-background);
  border-radius: var(--border-radius);
  padding: 1rem;
  margin-bottom: 1.5rem;
}

.notice-icon {
  color: var(--primary);
  flex-shrink: 0;
}

.notice-content {
  flex-grow: 1;
}

.notice-text {
  margin: 0 0 0.75rem 0;
  font-size: 0.875rem;
  color: var(--dark);
  line-height: 1.5;
}

.add-region-button {
  background-color: var(--primary);
  color: var(--white);
  border: none;
  border-radius: var(--border-radius);
  padding: 0.5rem 0.75rem;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.add-region-button:hover {
  background-color: var(--primary-dark);
}
</style>