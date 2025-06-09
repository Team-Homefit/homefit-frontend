<template>
  <div class="modal" v-if="show">
    <div class="modal-content">
      <div class="modal-header">
        <h3>내 정보 수정</h3>
        <button class="close-button" @click="onClose">
          <i class="bi bi-x-lg"></i>
        </button>
      </div>

      <div class="modal-body">
        <div class="form-group">
          <label for="nickname">닉네임</label>
          <input 
            type="text" 
            id="nickname" 
            v-model="form.nickname" 
            placeholder="닉네임을 입력하세요"
          />
        </div>
        <div class="form-group">
          <label for="birthdate">생년월일</label>
          <input 
            type="date" 
            id="birthdate" 
            v-model="form.birthday"
          />
        </div>
        <div class="form-group">
          <label>성별</label>
          <div class="radio-group">
            <label class="radio-label">
              <input 
                type="radio" 
                name="gender" 
                value="M" 
                v-model="form.gender"
              />
              <span>남성</span>
            </label>
            <label class="radio-label">
              <input 
                type="radio" 
                name="gender" 
                value="F" 
                v-model="form.gender"
              />
              <span>여성</span>
            </label>
            <label class="radio-label">
              <input 
                type="radio" 
                name="gender"
                value=""
                v-model="form.gender"
              />
              <span>선택하지 않음</span>
            </label>
          </div>
        </div>
        <div class="form-group">
          <label for="phoneNumber">전화번호 (- 포함)</label>
          <input 
            type="tel" 
            id="phoneNumber" 
            v-model="form.tel" 
            placeholder="전화번호를 입력하세요"
          />
        </div>
      </div>
      <div class="modal-footer">
        <button class="cancel-button" @click="onClose">취소</button>
        <button class="save-button" @click="onSave">저장</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits, reactive, watch } from 'vue';

const props = defineProps({
  show: {
    type: Boolean,
    default: false
  },
  member: {
    type: Object,
    required: true
  }
});

const emit = defineEmits(['close', 'save']);

const form = reactive({
  nickname: '',
  birthday: '',
  gender: '',
  tel: ''
});

// member가 변경될 때 form 데이터 업데이트
watch(() => props.member, (newMember) => {
  if (newMember) {
    form.nickname = newMember.nickname;
    form.birthday = newMember.birthday;
    form.gender = newMember.gender;
    form.tel = newMember.tel;
  }
}, { immediate: true });

const onClose = () => {
  emit('close');
};

const onSave = () => {
  emit('save', { ...form });
};
</script>

<style scoped>
.modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background-color: var(--white);
  border-radius: var(--border-radius);
  width: 90%;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  border-bottom: 1px solid var(--light-gray);
}

.modal-header h3 {
  font-size: 18px;
  font-weight: 600;
  margin: 0;
}

.close-button {
  background: transparent;
  border: none;
  font-size: 20px;
  cursor: pointer;
  color: var(--gray);
}

.modal-body {
  padding: 16px;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding: 16px;
  border-top: 1px solid var(--light-gray);
}

/* 폼 스타일 */
.form-group {
  margin-bottom: 16px;
}

.form-group label {
  display: block;
  font-size: 14px;
  font-weight: 500;
  margin-bottom: 8px;
  color: var(--dark);
}

.form-group input[type="text"],
.form-group input[type="date"],
.form-group input[type="tel"] {
  width: 100%;
  padding: 12px;
  border: 1px solid var(--light-gray);
  border-radius: var(--border-radius);
  font-size: 16px;
  font-family: var(--font-family);
  background-color: var(--light);
}

.radio-group {
  display: flex;
  gap: 16px;
}

.radio-label {
  display: flex;
  align-items: center;
  cursor: pointer;
}

.radio-label input {
  margin-right: 8px;
}

/* 버튼 스타일 */
.cancel-button,
.save-button {
  padding: 12px 20px;
  border-radius: var(--border-radius);
  font-size: 16px;
  font-weight: 500;
  border: none;
  cursor: pointer;
}

.cancel-button {
  background-color: var(--light);
  color: var(--gray);
}

.save-button {
  background-color: var(--primary);
  color: var(--white);
}
</style>