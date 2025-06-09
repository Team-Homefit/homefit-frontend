<template>
  <form class="notification-form" @submit.prevent="handleSubmit">
    <!-- 제목 입력 -->
    <div class="form-group">
      <label for="title">제목 <span class="required">*</span></label>
      <input 
        type="text" 
        id="title" 
        v-model="formData.title" 
        placeholder="공지사항 제목을 입력하세요"
        required
        maxlength="100"
      />
      <div class="input-counter">{{ formData.title.length }}/100</div>
    </div>
    
    <!-- ByteMD 마크다운 에디터 (실시간 미리보기 포함) -->
    <div class="form-group">
      <label for="content">내용 <span class="required">*</span></label>
      <div class="editor-container">
        <Editor
          :value="formData.content"
          :plugins="plugins"
          :locale="locale"
          @change="handleEditorChange"
        />
      </div>
      <div class="editor-footer">
        <div class="input-counter">{{ formData.content.length }}/5000</div>
        <div class="markdown-help">
          <i class="bi bi-info-circle"></i>
          <span>우측에서 실시간 미리보기를 확인하세요</span>
        </div>
      </div>
    </div>
    
    <!-- 버튼 영역 (미리보기 버튼 제거) -->
    <div class="form-actions">
      <div class="action-buttons">
        <button 
          type="button" 
          class="cancel-button" 
          @click="$emit('cancel')"
          :disabled="isSubmitting"
        >
          취소
        </button>
        <button 
          type="submit" 
          class="submit-button" 
          :disabled="!isFormValid || isSubmitting"
        >
          {{ isModify ? '수정하기' : '등록하기' }}
          <i v-if="isSubmitting" class="bi bi-arrow-repeat spinning"></i>
        </button>
      </div>
    </div>
  </form>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import { Editor } from '@bytemd/vue-next';
import gfm from '@bytemd/plugin-gfm';
import highlight from '@bytemd/plugin-highlight';

// ByteMD 스타일 import
import 'bytemd/dist/index.css';
import 'highlight.js/styles/default.css';

const props = defineProps({
  notification: {
    type: Object,
    required: true
  },
  isSubmitting: {
    type: Boolean,
    default: false
  },
  isModify: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['submit', 'cancel']);

// 폼 데이터
const formData = ref({
  title: props.notification.title || '',
  content: props.notification.content || ''
});

// ByteMD 플러그인 설정
const plugins = [
  gfm(), // GitHub Flavored Markdown
  highlight() // 코드 하이라이팅
];

// 한국어 로케일
const locale = {
  write: '작성',
  writeOnly: '작성만',
  fullscreen: '전체화면',
  exitFullscreen: '전체화면 종료',
  help: '도움말',
  cheatsheet: '마크다운 가이드'
};

// 에디터 내용 변경 핸들러
const handleEditorChange = (value) => {
  formData.value.content = value;
};

// props 변경 시 폼 데이터 업데이트
watch(() => props.notification, (newVal) => {
  formData.value = {
    title: newVal.title || '',
    content: newVal.content || ''
  };
}, { deep: true });

// 폼 유효성 검사
const isFormValid = computed(() => {
  const title = formData.value.title;
  const content = formData.value.content;
  
  // 제목 검사
  const isTitleValid = title.length >= 3 && 
                      title.length <= 100 && 
                      /^[가-힣a-zA-Z0-9\s\-_.,!?()]+$/.test(title);
  
  // 내용 검사
  const isContentValid = content.length >= 10 && 
                        content.length <= 5000;
  
  return isTitleValid && isContentValid;
});

// 폼 제출 처리
const handleSubmit = () => {
  if (!isFormValid.value || props.isSubmitting) return;
  
  emit('submit', {
    title: formData.value.title,
    content: formData.value.content
  });
};
</script>

<style scoped>
.notification-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-group label {
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--dark);
}

.required {
  color: var(--error);
}

