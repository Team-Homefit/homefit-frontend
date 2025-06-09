<template>
  <div class="chatbot-page">
    <div class="chatbot-container">
      <!-- 채팅방이 있고 활성 채팅이 있는 경우 -->
      <div v-if="chatStore.chatRooms.length > 0 && chatStore.activeChatId" class="chat-layout">
        <!-- 좌측 채팅방 목록 -->
        <div class="sidebar">
          <div class="sidebar-header">
            <h2>AI 부동산 상담</h2>
            <button class="new-chat-button" @click="startNewChat">
              <i class="bi bi-plus-lg"></i>
            </button>
          </div>
          
          <ChatRoomList 
            :chat-rooms="chatStore.sortedChatRooms"
            :active-chat-id="chatStore.activeChatId"
            :loading="chatStore.isLoadingRooms"
            @select-chat="handleSelectChat"
            @delete-chat="deleteChat"
            @rename-chat="renameChat"
          />
        </div>

        <!-- 우측 메시지 및 입력 영역 -->
        <div class="main-content">
          <!-- 채팅 헤더 -->
          <div class="chat-header">
            <div class="chat-info">
              <h3>{{ chatStore.activeChat?.name || '새 채팅' }}</h3>
            </div>
          </div>

          <!-- 메시지 영역 -->
          <div class="messages-container" ref="messagesContainer">
            <ChatMessages 
              :messages="currentMessages"
              :loading="isLoadingMessages"
              :ai-responding="isLoading"
            />
          </div>

          <!-- 하단 입력 영역 -->
          <div class="input-bottom-container">
            <div class="mode-selector-container">
              <ModeSelector 
                :current-mode="currentMode"
                @change-mode="setCurrentMode"
              />
            </div>
            <div class="input-wrapper">
              <MessageInput 
                :mode="currentMode"
                :disabled="isLoading"
                @send-message="sendMessage"
                @upload-file="uploadFile"
              />
            </div>
          </div>
        </div>
      </div>

      <!-- 채팅방이 없거나 새 채팅 시작 상태인 경우 -->
      <div v-else class="welcome-layout">
        <div class="welcome-content">
          <div class="welcome-header">
            <i class="bi bi-chat-dots"></i>
            <h2>AI 부동산 상담</h2>
            <p>부동산 계약서 검토나 관련 지식을 문의해보세요</p>
          </div>
          
          <!-- 기존 채팅방 목록 표시 -->
          <div v-if="chatStore.chatRooms.length > 0" class="existing-chats">
            <h3>기존 채팅방</h3>
            <div class="existing-chat-list">
              <div 
                v-for="room in chatStore.chatRooms.slice(0, 3)" 
                :key="room.id"
                class="existing-chat-item"
                @click="handleSelectChat(room.id)"
              >
                <div class="chat-name">{{ room.name }}</div>
                <div class="chat-date">{{ formatDate(room.createdAt) }}</div>
              </div>
            </div>
          </div>
          
          <!-- 중앙 입력 영역 -->
          <div class="center-input-container">
            <div class="mode-selector-container">
              <ModeSelector 
                :current-mode="newChatMode"
                @change-mode="setNewChatMode"
              />
            </div>
            <div class="input-wrapper">
              <MessageInput 
                :mode="newChatMode"
                :disabled="isLoading"
                @send-message="sendMessage"
                @upload-file="uploadFile"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <NotificationModal
      :model-value="showNotiModal"
      title="회원가입 안내"
      :message="notiModalText"
      isFail=true
      @close="handleCloseNotiModal"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, nextTick, watch } from 'vue'
import { useChatStore } from '@/features/chat/chatStore'
import { axiosInstance } from '@/entities/axiosInstance'
import NotificationModal from '@/widgets/modal/NotificationModal.vue'
import ChatRoomList from './components/ChatRoomList.vue'
import ChatMessages from './components/ChatMessages.vue'
import MessageInput from './components/MessageInput.vue'
import ModeSelector from './components/ModeSelector.vue'

// Pinia 스토어 사용
const chatStore = useChatStore()

// 로컬 상태
const isLoading = ref(false)
const isLoadingMessages = ref(false)
const newChatMode = ref('analyze')
const currentMode = ref('analyze')
const currentMessages = ref([])
const selectedFile = ref(null)
const messagesContainer = ref(null)
const showNotiModal = ref(false);
const notiModalText = ref('');

// 날짜 포맷팅 함수
const formatDate = (dateString) => {
  if (!dateString) return '방금 전'
  
  const date = new Date(dateString)
  if (isNaN(date.getTime())) return '방금 전'
  
  const now = new Date()
  const diff = now - date
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  
  if (days === 0) {
    return date.toLocaleTimeString('ko-KR', { 
      hour: '2-digit', 
      minute: '2-digit' 
    })
  } else if (days < 7) {
    return `${days}일 전`
  } else {
    return date.toLocaleDateString('ko-KR', { 
      month: 'short', 
      day: 'numeric' 
    })
  }
}

