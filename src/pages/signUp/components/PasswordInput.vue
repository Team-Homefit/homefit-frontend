<template>
  <div class="password-input-component">
    <div class="form-group">
      <label :for="id">{{ label }}</label>
      <div class="password-input">
        <input 
          :type="showPassword ? 'text' : 'password'" 
          :id="id" 
          v-model="password" 
          :placeholder="placeholder"
          @input="updatePassword"
        />
        <button 
          class="toggle-password" 
          @click="showPassword = !showPassword"
          type="button"
        >
          <i :class="showPassword ? 'bi bi-eye-slash-fill' : 'bi bi-eye-fill'"></i>
        </button>
      </div>
      <p v-if="hint" class="hint-text">{{ hint }}</p>
      <p v-if="error" class="error-text">{{ error }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, defineProps, defineEmits, watch } from 'vue';

const props = defineProps({
  id: {
    type: String,
    required: true
  },
  label: {
    type: String,
    default: '비밀번호'
  },
  placeholder: {
    type: String,
    default: '비밀번호를 입력하세요'
  },
  hint: {
    type: String,
    default: ''
  },
  modelValue: {
    type: String,
    default: ''
  },
  error: {
    type: String,
    default: ''
  }
});

const emit = defineEmits(['update:modelValue']);

const password = ref(props.modelValue);
const showPassword = ref(false);


// 비밀번호 업데이트
const updatePassword = () => {
  emit('update:modelValue', password.value);
};

// props.modelValue가 변경될 때 password 업데이트
watch(() => props.modelValue, (newValue) => {
  password.value = newValue;
});
</script>

<style scoped>
.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  font-size: 14px;
  font-weight: 500;
  margin-bottom: 8px;
  color: var(--dark);
}

.password-input {
  position: relative;
}

.password-input input {
  width: 100%;
  padding: 12px 16px;
  border: 1px solid var(--light-gray);
  border-radius: var(--border-radius);
  font-size: 16px;
  background-color: var(--light);
  transition: border-color 0.2s;
}

.password-input input:focus {
  border-color: var(--primary);
  outline: none;
}

.toggle-password {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  background: transparent;
  border: none;
  color: var(--gray);
  cursor: pointer;
  font-size: 16px;
}

.hint-text {
  font-size: 12px;
  color: var(--gray);
  margin-top: 8px;
}

.error-text {
  font-size: 12px;
  color: #dc3545;
  margin-top: 8px;
}
</style>