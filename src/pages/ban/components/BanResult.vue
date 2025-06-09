<template>
  <div class="ban-result">
    <div v-if="isExpired">
      <div class="result-icon success">
        <i class="bi bi-check-circle-fill"></i>
      </div>
      <h2>동의서가 제출되었습니다</h2>
      <p class="result-message">
        정지 기간이 종료되어 서비스를 다시 이용하실 수 있습니다.
      </p>
      <div class="result-actions">
        <button class="home-button" @click="$emit('go-to-home')">
          홈으로 이동
        </button>
      </div>
    </div>
    
    <div v-else class="result-waiting">
      <div class="result-icon waiting">
        <i class="bi bi-hourglass-split"></i>
      </div>
      <h2>동의서가 제출되었습니다</h2>
      <p class="result-message">
        정지 기간이 아직 남아있습니다. 정지 기간이 종료된 후에 서비스를 이용하실 수 있습니다.
      </p>
      <div class="ban-countdown">
        <div class="countdown-label">정지 해제까지 남은 시간</div>
        <div class="countdown-timer">{{ remainingTimeText }}</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, defineProps, defineEmits } from 'vue';

const props = defineProps({
  banInfo: {
    type: Object,
    required: true
  }
});

const isExpired = ref(false);

defineEmits(['go-to-home']);

// 남은 시간 계산
const remainingTimeText = computed(() => {
  const now = new Date();
  const endDate = new Date(props.banInfo.expireAt);
  
  if (now >= endDate) {
    isExpired.value = true;
    return '0일 0시간 0분';
  }
  
  const diffTime = Math.abs(endDate - now);
  const days = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diffTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diffTime % (1000 * 60 * 60)) / (1000 * 60));
  
  return `${days}일 ${hours}시간 ${minutes}분`;
});
</script>

<style scoped>
.ban-result {
  padding: 32px 24px;
  text-align: center;
}

.result-icon {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 24px;
  font-size: 40px;
}

.result-icon.success {
  background-color: rgba(40, 167, 69, 0.1);
  color: #28a745;
}

.result-icon.waiting {
  background-color: rgba(255, 193, 7, 0.1);
  color: #ffc107;
}

h2 {
  font-size: 22px;
  font-weight: 600;
  margin-bottom: 16px;
}

.result-message {
  font-size: 16px;
  line-height: 1.5;
  color: var(--gray);
  margin-bottom: 24px;
}

.ban-countdown {
  background-color: var(--light);
  border-radius: var(--border-radius);
  padding: 20px;
  margin-bottom: 24px;
}

.countdown-label {
  font-size: 14px;
  color: var(--gray);
  margin-bottom: 8px;
}

.countdown-timer {
  font-size: 24px;
  font-weight: 600;
  color: #ffc107;
}

.result-actions {
  margin-top: 24px;
}

.home-button {
  display: inline-block;
  padding: 12px 32px;
  background-color: var(--primary);
  color: white;
  border: none;
  border-radius: var(--border-radius);
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
}

.home-button:hover {
  background-color: var(--primary-dark);
}

@media (max-width: 576px) {
  .ban-result {
    padding: 24px 16px;
  }
}
</style>