// 새 채팅 시작
const startNewChat = () => {
  chatStore.activeChatId = null
  currentMessages.value = []
  newChatMode.value = 'analyze'
  currentMode.value = 'analyze'
}

// 새 채팅 모드 설정
const setNewChatMode = (mode) => {
  newChatMode.value = mode
}

// 현재 모드 설정
const setCurrentMode = (mode) => {
  currentMode.value = mode
}

// 채팅방 선택 - 메시지 로드
const handleSelectChat = async (chatId) => {
  try {
    chatStore.selectChatRoom(chatId)
    await loadChatMessages(chatId)
  } catch (error) {
    console.error('채팅방 선택 실패:', error)
    alert('채팅방을 불러오는데 실패했습니다.')
  }
}

// 채팅방 메시지 로드
const loadChatMessages = async (roomId) => {
  isLoadingMessages.value = true
  try {
    const data = await axiosInstance.get(`/consult/rooms/${roomId}/messages`)
    currentMessages.value = data.data.messages || []
    
    await nextTick()
    scrollToBottom()
    
  } catch (error) {
    console.error('메시지 로드 오류:', error)
    currentMessages.value = []
    throw error
  } finally {
    isLoadingMessages.value = false
  }
}

// 스크롤을 맨 아래로 이동
const scrollToBottom = () => {
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
  }
}

// 채팅방 삭제
const deleteChat = async (chatId) => {
  try {
    await chatStore.deleteChatRoom(chatId)
    if (chatId === chatStore.activeChatId) {
      currentMessages.value = []
    }
  } catch (error) {
    console.error('채팅방 삭제 실패:', error)
    alert('채팅방 삭제에 실패했습니다.')
  }
}

// 채팅방 이름 변경
const renameChat = async (chatId, newName) => {
  try {
    await chatStore.updateChatRoomName(chatId, newName)
  } catch (error) {
    console.error('채팅방 이름 변경 실패:', error)
    alert('채팅방 이름 변경에 실패했습니다.')
  }
}

// 메시지 전송 - 수정된 버전
const sendMessage = async (content, selectedFile = null) => {
  if (isLoading.value) return

  let targetRoomId = chatStore.activeChatId
  let isFirstMessage = false

  // 새 채팅방인 경우
  if (!targetRoomId) {
    if (selectedFile === null && newChatMode.value === 'analyze') {
      showNotiModal.value = true;
      notiModalText.value = "분석할 계약서를 첨부해주세요.";
      return;
    }

    // 사용자 메시지 추가 (일관된 시간 필드 사용)
    const tempUserMessage = {
      id: 'temp-user-' + Date.now(),
      isMemberMessage: true,
      content,
      fileData: selectedFile,
      createdAt: new Date().toISOString(), // ISO 문자열로 통일
      timestamp: new Date().toISOString()
    }
    currentMessages.value = [tempUserMessage]
    isFirstMessage = true
    currentMode.value = newChatMode.value
    
    // 임시 채팅방 생성
    const newRoom = {
      id: 'temp-room-' + Date.now(),
      name: content.length > 20 ? content.substring(0, 20) + '...' : content,
      createdAt: new Date().toISOString()
    }
    chatStore.addChatRoom(newRoom)
    chatStore.activeChatId = newRoom.id
    targetRoomId = newRoom.id
  }
  
  // 기존 채팅방에 사용자 메시지 추가
  else {
    if (selectedFile === null && currentMode.value === 'analyze') {
      showNotiModal.value = true;
      notiModalText.value = "분석할 계약서를 첨부해주세요.";
      return;
    }

    const userMessage = {
      id: 'user-' + Date.now(),
      isMemberMessage: true,
      content,
      fileData: selectedFile,
      createdAt: new Date().toISOString(),
      timestamp: new Date().toISOString()
    }
    currentMessages.value.push(userMessage)
  }

  await nextTick()
  scrollToBottom()

  // AI 응답 요청 시작
  isLoading.value = true
  
  try {
    const response = await requestAIResponse(currentMode.value, content, selectedFile, isFirstMessage)
    
    if (isFirstMessage && response.consultRoomId) {
      // 임시 채팅방을 실제 ID로 업데이트
      const tempRoom = chatStore.chatRooms.find(
        room => typeof room.id === 'string' && room.id.startsWith('temp-room-')
      )
      if (tempRoom) {
        tempRoom.id = response.consultRoomId
      }
      chatStore.activeChatId = response.consultRoomId
      
      // 서버에서 메시지 다시 로드
      await loadChatMessages(response.consultRoomId)
    } else {
      // 기존 채팅방인 경우 AI 응답 추가
      const aiMessage = {
        id: response.conversationId || 'ai-' + Date.now(),
        isMemberMessage: false,
        content: response.answer,
        createdAt: response.answeredAt || new Date().toISOString(),
        timestamp: response.answeredAt || new Date().toISOString()
      }
      
      // 임시 사용자 메시지 제거 후 정확한 메시지들 추가
      if (isFirstMessage) {
        currentMessages.value = []
        
        // 사용자 메시지 다시 추가 (서버 형식에 맞춰)
        const userMessage = {
          id: 'user-' + Date.now(),
          isMemberMessage: true,
          content,
          fileData,
          createdAt: new Date().toISOString(),
          timestamp: new Date().toISOString()
        }
        currentMessages.value.push(userMessage)
      }
      
      currentMessages.value.push(aiMessage)
      
      await nextTick()
      scrollToBottom()
    }
    
  } catch (error) {
    console.error('AI 응답 요청 실패:', error)
    
    const errorMessage = {
      id: 'error-' + Date.now(),
      isMemberMessage: false,
      content: '죄송합니다. 일시적인 오류가 발생했습니다. 잠시 후 다시 시도해주세요.',
      isError: true,
      createdAt: new Date().toISOString(),
      timestamp: new Date().toISOString()
    }
    
    currentMessages.value.push(errorMessage)
    
    await nextTick()
    scrollToBottom()
  } finally {
    isLoading.value = false
  }
}

