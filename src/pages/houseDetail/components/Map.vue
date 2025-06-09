<template>
  <div class="map-wrapper">
    <div class="map-placeholder" v-if="isLoading">위치 정보가 없습니다</div>
    <KakaoMap
      width="100%"
      :lat="house.latitude"
      :lng="house.longitude"
      v-else >
      <KakaoMapMarker
        :lat="house.latitude"
        :lng="house.longitude"
      />
    </KakaoMap>
  </div>
</template>

<script setup>
import { defineProps } from 'vue';
import { KakaoMap, KakaoMapMarker } from 'vue3-kakao-maps';

const props = defineProps({
  house: Object,
  isLoading: Boolean
});
</script>

<style scoped>
.map-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: var(--gray);
}

.map-wrapper {
  position: relative;
  width: 100%;
  height: 600px;
  border-radius: var(--border-radius);
  overflow: hidden;
  box-shadow: var(--shadow);
}
</style>