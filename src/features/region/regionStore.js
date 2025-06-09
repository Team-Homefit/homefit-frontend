import { ref } from 'vue';
import { defineStore } from 'pinia';
import { getRegionApi } from '@/entities';

export const useRegionStore = defineStore(
    'regions',
    () => {
        const regions = ref(null);
        const sidos = [];
        const sggs = {};
        const umds = {};

        const getRegions = async () => {
            // 이미 지역 정보가 있으면 무시
            if (regions.value != null) return;

            const data = await getRegionApi();
            if (!data) return;

            regions.value = {
                ...data
            };

            formatData();
        }

        const formatData = () => {
            regions.value.sidos.forEach(sido => {
                sidos.push({
                    code: sido.code,
                    name: sido.name
                });

                sggs[sido.code] = [];
                sido.sggs.forEach(sgg => {
                    sggs[sido.code].push({
                        code: sgg.code,
                        name: sgg.name
                    });

                    umds[sgg.code] = [];
                    sgg.umds.forEach(umd => {
                        umds[sgg.code].push({
                            code: umd.code,
                            name: umd.name
                        });
                    });
                });
            });
        }

        const getSidos = () => {
            if (sidos.length == 0) {
                formatData();
            }

            return sidos;
        }

        const getSggsOf = (sidoCode) => {
            if (sidos.length == 0) {
                formatData();
            }

            return sggs[sidoCode];
        }

        const getUmdsOf = (sggCode) => {
            if (sidos.length == 0) {
                formatData();
            }

            return umds[sggCode];
        }

        return { regions, getRegions, getSidos, getSggsOf, getUmdsOf };
    },
    { persist: true }
);