input[type="text"] {
  padding: 0.75rem;
  border: 1px solid var(--light-gray);
  border-radius: var(--border-radius);
  font-size: 0.875rem;
  color: var(--dark);
  transition: border-color 0.3s;
  font-family: var(--font-family);
}

input[type="text"]:focus {
  outline: none;
  border-color: var(--primary);
}

.input-counter {
  font-size: 0.75rem;
  color: var(--gray);
  text-align: right;
  margin-top: 0.25rem;
}

.editor-container {
  border: 1px solid var(--light-gray);
  border-radius: var(--border-radius);
  overflow: hidden;
  min-height: 500px; /* 높이 증가 */
}

.editor-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 0.5rem;
}

.markdown-help {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.75rem;
  color: var(--primary);
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  margin-top: 1rem;
  padding-top: 1.5rem;
  border-top: 1px solid var(--light-gray);
}

.action-buttons {
  display: flex;
  gap: 0.75rem;
}

.cancel-button,
.submit-button {
  padding: 0.75rem 1rem;
  border-radius: var(--border-radius);
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.cancel-button {
  background-color: var(--white);
  color: var(--gray);
  border: 1px solid var(--light-gray);
}

.cancel-button:hover:not(:disabled) {
  background-color: var(--light);
}

.submit-button {
  background-color: var(--primary);
  color: var(--white);
  border: none;
}

.submit-button:hover:not(:disabled) {
  background-color: var(--primary-dark);
}

.cancel-button:disabled,
.submit-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.spinning {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* ByteMD 커스텀 스타일 */
:deep(.bytemd) {
  height: 500px; /* 높이 증가 */
  font-family: var(--font-family);
}

:deep(.bytemd-toolbar) {
  background-color: var(--light);
  border-bottom: 1px solid var(--light-gray);
}

:deep(.bytemd-toolbar-icon) {
  color: var(--gray);
}

:deep(.bytemd-toolbar-icon:hover) {
  background-color: var(--primary-background);
  color: var(--primary);
}

:deep(.bytemd-toolbar-icon.bytemd-toolbar-icon-active) {
  background-color: var(--primary);
  color: var(--white);
}

:deep(.bytemd-editor) {
  font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
  font-size: 0.875rem;
}

:deep(.bytemd-preview) {
  font-family: var(--font-family);
  font-size: 0.875rem;
  line-height: 1.6;
}

/* 미리보기 영역 스타일링 */
:deep(.bytemd-preview h1) {
  font-size: 1.25rem;
  font-weight: 700;
  margin: 1rem 0 0.75rem 0;
  color: var(--dark);
  border-bottom: 2px solid var(--light-gray);
  padding-bottom: 0.5rem;
}

:deep(.bytemd-preview h2) {
  font-size: 1.125rem;
  font-weight: 600;
  margin: 1rem 0 0.5rem 0;
  color: var(--dark);
}

:deep(.bytemd-preview h3) {
  font-size: 1rem;
  font-weight: 600;
  margin: 0.75rem 0 0.5rem 0;
  color: var(--dark);
}

:deep(.bytemd-preview code) {
  background-color: var(--light);
  padding: 0.125rem 0.375rem;
  border-radius: 4px;
  font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
  font-size: 0.8em;
  color: var(--primary);
  border: 1px solid var(--light-gray);
}

:deep(.bytemd-preview blockquote) {
  border-left: 4px solid var(--primary);
  padding-left: 1rem;
  margin: 1rem 0;
  color: var(--gray);
  font-style: italic;
  background-color: var(--light);
  padding: 0.75rem 1rem;
  border-radius: 0 var(--border-radius) var(--border-radius) 0;
}

@media (max-width: 768px) {
  .form-actions {
    flex-direction: column;
    gap: 1rem;
  }
  
  .action-buttons {
    width: 100%;
  }
  
  .cancel-button,
  .submit-button {
    flex: 1;
    justify-content: center;
  }
  
  :deep(.bytemd) {
    height: 400px;
  }
  
  .editor-container {
    min-height: 400px;
  }
}
</style>