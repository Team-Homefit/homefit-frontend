<template>
  <div class="chat-messages" ref="messagesContainer">
    <div class="messages-content">
      <div v-if="messages.length === 0 && !loading && !aiResponding" class="empty-messages">
        <i class="bi bi-chat-text"></i>
        <p>대화를 시작해보세요!</p>
      </div>
      
      <div v-else class="message-list">
        <MessageItem 
          v-for="message in messages" 
          :key="message.id"
          :message="message"
        />
        
        <!-- AI 응답 생성 중 표시 (개선된 버전) -->
        <div v-if="aiResponding" class="message-item ai-message">
          <div class="message-avatar">
            <i class="bi bi-robot"></i>
          </div>
          <div class="message-content">
            <div class="loading-indicator">
              <div class="typing-dots">
                <span></span>
                <span></span>
                <span></span>
              </div>
              <p>응답 생성중...</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, nextTick } from 'vue';
import MessageItem from './MessageItem.vue';

const props = defineProps({
  messages: {
    type: Array,
    required: true
  },
  loading: {
    type: Boolean,
    default: false
  },
  aiResponding: {
    type: Boolean,
    default: false
  }
});

const messagesContainer = ref(null);

// 메시지가 추가될 때마다 스크롤을 맨 아래로
const scrollToBottom = () => {
  nextTick(() => {
    if (messagesContainer.value) {
      messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight;
    }
  });
};

// 메시지 변경 감지
watch(() => props.messages, scrollToBottom, { deep: true });
watch(() => props.loading, scrollToBottom);
watch(() => props.aiResponding, scrollToBottom);
</script>

<style scoped>
.chat-messages {
  flex: 1;
  overflow-y: auto;
  background-color: var(--background);
  padding: 0;
}

.messages-content {
  min-height: 100%;
  display: flex;
  flex-direction: column;
}

.empty-messages {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px;
  color: var(--gray);
}

.empty-messages i {
  font-size: 48px;
  margin-bottom: 16px;
  opacity: 0.5;
}

.empty-messages p {
  font-size: 16px;
  margin: 0;
}

.message-list {
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

/* 로딩 메시지 스타일 개선 */
.message-item {
  display: flex;
  gap: 12px;
  max-width: 80%;
}

.ai-message {
  align-self: flex-start;
}

.message-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background-color: var(--primary);
  color: var(--white);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  flex-shrink: 0;
}

.message-content {
  flex: 1;
}

.loading-indicator {
  background-color: var(--white);
  border-radius: 16px;
  padding: 16px;
  box-shadow: var(--shadow);
  border: 1px solid var(--light-gray);
}

.typing-dots {
  display: flex;
  gap: 4px;
  margin-bottom: 8px;
}

.typing-dots span {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: var(--primary);
  animation: typing 1.4s infinite ease-in-out;
}

.typing-dots span:nth-child(1) {
  animation-delay: -0.32s;
}

.typing-dots span:nth-child(2) {
  animation-delay: -0.16s;
}

@keyframes typing {
  0%, 80%, 100% {
    transform: scale(0.8);
    opacity: 0.5;
  }
  40% {
    transform: scale(1);
    opacity: 1;
  }
}

.loading-indicator p {
  font-size: 14px;
  color: var(--gray);
  margin: 0;
  font-weight: 500;
}

/* 반응형 스타일 */
@media (max-width: 768px) {
  .message-list {
    padding: 16px;
  }
  
  .message-item {
    max-width: 90%;
  }
}
</style>