// 파일 업로드
const uploadFile = (file) => {
  if (file) {
    // 파일만 저장하고 전송은 하지 않음
    selectedFile.value = file;
    return { file }
  }
  return null
}

// AI 응답 요청
const requestAIResponse = async (mode, content, selectedFile, isFirst = false) => {
  try {
    if (mode === 'knowledge') {
      const payload = {
        message: content,
        isFirst: isFirst
      }
      
      // 기존 채팅방인 경우 consultRoomId 추가
      if (!isFirst) {
        payload.consultRoomId = chatStore.activeChatId
        console.log('기존 채팅방 존재:', payload)
      }
      
      const response = await axiosInstance.post('/consult/knowledge', payload)
      return response.data
      
    } else if (mode === 'analyze') {
      const formData = new FormData()
      // 메시지가 비어있으면 기본 메시지 사용
      formData.append('message', content || '이 계약서를 분석해줘')
      formData.append('isFirst', isFirst.toString())
      
      if (!isFirst) {
        formData.append('consultRoomId', chatStore.activeChatId)
      }
      
      if (selectedFile) {
        formData.append('contractFile', selectedFile.file || selectedFile)
        console.log('파일 추가됨:', selectedFile.name, selectedFile.type, selectedFile.size)
      }

      console.log('FormData 내용:', {
        message: content || '이 계약서를 분석해줘',
        isFirst: isFirst.toString(),
        consultRoomId: !isFirst ? chatStore.activeChatId : undefined,
        hasFile: !!selectedFile
      })
      
      const response = await axiosInstance.post('/consult/analyze', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      return response.data
    }
    
    throw new Error('알 수 없는 모드입니다.')
    
  } catch (error) {
    console.error('API 요청 오류:', error)
    throw error
  }
}

const handleCloseNotiModal = () => {
  showNotiModal.value = false;
  notiModalText.value = '';
}

// 활성 채팅방 변경 시 메시지 로드
watch(() => chatStore.activeChatId, async (newChatId) => {
  if (newChatId && typeof newChatId === 'string' && !newChatId.startsWith('temp-room-')) {
    await loadChatMessages(newChatId)
  }
})

// 컴포넌트 마운트
onMounted(async () => {
  try {
    await chatStore.loadChatRooms()
    
    if (chatStore.chatRooms.length > 0) {
      await handleSelectChat(chatStore.chatRooms[0].id)
    }
  } catch (error) {
    console.error('초기 데이터 로드 실패:', error)
  }
  
  document.body.style.overflow = 'hidden'
})

// 컴포넌트 언마운트
onUnmounted(() => {
  document.body.style.overflow = ''
})
</script>

<style scoped>
.chatbot-page {
  width: 100vw;
  height: 100vh;
  background-color: var(--background);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  position: relative;
}

.chatbot-container {
  flex: 1;
  max-width: 1140px;
  margin: 0 auto;
  width: 100%;
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
}

.chat-layout {
  display: flex;
  flex: 1;
  height: 100%;
  overflow: hidden;
}

.sidebar {
  width: 300px;
  background-color: var(--white);
  border-right: 1px solid var(--light-gray);
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
}

.sidebar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid var(--light-gray);
  flex-shrink: 0;
}

