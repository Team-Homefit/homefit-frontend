<template>
  <div class="apartment-detail">
    <div class="image-gallery">
      <div class="empty-image" v-if="apartment.image == null">
        <i class="bi bi-image-fill"></i>
      </div>
      <div v-else>
        <img
          :src="apartment.image"
          alt="아파트 이미지"
          class="main-image"
          style="width: 100%; height: 300px; object-fit: cover;"
        />
      </div>

    </div>

    <div class="name-section">
      <div class="name">{{ apartment.aptName }}</div>
      <div class="name-details">{{ apartment.umdName }}</div>
    </div>


    <!-- 주요 정보 -->
    <div class="section detail-section">
      <div class="section-label">주요 정보</div>
      <div class="detail-cards">
        <InfoCard
          image-class="bi bi-geo-alt"
          :value="`${apartment.roadName} ${apartment.roadNameBonbun}길 ${apartment.roadNameBubun ? apartment.roadNameBubun : ''}`"
        />
        <InfoCard
          image-class="bi bi-calendar-event"
          :value="`${String(apartment.buildYear)}년 건축`"
        />
      </div>
    </div>


    <!-- 상권 정보 -->
    <div class="section">
      <div class="section-label">
        상권 정보 <label>(200m)</label>
      </div>
      <ShopCardList :latitude="apartment.latitude" :longitude="apartment.longitude"/>
    </div>
    
    <!-- 거래 통계 -->
    <div class="section">
      <div class="section-label">실거래가</div>
      <Statistics
        v-if="apartment.aptSequence"
        :apt-sequence="apartment.aptSequence"
      />
    </div>

    <!-- 지도 -->
    <div class="section">
      <div class="section-label"> 지도 </div>
      <Map
        class="map-section"
        :house="apartment"
        :isLoading="isLoading"/>
    </div>
  </div>
</template>

<script setup>
import { onBeforeMount, ref } from 'vue';
import { useRoute } from 'vue-router'
import { getHouseDetailApi } from '@/entities';
import InfoCard from './components/InfoCard.vue';
import ShopCardList from './components/ShopCardList.vue';
import Map from './components/Map.vue';
import Statistics from './components/Statistics.vue';
const route = useRoute();

const aptSequence = route.params.id;
const apartment = ref({});
const isLoading = ref(true);

onBeforeMount(async () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });

  const result = await getHouseDetailApi(aptSequence);
  apartment.value = result;
  isLoading.value = false;
})
</script>

<style scoped>
/* 전체 컨테이너 */
.apartment-detail {
  max-width: 1140px;
  margin: 0 auto;
  padding: 16px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
  color: var(--dark);
  position: relative;
}

/* 이미지 갤러리 */
.image-gallery {
  margin-bottom: 20px;
  border-radius: var(--border-radius);
  overflow: hidden;
  box-shadow: var(--shadow);
}

.empty-image {
  position: relative;
  width: 100%;
  height: 300px;

  display: flex;
  align-items: center;
  justify-content: center;

  background-color: var(--gray);
}

.name-section {
  margin-bottom: 16px;
  display: flex;
  flex-wrap: wrap;
  align-items: flex-end;
  gap: 8px;
}

.name {
  font-size: 24px;
  font-weight: 700;
  color: var(--dark);
  margin-right: 12px;
}

.name-details {
  display: flex;
  gap: 8px;
  font-size: 14px;
  color: var(--gray);
}

.detail-section {
  display: flex;
  flex-direction: column;
  align-items: flex-start;

  width: 100%;
}

.detail-cards {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 12px;
  
  font-size: 16px;
}

.section {
  margin-bottom: 40px;
}

.section-label {
  margin-bottom: 12px;

  font-size: 18px;
  font-weight: bold;
}

.section-label label {
  font-size: 14px;
  font-weight: 400;
}

/* 지도 섹션 */
.map-container {
  height: 300px;
  background-color: var(--light);
  border-radius: var(--border-radius);
  overflow: hidden;
  box-shadow: var(--shadow);
}

.map-section {
  margin-bottom: 20px;
  box-shadow: none;
}

/* 반응형 스타일 */
@media (max-width: 576px) {
  .shop-cards {
    grid-template-columns: 1fr;
  }
  
  .features {
    grid-template-columns: 1fr;
  }
  
  .main-image, .empty-image {
    height: 250px;
  }
  
  .name-section {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>