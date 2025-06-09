<template>
  <div class="message-input-container">
    <!-- 모드 안내 -->
    <div class="mode-info">
      <div class="mode-description">
        <i :class="modeIcon"></i>
        <span>{{ modeDescription }}</span>
      </div>
      <div v-if="mode === 'analyze'" class="file-upload-hint">
        <i class="bi bi-paperclip"></i>
        <span>계약서 파일을 첨부할 수 있습니다</span>
      </div>
    </div>

    <!-- 입력 영역 -->
    <div class="input-area">
      <!-- 파일 첨부 (계약서 검토 모드에서만) -->
      <div v-if="mode === 'analyze'" class="file-upload">
        <!-- ✅ 파일 입력 - 계약서 검토 모드에서만 표시 -->
        <input 
          type="file"
          ref="fileInput"
          accept=".jpg,.jpeg,.png"
          @change="handleFileSelect"
          style="display: none"
        />
        <button 
          class="file-button"
          @click="$refs.fileInput.click()"
          :disabled="disabled"
          title="파일 첨부"
        >
          <i class="bi bi-paperclip"></i>
        </button>
      </div>

      <!-- 텍스트 입력 -->
      <div class="text-input-container">
        <!-- 첨부된 파일 표시 -->
        <div v-if="selectedFile" class="attached-file">
          <div class="file-info">
            <i class="bi bi-file-earmark-text"></i>
            <span>{{ selectedFile.name }}</span>
            <button class="remove-file" @click="removeFile">
              <i class="bi bi-x"></i>
            </button>
          </div>
        </div>

        <div class="input-wrapper">
          <textarea
            v-model="message"
            ref="messageInput"
            class="message-textarea"
            :placeholder="placeholder"
            :disabled="disabled"
            @keydown="handleKeydown"
            @input="adjustHeight"
            rows="1"
          ></textarea>
          
          <button 
            class="send-button"
            @click="sendMessage"
            :disabled="disabled || !canSend"
            title="전송"
          >
            <i class="bi bi-send-fill"></i>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, nextTick } from 'vue';

