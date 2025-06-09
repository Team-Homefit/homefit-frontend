<template>
  <div class="comment-section">
    <h3 class="comment-section-title">댓글 {{ comments.length }}개</h3>
    
    <!-- 관심지역이 아닌 경우 안내 메시지 -->
    <RegionNoticeBox 
      v-if="!isInterestedRegion" 
      @add-region="$emit('add-region')" 
    />
    
    <!-- 댓글 작성 폼 -->
    <CommentForm 
      v-if="isInterestedRegion && currentMemberRole === 'BASIC'" 
      @submit="handleCommentSubmit" 
      placeholder="댓글을 작성해주세요"
    />
    
    <!-- 댓글 목록 -->
    <div 
      class="comment-list" 
      :class="{ 'blurred': !isInterestedRegion }"
    >
    <template v-for="comment in comments" :key="comment.commentId">
      <CommentItem 
        v-if="!comment.isReply"
        :comment="comment"
        :current-user-id="currentUserId"
        @add-reply="handleReplySubmit"
        @delete-comment="handleDeleteComment"
        @report-comment="handleReportComment"
      />

      <ReplyItem v-else
        class="replies-container"
        :reply="comment"
        :current-user-id="currentUserId"
        @delete-comment="handleDeleteComment"
        @report-comment="handleReportComment"
      />
      </template>
    </div>
  </div>
</template>

<script setup>
import CommentForm from './CommentForm.vue';
import CommentItem from './CommentItem.vue';
import RegionNoticeBox from './RegionNoticeBox.vue';
import ReplyItem from './ReplyItem.vue';

defineProps({
  comments: {
    type: Array,
    required: true
  },
  isInterestedRegion: {
    type: Boolean,
    default: true
  },
  currentUserId: {
    type: Number,
    required: true
  },
  currentMemberRole: {
    type: String,
    required: true
  }
});

const emit = defineEmits([
  'add-comment', 
  'add-reply', 
  'delete-comment', 
  'report-comment', 
  'add-region'
]);

const handleCommentSubmit = (content) => {
  emit('add-comment', content);
};

const handleReplySubmit = (commentId, content) => {
  emit('add-reply', commentId, content);
};

const handleDeleteComment = (commentId) => {
  emit('delete-comment', commentId);
};

const handleReportComment = (commentId) => {
  emit('report-comment', commentId, false);
};
</script>

<style scoped>
.comment-section {
  margin-bottom: 2rem;
}

.comment-section-title {
  font-size: 1.125rem;
  font-weight: 600;
  margin: 0 0 1rem 0;
  color: var(--dark);
}

.comment-list {
  margin-top: 1.5rem;
}

.blurred {
  position: relative;
  filter: blur(4px);
  pointer-events: none;
  user-select: none;
}

.blurred::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(255, 255, 255, 0.3);
  z-index: 1;
}

.replies-container {
  margin-top: 0.75rem;
  margin-left: 1.5rem;
  border-left: 2px solid var(--light-gray);
  padding-left: 1rem;
}
</style>