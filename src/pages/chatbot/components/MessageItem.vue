<template>
  <div class="message-item" :class="messageClass">
    <!-- AI 메시지 아바타 -->
    <div v-if="!message.isMemberMessage" class="message-avatar">
      <i class="bi bi-robot"></i>
    </div>
    
    <div class="message-content">
      <!-- 메시지 바디 -->
      <div class="message-body" :class="{ error: message.isError }">
        <!-- 파일 첨부 (사용자 메시지) -->
        <div v-if="message.fileData" class="file-attachment">
          <i class="bi bi-file-earmark-text"></i>
          <span>{{ message.fileData.name }}</span>
        </div>
        
        <!-- 메시지 내용 -->
        <div class="message-text">
          <!-- AI 메시지는 마크다운 렌더링 -->
          <div v-if="!message.isMemberMessage" v-html="renderedContent"></div>
          <!-- 사용자 메시지는 일반 텍스트 -->
          <div v-else>{{ message.content }}</div>
        </div>
      </div>
      
      <!-- 메시지 시간 -->
      <div class="message-time">
        {{ formatTime(message.createdAt || message.timestamp) }}
      </div>
    </div>
    
    <!-- 사용자 메시지 아바타 -->
    <div v-if="message.isMemberMessage" class="message-avatar user">
      <i class="bi bi-person-fill"></i>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { marked } from 'marked';

const props = defineProps({
  message: {
    type: Object,
    required: true
  }
});

// 메시지 클래스
const messageClass = computed(() => {
  return {
    'user-message': props.message.isMemberMessage,
    'ai-message': !props.message.isMemberMessage
  };
});

// 마크다운 렌더링
const renderedContent = computed(() => {
  if (props.message.isMemberMessage) return props.message.content;
  
  try {
    marked.setOptions({
      breaks: true,
      gfm: true,
      sanitize: false
    });
    
    return marked(props.message.content || '');
  } catch (error) {
    console.error('마크다운 렌더링 오류:', error);
    return props.message.content || '';
  }
});

// 시간 포맷팅 - 수정된 버전
const formatTime = (timestamp) => {
  if (!timestamp) return '방금 전';
  
  const date = new Date(timestamp);
  
  // Invalid Date 체크
  if (isNaN(date.getTime())) {
    console.warn('Invalid timestamp:', timestamp);
    return '방금 전';
  }
  
  const now = new Date();
  const isToday = date.toDateString() === now.toDateString();
  
  if (isToday) {
    return date.toLocaleTimeString('ko-KR', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  } else {
    return date.toLocaleDateString('ko-KR', { 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit', 
      minute: '2-digit' 
    });
  }
};
</script>

<style scoped>
.message-item {
  display: flex;
  gap: 12px;
  max-width: 80%;
  margin-bottom: 16px;
}

.user-message {
  align-self: flex-end;
  flex-direction: row-reverse;
}

.ai-message {
  align-self: flex-start;
}

.message-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  flex-shrink: 0;
}

.message-avatar:not(.user) {
  background-color: var(--primary);
  color: var(--white);
}

.message-avatar.user {
  background-color: var(--gray);
  color: var(--white);
}

.message-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.user-message .message-content {
  align-items: flex-end;
}

.ai-message .message-content {
  align-items: flex-start;
}

.message-body {
  background-color: var(--white);
  border-radius: 16px;
  padding: 12px 16px;
  box-shadow: var(--shadow);
  word-wrap: break-word;
  max-width: 100%;
}

.user-message .message-body {
  background-color: var(--primary);
  color: var(--white);
}

.message-body.error {
  background-color: var(--error-background, #ffebee);
  border-left: 4px solid var(--error);
}

.file-attachment {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  background-color: var(--background);
  border-radius: 8px;
  margin-bottom: 8px;
  font-size: 14px;
  color: var(--dark);
}

.user-message .file-attachment {
  background-color: rgba(255, 255, 255, 0.2);
  color: var(--white);
}

.file-attachment i {
  font-size: 16px;
}

.message-text {
  line-height: 1.5;
}

/* 마크다운 스타일링 */
.message-text :deep(h1),
.message-text :deep(h2),
.message-text :deep(h3),
.message-text :deep(h4),
.message-text :deep(h5),
.message-text :deep(h6) {
  margin: 16px 0 8px 0;
  font-weight: 600;
  color: var(--dark);
}

.message-text :deep(h1) { font-size: 1.5em; }
.message-text :deep(h2) { font-size: 1.3em; }
.message-text :deep(h3) { font-size: 1.1em; }

.message-text :deep(p) {
  margin: 8px 0;
}

.message-text :deep(ul),
.message-text :deep(ol) {
  margin: 8px 0;
  padding-left: 20px;
}

.message-text :deep(li) {
  margin: 4px 0;
}

.message-text :deep(strong) {
  font-weight: 600;
  color: var(--primary);
}

.message-text :deep(code) {
  background-color: var(--background);
  padding: 2px 4px;
  border-radius: 4px;
  font-family: 'Courier New', monospace;
  font-size: 0.9em;
}

.message-text :deep(pre) {
  background-color: var(--background);
  padding: 12px;
  border-radius: 8px;
  overflow-x: auto;
  margin: 8px 0;
}

.message-text :deep(blockquote) {
  border-left: 4px solid var(--primary);
  padding-left: 12px;
  margin: 8px 0;
  color: var(--gray);
  font-style: italic;
}

.message-time {
  font-size: 12px;
  color: var(--gray);
  margin-top: 4px;
}

/* 반응형 스타일 */
@media (max-width: 768px) {
  .message-item {
    max-width: 90%;
  }
  
  .message-avatar {
    width: 32px;
    height: 32px;
    font-size: 14px;
  }
  
  .message-body {
    padding: 10px 12px;
  }
}
</style>