const props = defineProps({
  mode: {
    type: String,
    required: true,
    validator: (value) => ['analyze', 'knowledge'].includes(value)
  },
  disabled: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['send-message', 'upload-file']);

// 상태 관리
const message = ref('');
const selectedFile = ref(null);
const messageInput = ref(null);
const fileInput = ref(null);

// 계산된 속성
const modeIcon = computed(() => {
  return props.mode === 'analyze' ? 'bi bi-file-text' : 'bi bi-question-circle';
});

const modeDescription = computed(() => {
  return props.mode === 'analyze' 
    ? '계약서를 업로드하거나 내용을 입력하여 검토를 받아보세요'
    : '부동산 관련 궁금한 점을 자유롭게 질문해보세요';
});

const placeholder = computed(() => {
  return props.mode === 'analyze'
    ? '계약서 내용을 입력하거나 파일을 첨부해주세요...'
    : '부동산 관련 질문을 입력해주세요...';
});

const canSend = computed(() => {
  return message.value.trim() || selectedFile.value;
});

// ✅ 파일 선택 처리 - 계약서 검토 모드에서 파일 업로드 시 호출
const handleFileSelect = (event) => {
  const file = event.target.files[0];
  if (file) {
    // 파일 크기 체크 (10MB 제한)
    if (file.size > 10 * 1024 * 1024) {
      alert('파일 크기는 10MB 이하여야 합니다.');
      return;
    }
    
    // 파일 타입 체크
    const allowedTypes = [
      'image/jpeg',
      'image/png',
      'image/jpg'
    ];
    
    if (!allowedTypes.includes(file.type)) {
      alert('jpg, jpeg, png 파일만 업로드 가능합니다.');
      return;
    }
    
    selectedFile.value = file;
    // ✅ 파일 업로드 이벤트 발생 - 부모 컴포넌트로 파일 정보 전달
    emit('upload-file', file);
  }
  
  // 파일 입력 초기화
  event.target.value = '';
};

// 파일 제거
const removeFile = () => {
  selectedFile.value = null;
  if (fileInput.value) {
    fileInput.value.value = '';
  }
};

// ✅ 메시지 전송 - 전송 버튼 클릭 또는 Enter 키 입력 시 호출
const sendMessage = () => {
  if (!canSend.value || props.disabled) return;
  
  const content = message.value.trim();
  
  // ✅ 파일 데이터 준비 - 계약서 검토 모드에서 파일이 첨부된 경우
  const fileData = selectedFile.value ? {
    name: selectedFile.value.name,
    size: selectedFile.value.size,
    type: selectedFile.value.type,
    file: selectedFile.value // 실제 File 객체
  } : null;
  
  if (content || fileData) {
    // ✅ 메시지 전송 이벤트 발생 - 부모 컴포넌트로 메시지와 파일 데이터 전달
    // 첫 번째 파라미터: 텍스트 메시지
    // 두 번째 파라미터: 파일 데이터 (계약서 검토 시에만 존재)
    emit('send-message', content, fileData);
    
    // 입력 초기화
    message.value = '';
    selectedFile.value = null;
    if (fileInput.value) {
      fileInput.value.value = '';
    }
    
    // 텍스트 영역 높이 초기화
    nextTick(() => {
      adjustHeight();
    });
  }
};

// 키보드 이벤트 처리
const handleKeydown = (event) => {
  if (event.key === 'Enter' && !event.shiftKey) {
    event.preventDefault();
    sendMessage();
  }
};

// 텍스트 영역 높이 자동 조절
const adjustHeight = () => {
  if (messageInput.value) {
    messageInput.value.style.height = 'auto';
    const scrollHeight = messageInput.value.scrollHeight;
    const maxHeight = 120; // 최대 높이 제한
    messageInput.value.style.height = Math.min(scrollHeight, maxHeight) + 'px';
  }
};
</script>

<style scoped>
.message-input-container {
  background-color: var(--white);
  border-top: 1px solid var(--light-gray);
  padding: 16px 24px;
}

.mode-info {
  margin-bottom: 12px;
}

.mode-description {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: var(--gray);
  margin-bottom: 4px;
}

.mode-description i {
  font-size: 16px;
  color: var(--primary);
}

.file-upload-hint {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: var(--gray);
}

.file-upload-hint i {
  font-size: 14px;
}

.input-area {
  display: flex;
  gap: 8px;
  align-items: flex-end;
}

.file-upload {
  display: flex;
  align-items: flex-end;
}

.file-button {
  background-color: var(--background);
  border: 1px solid var(--light-gray);
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
  color: var(--gray);
}

.file-button:hover:not(:disabled) {
  background-color: var(--light-gray);
  color: var(--dark);
}

.file-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.text-input-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.attached-file {
  background-color: var(--background);
  border-radius: var(--border-radius);
  padding: 8px 12px;
}

.file-info {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: var(--dark);
}

.file-info i {
  color: var(--primary);
}

.remove-file {
  background: none;
  border: none;
  color: var(--gray);
  cursor: pointer;
  padding: 2px;
  border-radius: 50%;
  transition: all 0.2s;
  margin-left: auto;
}

.remove-file:hover {
  background-color: var(--error);
  color: var(--white);
}

.input-wrapper {
  display: flex;
  gap: 8px;
  align-items: flex-end;
}

.message-textarea {
  flex: 1;
  border: 1px solid var(--light-gray);
  border-radius: 20px;
  padding: 10px 16px;
  font-size: 16px;
  line-height: 1.4;
  resize: none;
  outline: none;
  transition: border-color 0.2s;
  font-family: inherit;
  min-height: 40px;
  max-height: 120px;
}

.message-textarea:focus {
  border-color: var(--primary);
}

.message-textarea:disabled {
  background-color: var(--background);
  color: var(--gray);
  cursor: not-allowed;
}

.send-button {
  background-color: var(--primary);
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
  color: var(--white);
  flex-shrink: 0;
}

.send-button:hover:not(:disabled) {
  background-color: var(--primary-dark, #0056b3);
  transform: scale(1.05);
}

.send-button:disabled {
  background-color: var(--light-gray);
  color: var(--gray);
  cursor: not-allowed;
  transform: none;
}

/* 반응형 스타일 */
@media (max-width: 768px) {
  .message-input-container {
    padding: 12px 16px;
  }
  
  .mode-info {
    margin-bottom: 8px;
  }
  
  .mode-description {
    font-size: 13px;
  }
  
  .file-upload-hint {
    font-size: 11px;
  }
  
  .input-area {
    gap: 6px;
  }
  
  .file-button,
  .send-button {
    width: 36px;
    height: 36px;
  }
  
  .message-textarea {
    font-size: 14px;
    padding: 8px 12px;
    min-height: 36px;
  }
}
</style>
