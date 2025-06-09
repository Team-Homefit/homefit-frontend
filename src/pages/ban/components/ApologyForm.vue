<template>
  <div class="apology-form">
    <div class="form-header">
      <h2>커뮤니티 가이드라인 동의서 작성</h2>
      <p class="form-description">
        아래 문구를 정확히 입력하여 동의서를 제출해주세요.
      </p>
    </div>
    
    <div class="apology-template">
      {{ apologyTemplate }}
      <div class="template-content"></div>
    </div>
    
    <div class="form-group">
      <label for="apologyText">동의서 입력</label>
      <textarea 
        id="apologyText" 
        v-model="apologyText" 
        placeholder="위 동의서를 그대로 입력해주세요."
        rows="6"
      ></textarea>
    </div>
    
    <div class="form-actions">
      <button 
        class="back-button" 
        @click="goBack"
      >
        <i class="bi bi-arrow-left"></i>
        뒤로 가기
      </button>
      <button 
        class="submit-button" 
        @click="submitApology"
        :disabled="!isValidApology"
      >
        제출
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, defineProps, defineEmits, watch } from 'vue';

const props = defineProps({
  banInfo: {
    type: Object,
    required: true
  }
});

const emit = defineEmits(['submit', 'back']);

const apologyTemplate = '커뮤니티 가이드라인을 위반하여 부적절한 내용을 게시했습니다. 이러한 행동이 다른 사용자들에게 불쾌감을 줄 수 있다는 점을 인지하고, 앞으로는 커뮤니티 가이드라인을 준수하겠습니다.';

// 사용자 입력
const apologyText = ref('');
const isValidApology = ref(false);

watch(apologyText, () => {
  if (apologyText.value.trim() === apologyTemplate) {
    isValidApology.value = true;
    return;
  }
  isValidApology.value = false;
});


const submitApology = () => {
  if (isValidApology.value) {
    emit('submit');
  }
};


const goBack = () => {
  emit('back');
};
</script>

<style scoped>
.apology-form {
  padding: 32px 24px;
}

.form-header {
  text-align: center;
  margin-bottom: 24px;
}

.form-header h2 {
  font-size: 22px;
  font-weight: 600;
  margin-bottom: 8px;
}

.form-description {
  color: var(--gray);
  font-size: 15px;
}

.apology-template {
  padding: 20px;
  margin-bottom: 24px;

  
  border-radius: var(--border-radius);
  font-size: 16px;
  font-weight: 500;
  line-height: 1.6;
  color: var(--dark);
  background-color: var(--light);
}

.form-group {
  margin-bottom: 24px;
}

.form-group label {
  display: block;
  font-size: 14px;
  font-weight: 500;
  margin-bottom: 8px;
}

.form-group textarea {
  width: 100%;
  padding: 12px;
  border: 1px solid var(--light-gray);
  border-radius: var(--border-radius);
  font-size: 16px;
  line-height: 1.6;
  resize: vertical;
  transition: border-color 0.2s;
}

.form-group textarea:focus {
  border-color: var(--primary);
  outline: none;
}

.form-actions {
  display: flex;
  justify-content: space-between;
  gap: 16px;
}

.back-button,
.submit-button {
  padding: 12px 24px;
  border-radius: var(--border-radius);
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
}

.back-button {
  display: flex;
  align-items: center;
  gap: 8px;
  background-color: var(--light);
  color: var(--gray);
  border: 1px solid var(--light-gray);
}

.submit-button {
  flex: 1;
  background-color: var(--primary);
  color: white;
  border: none;
}

.submit-button:disabled {
  background-color: var(--light-gray);
  color: var(--gray);
  cursor: not-allowed;
}


.back-button:hover {
  background-color: var(--light-gray);
}

.submit-button:hover:not(:disabled) {
  background-color: var(--primary-dark);
}

@media (max-width: 576px) {
  .apology-form {
    padding: 24px 16px;
  }
  
  .form-actions {
    flex-direction: column;
  }
  
  .back-button,
  .submit-button {
    width: 100%;
  }
}
</style>