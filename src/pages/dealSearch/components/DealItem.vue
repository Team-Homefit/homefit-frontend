<template>
  <div class="deal-item" @click="onClick">
    <div class="deal-header">
      <h3 class="deal-title">{{ deal.aptName }}</h3>
      <span class="deal-price">{{ formatPrice(deal) }}</span>
    </div>
    <div class="deal-info">
      <div class="info-item">
        <i class="bi bi-house"></i>
        <span>{{ deal.excluUseArea }}㎡ ({{ Math.floor(deal.excluUseArea / 3.3) }}평)</span>
      </div>
      <div class="info-item">
        <i class="bi bi-geo-alt"></i>
        <span>{{ formatLocation(deal) }}</span>
      </div>
      <div class="info-item">
        <i class="bi bi-calendar"></i>
        <span>{{ formatDate(deal) }}</span>
      </div>
      <div class="info-item">
        <i class="bi bi-building"></i>
        <span>{{ deal.floor }}층</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps } from 'vue';
import { useRouter } from 'vue-router';
import 'bootstrap-icons/font/bootstrap-icons.css';

const props = defineProps({
  deal: {
    type: Object,
    required: true
  }
});

const router = useRouter();

const onClick = () => {
  router.push({ name: 'houseDetail', params: { id: props.deal.aptSequence } });
}

const formatPrice = (deal) => {
  if (!deal || !deal.dealAmount) return '-';

  const price = Number(deal.dealAmount.replace(',', ''));
  const billion = Math.floor(price / 10000);
  const million = price % 10000;
  
  if (billion > 0 && million > 0) {
    return `${billion}억 ${million}만원`;
  } else if (billion > 0) {
    return `${billion}억원`;
  } else {
    return `${million}만원`;
  }
};

const formatDate = (deal) => {
  if (!deal) return '-';
  if (!deal.dealYear || !deal.dealMonth || !deal.dealDay) return '-';

  return `${deal.dealYear}.${String(deal.dealMonth).padStart(2, '0')}.${String(deal.dealDay).padStart(2, '0')}`;
};

const formatLocation = (deal) => {
  if (!deal || !deal.sggName) return '-';

  return `${deal.sggName} ${deal.umdName ? deal.umdName : ''}`;
}
</script>

<style scoped>
.deal-item {
  background-color: #ffffff;
  border-radius: 0.75rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  padding: 1.25rem;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
  border: 1px solid #F2F4F6;
}

.deal-item:hover {
  transform: translateY(-3px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.deal-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
}

.deal-title {
  font-size: 1.1rem;
  font-weight: 600;
  color: #212529;
  margin: 0;
}

.deal-price {
  font-size: 1.1rem;
  font-weight: 700;
  color: #219EBC;
}

.deal-info {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.info-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
  color: #6c757d;
}

.info-item i {
  color: #8ECAE6;
  font-size: 1rem;
}
</style>