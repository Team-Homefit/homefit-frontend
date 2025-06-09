// stores/interestRegionStore.js
import { defineStore } from "pinia";
import { ref } from "vue";
import { getInterestedRegionsApi } from '@/entities/interestedRegion/getInterestedRegionsApi';
import { addInterestedRegionApi } from '@/entities/interestedRegion/addInterestedRegionApi';
import { deleteInterestedRegionApi } from '@/entities/interestedRegion/deleteInterestedRegionApi';

export const useInterestedRegionStore = defineStore(
  "interestedRegion",
  () => {
    const regions = ref([]);
    const isLoading = ref(false);
    const error = ref(null);

    // 관심지역 목록 가져오기
    const fetchInterestRegions = async () => {
      isLoading.value = true;
      try {
        const response = await getInterestedRegionsApi();
        // 계층 구조를 평탄화하여 저장
        regions.value = response.sidos.flatMap(sido => 
          sido.sggs.map(sgg => ({
            code: sgg.code,
            name: `${sido.name} ${sgg.name}`,
            boardId: sgg.boardId
          }))
        );
        error.value = null;
      } catch (err) {
        error.value = err.message;
        throw err;
      } finally {
        isLoading.value = false;
      }
    };

    // 관심지역 추가
    const addRegion = async (sggCodes) => {
      try {
        const response = await addInterestedRegionApi(sggCodes);
        // store 상태 업데이트
        regions.value = regions.value.map(region => 
          sggCodes.includes(region.code)
            ? { ...region, boardId: response.boardId }
            : region
        );
        error.value = null;
      } catch (err) {
        error.value = err.message;
        throw err;
      }
    };

    // 관심지역 삭제
    const removeRegion = async (sggCodes) => {
      try {
        await deleteInterestedRegionApi(sggCodes);
        // store 상태 업데이트
        regions.value = regions.value.map(region => 
          sggCodes.includes(region.code)
            ? { ...region, boardId: null }
            : region
        );
        error.value = null;
      } catch (err) {
        error.value = err.message;
        throw err;
      }
    };

    // 관심지역으로 등록된 구 목록 가져오기
    const getRegisteredRegions = () => {
      return regions.value.filter(region => region.boardId !== null);
    };

    const clear = () => {
      regions.value = [];
    }

    return {
      regions,
      isLoading,
      error,
      fetchInterestRegions,
      addRegion,
      removeRegion,
      getRegisteredRegions,
      clear
    };
  },
  {
    persist: true, // 로컬 스토리지에 저장
  }
);
