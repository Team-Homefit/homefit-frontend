<template>
  <div class="chat-room-list">
    <div v-if="loading" class="loading-state">
      <div class="loading-spinner"></div>
      <p>채팅방을 불러오는 중...</p>
    </div>
    
    <div v-else-if="chatRooms.length === 0" class="empty-list">
      <p>아직 채팅방이 없습니다.</p>
    </div>
    
    <div v-else class="room-list">
      <div 
        v-for="room in chatRooms" 
        :key="room.id"
        class="room-item"
        :class="{ active: room.id === activeChatId }"
        @click="$emit('select-chat', room.id)"
      >
        <div class="room-content">
          <div class="room-header">
            <h4 class="room-title">{{ room.name }}</h4>
            <div class="room-actions">
              <button 
                class="action-button"
                @click.stop="showRenameModal(room)"
                title="이름 변경"
              >
                <i class="bi bi-pencil"></i>
              </button>
              <button 
                class="action-button delete"
                @click.stop="confirmDelete(room)"
                title="삭제"
              >
                <i class="bi bi-trash"></i>
              </button>
            </div>
          </div>
          
          <div class="room-info">
            <span class="room-time">{{ formatDate(room.createdAt) }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 이름 변경 모달 -->
    <div v-if="showRename" class="modal-backdrop" @click="closeRenameModal">
      <div class="modal-container" @click.stop>
        <div class="modal-header">
          <h3>채팅방 이름 변경</h3>
          <button class="close-button" @click="closeRenameModal">
            <i class="bi bi-x-lg"></i>
          </button>
        </div>
        <div class="modal-body">
          <input 
            v-model="newTitle"
            type="text"
            class="title-input"
            placeholder="새 이름을 입력하세요"
            @keyup.enter="saveRename"
            ref="titleInput"
          />
        </div>
        <div class="modal-footer">
          <button class="cancel-button" @click="closeRenameModal">취소</button>
          <button class="confirm-button" @click="saveRename">저장</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, nextTick } from 'vue';

const props = defineProps({
  chatRooms: {
    type: Array,
    required: true
  },
  activeChatId: {
    type: [String, Number],
    default: null
  },
  loading: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['select-chat', 'delete-chat', 'rename-chat']);

// 상태 관리
const showRename = ref(false);
const selectedRoom = ref(null);
const newTitle = ref('');
const titleInput = ref(null);

// 날짜 포맷팅
const formatDate = (dateString) => {
  const date = new Date(dateString);
  const now = new Date();
  const diff = now - date;
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  
  if (days === 0) {
    return date.toLocaleTimeString('ko-KR', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  } else if (days < 7) {
    return `${days}일 전`;
  } else {
    return date.toLocaleDateString('ko-KR', { 
      month: 'short', 
      day: 'numeric' 
    });
  }
};

// 이름 변경 모달 표시
const showRenameModal = (room) => {
  selectedRoom.value = room;
  newTitle.value = room.name;
  showRename.value = true;
  
  nextTick(() => {
    if (titleInput.value) {
      titleInput.value.focus();
      titleInput.value.select();
    }
  });
};

// 이름 변경 모달 닫기
const closeRenameModal = () => {
  showRename.value = false;
  selectedRoom.value = null;
  newTitle.value = '';
};

// 이름 변경 저장
const saveRename = () => {
  if (selectedRoom.value && newTitle.value.trim()) {
    emit('rename-chat', selectedRoom.value.id, newTitle.value.trim());
    closeRenameModal();
  }
};

// 삭제 확인
const confirmDelete = (room) => {
  if (confirm(`"${room.name}" 채팅방을 삭제하시겠습니까?`)) {
    emit('delete-chat', room.id);
  }
};
</script>

<style scoped>
.chat-room-list {
  flex: 1;
  overflow-y: auto;
}

.loading-state {
  padding: 40px 20px;
  text-align: center;
  color: var(--gray);
}

.loading-spinner {
  width: 24px;
  height: 24px;
  border: 2px solid var(--light-gray);
  border-top: 2px solid var(--primary);
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 16px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.empty-list {
  padding: 40px 20px;
  text-align: center;
  color: var(--gray);
}

.room-list {
  padding: 8px 0;
}

.room-item {
  padding: 16px 20px;
  cursor: pointer;
  transition: all 0.2s;
  border-bottom: 1px solid var(--light-gray);
}

.room-item:hover {
  background-color: var(--background);
}

.room-item.active {
  background-color: var(--primary-background, #e3f2fd);
  border-left: 4px solid var(--primary);
}

.room-content {
  width: 100%;
}

.room-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 8px;
}

.room-title {
  font-size: 16px;
  font-weight: 500;
  color: var(--dark);
  margin: 0;
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  margin-right: 8px;
}

.room-actions {
  display: flex;
  gap: 4px;
  opacity: 0;
  transition: opacity 0.2s;
}

.room-item:hover .room-actions {
  opacity: 1;
}

.action-button {
  background: none;
  border: none;
  color: var(--gray);
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  transition: all 0.2s;
  font-size: 12px;
}

.action-button:hover {
  background-color: var(--light-gray);
  color: var(--dark);
}

.action-button.delete:hover {
  background-color: var(--error);
  color: var(--white);
}

.room-info {
  display: flex;
  justify-content: flex-start;
  align-items: center;
}

.room-time {
  font-size: 12px;
  color: var(--gray);
}

/* 모달 스타일 */
.modal-backdrop {
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
  padding: 16px;
}

.modal-container {
  background-color: var(--white);
  border-radius: var(--border-radius);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
  width: 100%;
  max-width: 400px;
  overflow: hidden;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px 16px 24px;
  border-bottom: 1px solid var(--light-gray);
}

.modal-header h3 {
  font-size: 18px;
  font-weight: 600;
  color: var(--dark);
  margin: 0;
}

.close-button {
  background: none;
  border: none;
  color: var(--gray);
  cursor: pointer;
  font-size: 16px;
  padding: 4px;
  border-radius: 4px;
  transition: all 0.2s;
}

.close-button:hover {
  background-color: var(--background);
  color: var(--dark);
}

.modal-body {
  padding: 24px;
}

.title-input {
  width: 100%;
  padding: 12px;
  border: 1px solid var(--light-gray);
  border-radius: var(--border-radius);
  font-size: 16px;
  outline: none;
  transition: border-color 0.2s;
}

.title-input:focus {
  border-color: var(--primary);
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding: 16px 24px 24px 24px;
  border-top: 1px solid var(--light-gray);
}

.cancel-button,
.confirm-button {
  padding: 10px 20px;
  border-radius: var(--border-radius);
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  border: 1px solid;
  min-width: 80px;
}

.cancel-button {
  background-color: var(--white);
  color: var(--gray);
  border-color: var(--light-gray);
}

.cancel-button:hover {
  background-color: var(--background);
  border-color: var(--gray);
  color: var(--dark);
}

.confirm-button {
  background-color: var(--primary);
  color: var(--white);
  border-color: var(--primary);
}

.confirm-button:hover {
  background-color: var(--primary-dark, #0056b3);
  border-color: var(--primary-dark, #0056b3);
}
</style>
