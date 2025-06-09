<template>
    <div class="shop-cards">
        <ShopCard
          :name="convinence.name"
          :count="`${convinence.count ? convinence.count : '-'}개`"
          :isHard="convinence.count >= 8"
        />
        <ShopCard
          iconClass="bi bi-backpack"
          :name="education.name"
          :count="`${education.count ? education.count : '-'}개`"
          :isHard="education.count >= 5"
        />
        <ShopCard
          iconClass="bi bi-hospital"
          :name="hospital.name"
          :count="`${hospital.count ? hospital.count : '-'}개`"
          :isHard="hospital.count >= 8"
        />
        <ShopCard
          iconClass="bi bi-capsule"
          :name="drugstore.name"
          :count="`${drugstore.count ? drugstore.count : '-'}개`"
          :isHard="drugstore.count >= 5"
        />
        <ShopCard
          :name="bar.name"
          :count="`${bar.count ? bar.count : '-'}개`"
          :isNagative="true"
          :isHard="bar.count >= 8"
        />
        <ShopCard
          iconClass="bi bi-controller"
          :name="recreation.name"
          :count="`${recreation.count ? recreation.count : '-'}개`"
          :isNagative="true"
          :isHard="recreation.count >= 5"
        />
    </div>
</template>

<script setup>
import { ref, defineProps, watch } from 'vue';
import { getShopsNearHouseApi } from '@/entities';
import ShopCard from './ShopCard.vue';

const props = defineProps({
  latitude: Number,
  longitude: Number
})

const convinence = ref({ name: '편의점·마트', count: 0 });
const education = ref({ name: '학원', count: 0 });
const hospital = ref({ name: '병·의원', count: 0 });
const drugstore = ref({ name: '약국', count: 0 });
const bar = ref({ name: '주점', count: 0 });
const recreation = ref({ name: '유원지·오락', count: 0 });


watch(
    () => [props.latitude, props.longitude],
    async ([lat, lng]) => {
        console.log('watch triggered', lat, lng);

        const request = { latitude: lat, longitude: lng };

        const response = await getShopsNearHouseApi(request);

        response.shops.forEach(shop => {
            switch (shop.code) {
                case "G204": convinence.value.count = shop.count; break;
                case "P105": education.value.count = shop.count; break;
                case "Q1": hospital.value.count = shop.count; break;
                case "G21501": drugstore.value.count = shop.count; break;
                case "I211": bar.value.count = shop.count; break;
                case "R104": recreation.value.count = shop.count; break;
            }
        });
    }
);

</script>

<style scoped>
.shop-cards {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
  margin-bottom: 24px;
}
</style>