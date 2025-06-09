import { defineStore } from "pinia";
import { axiosInstance } from '@/entities/axiosInstance';

const api = axiosInstance;

export const useChatStore = defineStore("chat", {
  state: () => ({
    // 채팅방 목록 (간단한 정보만)
    chatRooms: [],

    // UI 상태
    activeChatId: null,
    isLoadingRooms: false,
  }),

  getters: {
    // 활성 채팅방
    activeChat: (state) => {
      return state.chatRooms.find((room) => room.id === state.activeChatId);
    },

    // 생성일 기준 정렬된 채팅방 목록 (최신이 위)
    sortedChatRooms: (state) => {
      return [...state.chatRooms].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    },
  },

  actions: {
    // 채팅방 목록 로드
    async loadChatRooms() {
      if (this.isLoadingRooms) return;

      this.isLoadingRooms = true;
      try {
        const { data } = await api.get('/consult/rooms');
        this.chatRooms = data.rooms || [];
      } catch (error) {
        console.error("채팅방 목록 로드 오류:", error);
        throw error;
      } finally {
        this.isLoadingRooms = false;
      }
    },

    // 채팅방 선택
    selectChatRoom(roomId) {
      this.activeChatId = roomId;
    },

    // 새 채팅방 추가
    addChatRoom(roomData) {
      // 중복 체크
      const exists = this.chatRooms.find((room) => room.id === roomData.id);
      if (!exists) {
        this.chatRooms.unshift({
          id: roomData.id,
          name: roomData.name,
          createdAt: roomData.createdAt,
        });
      }
      this.activeChatId = roomData.id;
    },

    // 채팅방 삭제
    async deleteChatRoom(roomId) {
      console.log('store 삭제roomId', roomId)
      try {
        await api.delete(`/consult/rooms/${roomId}`);
        console.log('store 삭제roomId', roomId)

        // 로컬에서 제거
        this.chatRooms = this.chatRooms.filter((room) => room.id !== roomId);
        console.log('store 삭제roomId', roomId)

        // 활성 채팅방이었다면 다른 채팅방 선택
        if (this.activeChatId === roomId) {
          if (this.chatRooms.length > 0) {
            this.activeChatId = this.chatRooms[0].id;
          } else {
            this.activeChatId = null;
          }
        }
      } catch (error) {
        console.error("채팅방 삭제 오류:", error);
        throw error;
      }
    },

    // 채팅방 이름 변경
    async updateChatRoomName(roomId, newName) {
      const room = this.chatRooms.find((r) => r.id === roomId);
      if (room) {
        try{
            await api.patch(`/consult/rooms/${roomId}/name`, { name: newName });
            room.name = newName;
        } catch (error) {
            console.error("채팅방 이름 변경 오류:", error);
            throw error;
        }
      }
    },
  },
});
