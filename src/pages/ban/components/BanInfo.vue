<template>
  <div class="ban-info">
    <div class="ban-icon">
      <i class="bi bi-exclamation-triangle-fill"></i>
    </div>
    
    <h2>서비스 이용이 제한되었습니다</h2>
    
    <div class="ban-details">
      <div class="ban-period">
        <div class="period-label">제한 기간</div>
        <div class="period-value">
          {{ formatDate(banInfo.startAt) }} ~ {{ formatDate(banInfo.expireAt) }}
          <span class="duration-badge">{{ formatDuration(banInfo.startAt, banInfo.expireAt) }}일</span>
        </div>
      </div>
      
      <div class="ban-reason">
        <div class="reason-label">제한 사유</div>
        <div class="reason-value">{{ banInfo.reason }}</div>
      </div>
    </div>
    
    <div class="ban-notice">
      <p>
        커뮤니티 가이드라인을 위반하여 서비스 이용이 제한되었습니다.
        서비스를 다시 이용하기 위해서는 커뮤니티 가이드라인 동의서를 작성하셔야 합니다.
      </p>
      <p>
        <strong>동의서 작성 후에도 정지 기간이 남아있다면, 정지 기간이 종료된 후에 서비스를 이용하실 수 있습니다.</strong>
      </p>
    </div>
    
    <div class="ban-actions">
      <button class="continue-button" @click="$emit('continue')">
        동의서 작성
      </button>
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue';

defineProps({
  banInfo: {
    type: Object,
    required: true
  }
});

defineEmits(['continue']);

// 날짜 포맷팅
const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('ko-KR', { 
    year: 'numeric', 
    month: '2-digit', 
    day: '2-digit'
  });
};

const formatDuration = (startAt, endAt) => {
  const start = new Date(startAt);
  const end = new Date(endAt);

  const diffTime = end.getTime() - start.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  return diffDays
}
</script>

<style scoped>
.ban-info {
  padding: 32px 24px;
  text-align: center;
}

.ban-icon {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background-color: rgba(220, 53, 69, 0.1);
  color: #dc3545;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 24px;
  font-size: 40px;
}

h2 {
  font-size: 22px;
  font-weight: 600;
  margin-bottom: 24px;
  color: #dc3545;
}

.ban-details {
  background-color: var(--light);
  border-radius: var(--border-radius);
  padding: 20px;
  margin-bottom: 24px;
  text-align: left;
}

.ban-period,
.ban-reason {
  margin-bottom: 16px;
}

.ban-period:last-child,
.ban-reason:last-child {
  margin-bottom: 0;
}

.period-label,
.reason-label {
  font-size: 14px;
  color: var(--gray);
  margin-bottom: 4px;
}

.period-value {
  font-size: 16px;
  font-weight: 500;
}

.duration-badge {
  display: inline-block;
  background-color: #dc3545;
  color: white;
  font-size: 12px;
  font-weight: 600;
  padding: 2px 8px;
  border-radius: 12px;
  margin-left: 8px;
}

.reason-value {
  padding: 12px;
  background-color: var(--white);
  border: 1px solid var(--light-gray);
  border-radius: var(--border-radius);
  font-size: 15px;
  line-height: 1.5;
  word-break: break-word;
}

.ban-notice {
  margin-bottom: 24px;
  text-align: left;
}

.ban-notice p {
  margin-bottom: 12px;
  font-size: 15px;
  line-height: 1.5;
  color: var(--gray);
}

.ban-notice p:last-child {
  margin-bottom: 0;
}

.ban-notice strong {
  color: #dc3545;
}

.ban-actions {
  margin-top: 24px;
}

.continue-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px 24px;
  background-color: var(--primary);
  color: white;
  border: none;
  border-radius: var(--border-radius);
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
}

.continue-button:hover {
  background-color: var(--primary-dark);
}

@media (max-width: 576px) {
  .ban-info {
    padding: 24px 16px;
  }
  
  .ban-details {
    padding: 16px;
  }
}
</style>