.sidebar-header h2 {
  font-size: 18px;
  font-weight: 600;
  color: var(--dark);
  margin: 0;
}

.new-chat-button {
  background-color: var(--primary);
  color: var(--white);
  border: none;
  border-radius: 50%;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
  flex-shrink: 0;
}

.new-chat-button:hover {
  background-color: var(--primary-dark, #0056b3);
  transform: scale(1.05);
}

.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  background-color: var(--background);
  overflow: hidden;
}

.chat-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px;
  background-color: var(--white);
  border-bottom: 1px solid var(--light-gray);
  flex-shrink: 0;
  height: 70px;
}

.chat-info h3 {
  font-size: 18px;
  font-weight: 600;
  color: var(--dark);
  margin: 0;
}

.messages-container {
  flex: 1;
  overflow-y: auto;
  scroll-behavior: smooth;
  height: calc(100vh - 70px - 160px);
  min-height: 200px;
}

.input-bottom-container {
  background-color: var(--white);
  border-top: 1px solid var(--light-gray);
  padding: 16px 24px 20px 24px;
  flex-shrink: 0;
  height: 160px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  box-sizing: border-box;
  position: relative;
  bottom: 0;
}

.mode-selector-container {
  display: flex;
  justify-content: center;
  margin-bottom: 16px;
  flex-shrink: 0;
}

.input-wrapper {
  width: 100%;
  flex-shrink: 0;
}

.welcome-layout {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px;
  height: 100%;
  overflow: auto;
}

.welcome-content {
  text-align: center;
  max-width: 600px;
  width: 100%;
}

.welcome-header {
  margin-bottom: 40px;
}

.welcome-header i {
  font-size: 64px;
  color: var(--primary);
  margin-bottom: 24px;
}

.welcome-header h2 {
  font-size: 28px;
  font-weight: 600;
  color: var(--dark);
  margin-bottom: 16px;
}

.welcome-header p {
  font-size: 16px;
  color: var(--gray);
  line-height: 1.5;
}

.existing-chats {
  margin-bottom: 40px;
  padding: 20px;
  background-color: var(--white);
  border-radius: 12px;
  border: 1px solid var(--light-gray);
}

.existing-chats h3 {
  font-size: 16px;
  font-weight: 600;
  color: var(--dark);
  margin-bottom: 16px;
}

.existing-chat-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.existing-chat-item {
  padding: 12px 16px;
  border: 1px solid var(--light-gray);
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
  text-align: left;
}

.existing-chat-item:hover {
  background-color: var(--background);
  border-color: var(--primary);
}

.chat-name {
  font-weight: 500;
  color: var(--dark);
  margin-bottom: 4px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.chat-date {
  font-size: 12px;
  color: var(--gray);
}

.center-input-container {
  background-color: var(--white);
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  padding: 24px;
  border: 1px solid var(--light-gray);
}

/* 반응형 스타일 */
@media (max-width: 768px) {
  .chatbot-page {
    height: 100vh;
    height: 100dvh;
  }
  
  .chat-layout {
    flex-direction: column;
  }
  
  .sidebar {
    width: 100%;
    height: auto;
    max-height: 200px;
    border-right: none;
    border-bottom: 1px solid var(--light-gray);
    flex-shrink: 0;
  }
  
  .main-content {
    height: calc(100vh - 200px);
  }
  
  .messages-container {
    height: calc(100vh - 200px - 60px - 140px);
  }
  
  .chat-header {
    padding: 16px 20px;
    height: 60px;
  }
  
  .input-bottom-container {
    padding: 12px 16px 16px 16px;
    height: 140px;
  }
  
  .sidebar-header {
    padding: 16px 20px;
  }
  
  .welcome-content {
    padding: 20px;
  }
  
  .welcome-header {
    margin-bottom: 30px;
  }
  
  .welcome-header i {
    font-size: 48px;
  }
  
  .welcome-header h2 {
    font-size: 24px;
  }
  
  .center-input-container {
    padding: 20px;
    border-radius: 12px;
  }
  
  .existing-chats {
    margin-bottom: 30px;
    padding: 16px;
  }
}

@media (max-width: 480px) {
  .welcome-header {
    margin-bottom: 20px;
  }
  
  .center-input-container {
    padding: 16px;
  }
  
  .input-bottom-container {
    height: 130px;
  }
  
  .existing-chats {
    margin-bottom: 20px;
  }
}

@supports (-webkit-touch-callout: none) {
  .chatbot-page {
    height: -webkit-fill-available;
  }
  
  .main-content {
    height: -webkit-fill-available;
  }
}
</style>