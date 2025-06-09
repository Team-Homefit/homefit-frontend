<template>
  <div class="statistics-container">
    <!-- 면적 필터 (가로 스크롤) -->
    <div class="area-filter-container">
      <div class="area-filter">
        <div 
          v-for="area in areaOptions" 
          :key="area.value"
          class="area-item"
          :class="{ active: selectedArea === area.value, disabled: chartLoading }"
          @click="!chartLoading && selectArea(area.value)"
          :disabled="chartLoading"
        >
          {{ area.label }}
        </div>
      </div>
    </div>

    <!-- 기간 필터 -->
    <div class="period-filter">
      <button 
        v-for="period in periods" 
        :key="period.value"
        class="period-button"
        :class="{ active: selectedPeriod === period.value }"
        @click="!chartLoading && selectPeriod(period.value)"
        :disabled="chartLoading"
      >
        {{ period.label }}
      </button>
    </div>

    <!-- 거래 요약 정보 -->
    <div class="deal-summary" v-if="allDeals.length > 0">
      <div class="summary-date" v-if="selectedPeriod !== 'all'">{{ since }} ~ {{ until }}</div>
      <div class="summary-date" v-else>전체 기간</div>
      <div class="summary-details">
        <span class="deal-area">{{ selectedAreaLabel }}의 평균 실거래가</span>
        <span class="deal-price">{{ formatPriceFromNumber(Number.parseInt(allDeals.avgDealAmount)) }}</span>
      </div>
    </div>

    <!-- 차트 -->
    <div class="chart-container" v-if="allDeals.length > 0">
      <div v-if="chartLoading" class="chart-loading">
        <i class="bi bi-arrow-repeat spin"></i>
        <p>차트 로딩 중...</p>
      </div>
      <canvas v-show="!chartLoading" ref="chartCanvas"></canvas>
    </div>

    <!-- 거래 내역 테이블 -->
    <div class="deals-table">
      <div class="table-header">
        <div class="col-date">계약일</div>
        <div class="col-floor">층</div>
        <div class="col-area">전용면적</div>
        <div class="col-price">가격</div>
      </div>
      
      <div v-if="allDeals.length === 0" class="empty-deals">
        <p>거래 내역이 없습니다.</p>
      </div>
      
      <div v-else class="table-body">
        <div 
          v-for="(deal, index) in displayedDeals" 
          :key="index"
          class="table-row"
        >
          <div class="col-date">{{ formatDate(deal.dealYear, deal.dealMonth, deal.dealDay) }}</div>
          <div class="col-floor">{{ deal.floor }}층</div>
          <div class="col-area">{{ getAreaLabel(deal.area) }}</div>
          <div class="col-price">{{ formatPriceFromNumber(deal.dealAmount) }}</div>
        </div>
        
        <!-- 더보기 버튼 -->
        <div v-if="canLoadMore" class="load-more-container">
          <button class="load-more-button" @click="loadMore">
            더보기 ({{ remainingCount }}건)
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, nextTick, watch } from 'vue';
import { Chart, registerables } from 'chart.js';
import { getHouseAreasApi } from '@/entities/house/getHouseAreasApi';
import { getSpecificHouseDealsApi } from '@/entities/house/getSpecificHouseDealsApi';

// Chart.js 컴포넌트 등록
Chart.register(...registerables);

const props = defineProps({
  aptSequence: {
    type: String,
    required: true
  }
});

// 상태 관리
const areas = ref([]);
const allDeals = ref([]);
const selectedArea = ref('average');
const selectedPeriod = ref('1');
const loading = ref(false);
const chartLoading = ref(false);
const error = ref(null);
const displayCount = ref(5);
const chartCanvas = ref(null);
const chartInstance = ref(null);
const chartInitialized = ref(false);
const since = ref(null);
const until = ref(null);

// 기간 옵션
const periods = [
  { label: '전체', value: 'all' },
  { label: '5년', value: '5' },
  { label: '3년', value: '3' },
  { label: '1년', value: '1' }
];

// 면적 옵션 (단지평균 포함)
const areaOptions = computed(() => {
  const options = [{ value: 'average', label: '단지평균' }];
  areas.value.forEach(area => {
    options.push({
      value: area.area,
      label: `${area.area}㎡ (${area.square}평)`
    });
  });
  return options;
});

// 선택된 면적 라벨
const selectedAreaLabel = computed(() => {
  if (selectedArea.value === 'average') return '단지';
  const area = areas.value.find(a => a.area === selectedArea.value);
  return area ? `${area.area}㎡` : '';
});

