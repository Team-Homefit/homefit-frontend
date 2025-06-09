<template>
  <div class="article-content">
    <!-- ByteMD Viewer로 마크다운 렌더링 -->
    <Viewer 
      :value="article.articleContent || ''"
      :plugins="viewerPlugins"
    />
  </div>
</template>

<script setup>
import { Viewer } from '@bytemd/vue-next';
import gfm from '@bytemd/plugin-gfm';
import highlight from '@bytemd/plugin-highlight';

// ByteMD 스타일 import
import 'bytemd/dist/index.css';
import 'highlight.js/styles/default.css';

defineProps({
  article: {
    type: Object,
    required: true
  }
});

// ByteMD 뷰어 플러그인 설정 (공지사항과 동일)
const viewerPlugins = [
  gfm(), // GitHub Flavored Markdown
  highlight() // 코드 하이라이팅
];
</script>

<style scoped>
.article-content {
  margin-bottom: 2rem;
  line-height: 1.6;
  font-size: 1rem;
  color: var(--dark);
}

/* ByteMD Viewer 커스텀 스타일 - 공지사항과 완전히 동일 */
:deep(.bytemd-body) {
  font-family: var(--font-family);
  font-size: 1rem;
  line-height: 1.6;
  color: var(--dark);
  padding: 0;
}

:deep(.bytemd-body h1) {
  font-size: 1.5rem;
  font-weight: 700;
  margin: 1.5rem 0 1rem 0;
  color: var(--dark);
  border-bottom: 2px solid var(--light-gray);
  padding-bottom: 0.5rem;
}

:deep(.bytemd-body h2) {
  font-size: 1.25rem;
  font-weight: 600;
  margin: 1.25rem 0 0.75rem 0;
  color: var(--dark);
}

:deep(.bytemd-body h3) {
  font-size: 1.125rem;
  font-weight: 600;
  margin: 1rem 0 0.5rem 0;
  color: var(--dark);
}

:deep(.bytemd-body p) {
  margin: 0.75rem 0;
  line-height: 1.6;
  word-break: keep-all;
  overflow-wrap: break-word;
}

:deep(.bytemd-body strong) {
  font-weight: 700;
  color: var(--dark);
}

:deep(.bytemd-body em) {
  font-style: italic;
  color: var(--gray);
}

:deep(.bytemd-body code) {
  background-color: var(--light);
  padding: 0.125rem 0.375rem;
  border-radius: 4px;
  font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
  font-size: 0.875em;
  color: var(--primary);
  border: 1px solid var(--light-gray);
}

:deep(.bytemd-body pre) {
  background-color: var(--light);
  border: 1px solid var(--light-gray);
  border-radius: var(--border-radius);
  padding: 1rem;
  margin: 1rem 0;
  overflow-x: auto;
}

:deep(.bytemd-body pre code) {
  background: none;
  border: none;
  padding: 0;
  color: var(--dark);
}

:deep(.bytemd-body blockquote) {
  border-left: 4px solid var(--primary);
  margin: 1rem 0;
  color: var(--gray);
  font-style: italic;
  background-color: var(--light);
  padding: 1rem;
  border-radius: 0 var(--border-radius) var(--border-radius) 0;
}

:deep(.bytemd-body ul),
:deep(.bytemd-body ol) {
  padding-left: 1.5rem;
  margin: 1rem 0;
}

:deep(.bytemd-body li) {
  margin: 0.5rem 0;
  line-height: 1.6;
}

:deep(.bytemd-body a) {
  color: var(--primary);
  text-decoration: none;
  border-bottom: 1px solid transparent;
  transition: border-color 0.2s;
}

:deep(.bytemd-body a:hover) {
  border-bottom-color: var(--primary);
}

:deep(.bytemd-body table) {
  width: 100%;
  border-collapse: collapse;
  margin: 1rem 0;
  border: 1px solid var(--light-gray);
  border-radius: var(--border-radius);
  overflow: hidden;
}

:deep(.bytemd-body th),
:deep(.bytemd-body td) {
  border: 1px solid var(--light-gray);
  padding: 0.75rem;
  text-align: left;
}

:deep(.bytemd-body th) {
  background-color: var(--light);
  font-weight: 600;
  color: var(--dark);
}

:deep(.bytemd-body tr:nth-child(even)) {
  background-color: var(--light);
}

:deep(.bytemd-body hr) {
  border: none;
  border-top: 1px solid var(--light-gray);
  margin: 2rem 0;
}

/* 체크박스 리스트 스타일 */
:deep(.bytemd-body .task-list-item) {
  list-style: none;
  margin-left: -1.5rem;
}

:deep(.bytemd-body .task-list-item input) {
  margin-right: 0.5rem;
}

@media (max-width: 576px) {
  :deep(.bytemd-body h1) {
    font-size: 1.25rem;
  }
  
  :deep(.bytemd-body h2) {
    font-size: 1.125rem;
  }
  
  :deep(.bytemd-body h3) {
    font-size: 1rem;
  }
}
</style>
