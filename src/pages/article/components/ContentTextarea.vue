<template>
  <div class="form-group">
    <label for="content" class="form-label">내용</label>
    <div class="editor-container">
      <Editor
        :value="modelValue"
        :plugins="plugins"
        :locale="locale"
        @change="handleEditorChange"
      />
    </div>
    <div class="editor-footer">
      <div class="input-counter">{{ modelValue.length }}/5000</div>
      <div class="markdown-help">
        <i class="bi bi-info-circle"></i>
        <span>우측에서 실시간 미리보기를 확인하세요</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { Editor } from '@bytemd/vue-next';
import gfm from '@bytemd/plugin-gfm';
import highlight from '@bytemd/plugin-highlight';

// ByteMD 스타일 import
import 'bytemd/dist/index.css';
import 'highlight.js/styles/default.css';

defineProps({
  modelValue: {
    type: String,
    required: true
  }
});

const emit = defineEmits(['update:modelValue']);

// ByteMD 플러그인 설정
const plugins = [
  gfm(), // GitHub Flavored Markdown
  highlight() // 코드 하이라이팅
];

// 한국어 로케일
const locale = {
  write: '작성',
  preview: '미리보기',
  writeOnly: '작성만',
  previewOnly: '미리보기만',
  fullscreen: '전체화면',
  exitFullscreen: '전체화면 종료',
  help: '도움말',
  cheatsheet: '마크다운 가이드'
};

// 에디터 내용 변경 핸들러
const handleEditorChange = (value) => {
  emit('update:modelValue', value);
};
</script>

<style scoped>
.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-label {
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--dark);
}

.editor-container {
  border: 1px solid var(--light-gray);
  border-radius: var(--border-radius);
  overflow: hidden;
  min-height: 500px;
}

.editor-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 0.5rem;
}

.input-counter {
  font-size: 0.75rem;
  color: var(--gray);
  text-align: right;
}

.markdown-help {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.75rem;
  color: var(--primary);
}

/* ByteMD 커스텀 스타일 */
:deep(.bytemd) {
  height: 500px;
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

/* 미리보기 영역 스타일링 - 상세페이지와 완전히 동일 */
:deep(.bytemd-preview) {
  font-family: var(--font-family);
  font-size: 1rem;
  line-height: 1.6;
  color: var(--dark);
  padding: 1rem;
}

:deep(.bytemd-preview h1) {
  font-size: 1.5rem;
  font-weight: 700;
  margin: 1.5rem 0 1rem 0;
  color: var(--dark);
  border-bottom: 2px solid var(--light-gray);
  padding-bottom: 0.5rem;
}

:deep(.bytemd-preview h2) {
  font-size: 1.25rem;
  font-weight: 600;
  margin: 1.25rem 0 0.75rem 0;
  color: var(--dark);
}

:deep(.bytemd-preview h3) {
  font-size: 1.125rem;
  font-weight: 600;
  margin: 1rem 0 0.5rem 0;
  color: var(--dark);
}

:deep(.bytemd-preview p) {
  margin: 0.75rem 0;
  line-height: 1.6;
}

:deep(.bytemd-preview strong) {
  font-weight: 700;
  color: var(--dark);
}

:deep(.bytemd-preview em) {
  font-style: italic;
  color: var(--gray);
}

:deep(.bytemd-preview code) {
  background-color: var(--light);
  padding: 0.125rem 0.375rem;
  border-radius: 4px;
  font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
  font-size: 0.875em;
  color: var(--primary);
  border: 1px solid var(--light-gray);
}

:deep(.bytemd-preview pre) {
  background-color: var(--light);
  border: 1px solid var(--light-gray);
  border-radius: var(--border-radius);
  padding: 1rem;
  margin: 1rem 0;
  overflow-x: auto;
}

:deep(.bytemd-preview pre code) {
  background: none;
  border: none;
  padding: 0;
  color: var(--dark);
}

:deep(.bytemd-preview blockquote) {
  border-left: 4px solid var(--primary);
  margin: 1rem 0;
  color: var(--gray);
  font-style: italic;
  background-color: var(--light);
  padding: 1rem;
  border-radius: 0 var(--border-radius) var(--border-radius) 0;
}

:deep(.bytemd-preview ul),
:deep(.bytemd-preview ol) {
  padding-left: 1.5rem;
  margin: 1rem 0;
}

:deep(.bytemd-preview li) {
  margin: 0.5rem 0;
  line-height: 1.6;
}

:deep(.bytemd-preview a) {
  color: var(--primary);
  text-decoration: none;
  border-bottom: 1px solid transparent;
  transition: border-color 0.2s;
}

:deep(.bytemd-preview a:hover) {
  border-bottom-color: var(--primary);
}

:deep(.bytemd-preview table) {
  width: 100%;
  border-collapse: collapse;
  margin: 1rem 0;
  border: 1px solid var(--light-gray);
  border-radius: var(--border-radius);
  overflow: hidden;
}

:deep(.bytemd-preview th),
:deep(.bytemd-preview td) {
  border: 1px solid var(--light-gray);
  padding: 0.75rem;
  text-align: left;
}

:deep(.bytemd-preview th) {
  background-color: var(--light);
  font-weight: 600;
  color: var(--dark);
}

:deep(.bytemd-preview tr:nth-child(even)) {
  background-color: var(--light);
}

:deep(.bytemd-preview hr) {
  border: none;
  border-top: 1px solid var(--light-gray);
  margin: 2rem 0;
}

/* 체크박스 리스트 스타일 */
:deep(.bytemd-preview .task-list-item) {
  list-style: none;
  margin-left: -1.5rem;
}

:deep(.bytemd-preview .task-list-item input) {
  margin-right: 0.5rem;
}

@media (max-width: 768px) {
  :deep(.bytemd) {
    height: 400px;
  }
  
  .editor-container {
    min-height: 400px;
  }
  
  .editor-footer {
    flex-direction: column;
    gap: 0.5rem;
    align-items: flex-start;
  }
}
</style>