const fetchAreas = async () => {
  try {
    loading.value = true;
    error.value = null;
    
    const result = await getHouseAreasApi(props.aptSequence);
    if (!result) {
      throw new Error('면적 정보를 가져오는데 실패했습니다.');
    }
    areas.value = result.areas;
    
  } catch (err) {
    error.value = err.message;
  } finally {
    loading.value = false;
  }
};

// 거래 내역 조회 함수
const fetchDeals = async () => {
  try {
    loading.value = true;
    error.value = null;
    
    const condition = {};
    if (selectedArea.value !== 'average') {
      condition.area = selectedArea.value;
    }
    if (selectedPeriod.value !== 'all') {
      const now = new Date();
      const cutoffDate = new Date();
      cutoffDate.setFullYear(cutoffDate.getFullYear() - parseInt(selectedPeriod.value));
      since.value = cutoffDate.toISOString().split('T')[0];
      until.value = now.toISOString().split('T')[0];
      condition.since = since.value;
      condition.until = until.value;
    }
    console.log('condition', condition);
    const result = await getSpecificHouseDealsApi(props.aptSequence, condition);
    if (!result) {
      throw new Error('거래 내역을 가져오는데 실패했습니다.');
    }
    
    allDeals.value = result.deals;
    allDeals.value.avgDealAmount = result.avgDealAmount;

    // 차트 업데이트
    await nextTick();
    await createChart();
    
  } catch (err) {
    console.error('거래 정보 로딩 에러:', err);
    error.value = err.message;
  } finally {
    loading.value = false;
  }
};

// 면적이나 기간이 변경될 때 거래 내역 다시 조회
watch([selectedArea, selectedPeriod], async () => {
  await fetchDeals();
});

// 표시할 거래 목록
const displayedDeals = computed(() => {
  return allDeals.value.slice(0, displayCount.value);
});

// 더보기 가능 여부
const canLoadMore = computed(() => {
  return allDeals.value.length > displayCount.value;
});

// 남은 거래 건수
const remainingCount = computed(() => {
  return allDeals.value.length - displayCount.value;
});

// 숫자를 가격 문자열로 변환
const formatPriceFromNumber = (price) => {
  if (price >= 10000) {
    const uk = Math.floor(price / 10000);
    const man = price % 10000;
    return man > 0 ? `${uk}억 ${man}만원` : `${uk}억원`;
  } else {
    return `${price}만원`;
  }
};

function getYearMonthLabels(startDate, endDate) {
  const labels = [];
  let year = startDate.getFullYear();
  let month = startDate.getMonth() + 1;
  const endYear = endDate.getFullYear();
  const endMonth = endDate.getMonth() + 1;

  while (year < endYear || (year === endYear && month <= endMonth)) {
    labels.push(`'${year.toString().slice(2)}.${month.toString().padStart(2, '0')}`);
    month++;
    if (month > 12) {
      month = 1;
      year++;
    }
  }
  return labels;
}

