import { ref } from 'vue';
import { defineStore } from 'pinia';
import { getHouseDealsApi } from '@/entities';

export const useDealSearchStore = defineStore(
    'dealConditions',
    () => {
        const deals = ref([]);
        const page = ref(1);
        const size = ref(8);
        const totalPages = ref(0);
        const totalElements = ref(0);
        const condition = ref({})

        const clear = () => {
            deals.value = [];
            page.value = 1;
            totalPages.value = 0;
            totalElements.value = 0;
            condition.value = {}
        }

        const tryGetDeals = async () => {
            const request =
                (condition.value.swLatitude || condition.value.swLongitude)
                ? {
                    page: page.value,
                    size: size.value,
                    swLatitude: condition.value.swLatitude,
                    swLongitude: condition.value.swLongitude,
                    neLatitude: condition.value.neLatitude,
                    neLongitude: condition.value.neLongitude,
                }
                : {
                    page: page.value,
                    size: size.value,
                    sggCode: condition.value.sggCode,
                    umdCode: condition.value.umdCode ? condition.value.umdCode.slice(-5) : null
                }

            try {
                const result = await getHouseDealsApi(request);

                deals.value = result.deals || [];
                totalPages.value = result.totalPages;
                totalElements.value = result.totalElements;

            } catch (error) {
                console.error('검색 중 오류 발생:', error);
                return false;
            }
        }

        return { deals, page, size, totalPages, totalElements, condition, clear, tryGetDeals };
    },
    { persist: true }
);