<template>
  <div class="map-wrapper">
    <KakaoMap
      width="100%"
      :lat="seoulCity.lat"
      :lng="seoulCity.lng"
      :draggable="true"
      @on-load-kakao-map="onLoadMap"
    />
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import { KakaoMap } from 'vue3-kakao-maps';
import { storeToRefs } from 'pinia';
import { useDealSearchStore } from '@/features/house/dealSearchStore';

const dealSearchStore = useDealSearchStore();
const { deals, condition } = storeToRefs(dealSearchStore);

const emit = defineEmits(['request-api']);

const seoulCity = { lat: 37.566826, lng: 126.9786567 }  // 지도 기본 위치 = 서울 시청
const map = ref();
const markers = ref([]);
let bounds;
let lockRebound = false;
let zoomchangedByRebound = false;

// 맵 초기화
const onLoadMap = (mapRef) => {
  map.value = mapRef;
  map.value.addListener('dragend', onChangeMap);
  map.value.addListener('zoom_changed', onChangeMap);
  setMarkers([]);
}

// 주어진 deals로 마커 생성
const setMarkers = (deals) => {
  clearMarkers();

  if (!lockRebound) {
    bounds = new kakao.maps.LatLngBounds();
  }

  deals.forEach((deal) => {
    if (!deal.latitude || !deal.longitude) return;

    let letLng = new kakao.maps.LatLng(deal.latitude, deal.longitude);

    let marker = new kakao.maps.Marker({
      position: letLng,
      map: map.value,
      title: deal.aptName
    });

    if (!lockRebound) {
      bounds.extend(letLng);
    }

    markers.value.push(marker);
  });

  if (deals.length > 0 && !lockRebound) {
    zoomchangedByRebound = true;
    map.value.setBounds(bounds);
  }

  lockRebound = false;
}

const clearMarkers = () => {
  markers.value.forEach((marker) => marker.setMap(null));
  markers.value = [];
}


// Deal이 바뀔 때마다 마커 다시 생성
watch(
  () => deals,
  (newDeals) => {
    if (map.value) {
      setMarkers(newDeals.value);
    }
  },
  { deep: true }
);


const onChangeMap = () => {
  if (zoomchangedByRebound) {
    zoomchangedByRebound = false;
    return;
  }

  bounds = map.value.getBounds(); 
  const swLatLng = bounds.getSouthWest();
  const neLatLng = bounds.getNorthEast();
  condition.value.swLatitude = swLatLng.getLat();
  condition.value.swLongitude = swLatLng.getLng();
  condition.value.neLatitude = neLatLng.getLat();
  condition.value.neLongitude = neLatLng.getLng();
  lockRebound = true;

  emit('request-api');
}
</script>

<style scoped>
.map-wrapper {
  position: relative;
  width: 100%;
  height: 400px;
  border-radius: 0.75rem;
  overflow: hidden;
  box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.075);
}

</style>