// 차트 생성
const createChart = async (retryCount = 0) => {
  if (retryCount > 10) {
    console.error('차트 캔버스 준비 실패, 재출력 포기');
    return;
  }

  if (!chartCanvas.value || allDeals.value.length === 0) return;

  try {
    chartLoading.value = true;

    // 기존 차트 제거
    if (chartInstance.value) {
      try {
        chartInstance.value.destroy();
      } catch (e) {
        chartInstance.value = null;
      }
      chartInstance.value = null;
      // 캔버스 DOM이 완전히 업데이트될 때까지 기다림
      await nextTick();
    }

    // 캔버스와 컨텍스트가 유효한지 재확인
    if (!chartCanvas.value) {
      setTimeout(() => createChart(retryCount + 1), 100);
      return;
    }
    const ctx = chartCanvas.value.getContext('2d');
    if (!ctx) {
      setTimeout(() => createChart(retryCount + 1), 100);
      return;
    }

    // 데이터가 있을 때의 시작/끝 날짜 구하기
    let start, end;
    end = new Date();

    if (selectedPeriod.value === 'all') {
      if (allDeals.value.length > 0) {
        // 거래 내역 중 가장 오래된 거래 찾기
        const sorted = [...allDeals.value].sort((a, b) => {
          const dateA = a.dealYear * 10000 + a.dealMonth * 100 + a.dealDay;
          const dateB = b.dealYear * 10000 + b.dealMonth * 100 + b.dealDay;
          return dateA - dateB;
        });
        start = new Date(sorted[0].dealYear, sorted[0].dealMonth, 1);
        console.log('start', start);
      }
    } else {
      start = new Date(end.getFullYear() - parseInt(selectedPeriod.value), end.getMonth(), 1);
    }

    // ② 모든 월 라벨 생성
    const labels = getYearMonthLabels(start, end);

    // 월별 데이터 준비
    const monthlyData = {};
    labels.forEach(label => { monthlyData[label] = 0; });
    allDeals.value.forEach(deal => {
      const yearMonth = `'${deal.dealYear.toString().slice(2)}.${deal.dealMonth.toString().padStart(2, '0')}`;
      if (monthlyData[yearMonth] !== undefined) monthlyData[yearMonth]++;
    });
    const counts = labels.map(label => monthlyData[label]);

    // 스캐터 데이터 준비 (각 거래를 해당 월의 라벨로 매핑)
    const scatterData = [];
    const monthDealCounter = {};
    allDeals.value.forEach(deal => {
      const yearMonth = `'${deal.dealYear.toString().slice(2)}.${deal.dealMonth.toString().padStart(2, '0')}`;
      if (!monthDealCounter[yearMonth]) monthDealCounter[yearMonth] = 0;
      // labels에 존재하는 월만 scatterData에 추가
      if (labels.includes(yearMonth)) {
        scatterData.push({
          x: yearMonth, // 반드시 라벨 문자열로 넣기
          y: deal.dealAmount
        });
        monthDealCounter[yearMonth]++;
      }
    });

    // Chart 생성 자체도 try-catch로 감싸기
    try {
      chartInstance.value = new Chart(ctx, {
        type: 'bar',
        data: {
          labels,
          datasets: [
            {
              type: 'bar',
              label: '거래 건수',
              data: counts,
              backgroundColor: 'rgba(75, 192, 192, 0.6)',
              borderColor: 'rgba(75, 192, 192, 1)',
              borderWidth: 1,
              yAxisID: 'y'
            },
            {
              type: 'scatter',
              label: '실거래가',
              data: scatterData,
              backgroundColor: 'rgba(255, 99, 132, 0.6)',
              borderColor: 'rgba(255, 99, 132, 1)',
              pointRadius: 4,
              yAxisID: 'y1'
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          interaction: {
            mode: 'index',
            intersect: false,
          },
          plugins: {
            legend: {
              display: true,
              position: 'top'
            },
            tooltip: {
              callbacks: {
                title: function(tooltipItems) {
                  return tooltipItems[0].label;
                },
                label: function(context) {
                  if (context.datasetIndex === 0) {
                    return `거래 건수: ${context.raw}건`;
                  } else {
                    return `실거래가: ${formatPriceFromNumber(context.raw.y)}`;
                  }
                }
              }
            }
          },
          scales: {
            x: {
              type: 'category',
              ticks: {
                maxRotation: 45,
                minRotation: 45
              }
            },
            y: {
              type: 'linear',
              display: true,
              position: 'left',
              beginAtZero: true,
              title: {
                display: true,
                text: '거래 건수'
              },
              ticks: {
                precision: 0,
                stepSize: 1
              }
            },
            y1: {
              type: 'linear',
              display: true,
              position: 'right',
              title: {
                display: true,
                text: '실거래가 (만원)'
              },
              grid: {
                drawOnChartArea: false,
              },
              ticks: {
                callback: function(value) {
                  return formatPriceFromNumber(value);
                }
              }
            }
          }
        }
      });
    } catch (err) {
      console.error('Chart.js 인스턴스 생성 에러:', err);
      setTimeout(() => createChart(retryCount + 1), 100);
      return;
    }

    chartInitialized.value = true;
  } catch (err) {
    console.error('차트 생성 에러:', err);
    setTimeout(() => createChart(retryCount + 1), 100);
  } finally {
    chartLoading.value = false;
  }
};

// 유틸리티 함수
const formatDate = (year, month, day) => {
  return `${year}.${month.toString().padStart(2, '0')}.${day.toString().padStart(2, '0')}`;
};

const formatYearMonth = (year, month) => {
  return `${year.toString().substring(2)}년 ${month.toString().padStart(2, '0')}월`;
};

const getAreaLabel = (area) => {
  if (selectedArea.value === 'average') {
    const areaInfo = areas.value.find(a => a.area === area);
    return areaInfo ? `${area}㎡` : `${area}㎡`;
  }
  return `${area}㎡`;
};

// 이벤트 핸들러
const selectArea = async (area) => {
  // 로딩 중이면 무시
  if (loading.value) return;
  
  selectedArea.value = area;
  displayCount.value = 5; // 면적 변경 시 표시 개수 초기화
};

const selectPeriod = async (period) => {
  // 로딩 중이면 무시
  if (loading.value) return;
  
  selectedPeriod.value = period;
  displayCount.value = 5; // 기간 변경 시 표시 개수 초기화
};

const loadMore = () => {
  displayCount.value += 5;
};

// 컴포넌트 마운트 시 데이터 로드
onMounted(async () => {
  await fetchAreas();
  await fetchDeals();
});
</script>

<style scoped>
.statistics-container {
  background-color: var(--white);
  border-radius: var(--border-radius);
}

/* 면적 필터 (가로 스크롤) */
.area-filter-container {
  position: relative;
  margin-bottom: 16px;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: none; /* Firefox */
}

.area-filter-container::-webkit-scrollbar {
  display: none; /* Chrome, Safari, Edge */
}

.area-filter {
  display: flex;
  flex-wrap: nowrap;
  gap: 8px;
  padding-bottom: 4px;
  min-width: min-content;
}

.area-item {
  padding: 6px 12px;
  border-radius: var(--border-radius);
  background-color: var(--background);
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;
  white-space: nowrap;
}

.area-item:hover {
  background-color: var(--light-gray);
}

.area-item.active {
  background-color: var(--primary);
  color: var(--white);
}

.area-item.disabled {
  opacity: 0.5;
  pointer-events: none;
  cursor: not-allowed;
}

/* 기간 필터 */
.period-filter {
  display: flex;
  border-radius: var(--border-radius);
  overflow: hidden;
  margin-bottom: 16px;
  border: 1px solid var(--light-gray);
}

.period-button {
  flex: 1;
  padding: 8px 0;
  text-align: center;
  background-color: var(--white);
  border: none;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;
}

.period-button:not(:last-child) {
  border-right: 1px solid var(--light-gray);
}

.period-button.active {
  background-color: var(--primary);
  color: var(--white);
}

.period-button:disabled {
  opacity: 0.5;
  pointer-events: none;
  cursor: not-allowed;
}

/* 거래 요약 정보 */
.deal-summary {
  background-color: var(--background);
  border-radius: var(--border-radius);
  padding: 16px;
  margin-bottom: 16px;
}

.summary-date {
  font-size: 14px;
  color: var(--gray);
  margin-bottom: 8px;
}

.summary-details {
  display: flex;
  align-items: center;
  gap: 12px;
}

.deal-type {
  font-size: 14px;
  color: var(--dark);
}

.deal-area {
  font-size: 14px;
  color: var(--dark);
}

.deal-price {
  font-size: 18px;
  font-weight: 600;
  color: var(--primary);
}

/* 차트 */
.chart-container {
  height: 300px;
  margin-bottom: 24px;
  position: relative;
}

.chart-container canvas {
  width: 100% !important;
  height: 100% !important;
}

.chart-loading {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: rgba(255, 255, 255, 0.8);
  z-index: 10;
}

.spin {
  animation: spin 1s linear infinite;
  font-size: 24px;
  margin-bottom: 8px;
  color: var(--primary);
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* 거래 내역 테이블 */
.deals-table {
  border: 1px solid var(--light-gray);
  border-radius: var(--border-radius);
  overflow: hidden;
}

.table-header {
  display: flex;
  background-color: var(--background);
  padding: 12px 16px;
  font-weight: 500;
  font-size: 14px;
  color: var(--dark);
}

.table-row {
  display: flex;
  padding: 12px 16px;
  border-top: 1px solid var(--light-gray);
  font-size: 14px;
  transition: background-color 0.2s;
}

.table-row:hover {
  background-color: var(--background);
}

.col-date {
  flex: 2;
}

.col-floor {
  flex: 1;
  text-align: center;
}

.col-area {
  flex: 2;
  text-align: center;
}

.col-price {
  flex: 2;
  text-align: right;
  font-weight: 500;
  color: var(--primary);
}

.empty-deals {
  padding: 24px;
  text-align: center;
  color: var(--gray);
}

/* 더보기 버튼 */
.load-more-container {
  padding: 16px;
  text-align: center;
  border-top: 1px solid var(--light-gray);
}

.load-more-button {
  background-color: var(--white);
  color: var(--primary);
  border: 1px solid var(--primary);
  padding: 8px 24px;
  border-radius: var(--border-radius);
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;
}

.load-more-button:hover {
  background-color: var(--primary-background);
}

/* 반응형 스타일 */
@media (max-width: 576px) {
  .statistics-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }
  
  .summary-details {
    flex-direction: column;
    align-items: flex-start;
    gap: 4px;
  }
  
  .table-header, .table-row {
    font-size: 12px;
    padding: 10px 12px;
  }
  
  .col-floor {
    display: none;
  }
  
  .col-date {
    flex: 3;
  }
}
</style>