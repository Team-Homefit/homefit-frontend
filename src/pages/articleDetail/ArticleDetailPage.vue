<template>
  <div class="article-detail-page">
    <div class="container">
      <!-- 게시글 헤더 -->
      <ArticleHeader :article="article" />
      
      <!-- 게시글 본문 -->
      <ArticleContent :article="article" />
      
      <!-- 게시글 액션 버튼 -->
      <ArticleActions 
        :is-author="Number(member?.id) === article.writerId" 
        :initial-like-count="article.likeCount"
        :initial-liked="isLiked"
        @edit="handleEdit" 
        @delete="handleDelete" 
        @report="openReportArticleModal"
        @like="handleLike"
        @unlike="handleUnlike"
      />
      
      <!-- 댓글 섹션 -->
      <CommentSection 
        :comments="article.comments" 
        :is-interested-region="isInterestedRegion"
        :current-user-id="Number(member?.id)"
        :current-member-role="member?.role"
        @add-comment="handleAddComment"
        @add-reply="handleAddReply"
        @delete-comment="handleDeleteComment"
        @delete-reply="handleDeleteReply"
        @report-comment="openReportCommentModal"
        @add-region="handleAddRegion"
      />

      <ConfirmModal
        v-model="showReportArticleModal"
        title="게시글 신고 확인"
        message="이 게시글을 신고하시겠습니까?"
        confirm-text="신고"
        cancel-text="취소"
        :is-danger="true"
        @confirm="handleReportArticle"
        @cancel="closeReportArticleModal"
      />

      <ConfirmModal
        v-model="showReportCommentModal"
        title="댓글 신고 확인"
        message="이 댓글을 신고하시겠습니까?"
        confirm-text="신고"
        cancel-text="취소"
        :is-danger="true"
        @confirm="handleReportComment"
        @cancel="closeReportCommentModal"
      />

      <NotificationModal
        v-model="showReportNotiModal"
        title="신고 결과 안내"
        :is-fail="isFailNoti"
        :message="reportNotiMessage"
        @close="handleCloseNotiModal"
      />
      
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onBeforeMount } from 'vue';
import { postReportApi } from '@/entities';
import ConfirmModal from '@/widgets/modal/ConfirmModal.vue';
import NotificationModal from '@/widgets/modal/NotificationModal.vue';
import ArticleHeader from './components/ArticleHeader.vue';
import ArticleContent from './components/ArticleContent.vue';
import ArticleActions from './components/ArticleActions.vue';
import CommentSection from './components/CommentSection.vue';
import { useMemberStore } from '@/features/member/memberStore';
import { useInterestedRegionStore } from '@/features/interestedRegion/interestedRegionStore';
import { useRouter } from 'vue-router';
import { getArticleDetailApi } from '@/entities/article/getArticleDetailApi';
import { postCommentApi } from '@/entities/article/postCommentApi';
import { deleteCommentApi } from '@/entities/article/deleteCommentApi';
import { likeArticleApi } from '@/entities/article/likeArticleApi';
import { unlikeArticleApi } from '@/entities/article/unlikeArticleApi';
import { deleteArticleApi } from '@/entities/article/deleteArticleApi';
const article = ref({})
const router = useRouter();
const memberStore = useMemberStore();
const interestedRegionStore = useInterestedRegionStore();
const member = computed(() => memberStore.member);
// 신고 모달 상태
const showReportArticleModal = ref(false);
const showReportCommentModal = ref(false);
const reportTargetId = ref(null);
// 신고 결과 안내 모달 상태
const showReportNotiModal = ref(false);
const reportNotiMessage = ref('');
const isFailNoti = ref(false);

onBeforeMount(async () => {
  const articleId = router.currentRoute.value.params.id;
  try {
    await memberStore.getMember();
    article.value = await getArticleDetailApi(articleId);
  } catch (error) {
    console.error('게시글 상세 조회 실패:', error);
  }
});

// 관심지역인지 여부
const isInterestedRegion = computed(() => {
  return interestedRegionStore.regions.find(region => region.boardId === article.value.boardId);
});

// 좋아요 여부
const isLiked = computed(() => {
  return article.value.isLiked;
});

// 게시글 데이터 다시 로드
const reloadArticle = async () => {
  try {
    const articleId = router.currentRoute.value.params.id;
    article.value = await getArticleDetailApi(articleId);
  } catch (error) {
    console.error('게시글 데이터 로드 실패:', error);
  }
};

// 이벤트 핸들러
const handleEdit = () => {
  console.log('게시글 수정 핸', typeof article.value.articleId);
  router.push(`/board/article/${article.value.articleId}/modify`);
};

const handleDelete = async () => {
  if (confirm('정말 삭제하시겠습니까?')) {
    console.log('게시글 삭제');
    try {
      await deleteArticleApi(article.value.articleId);
      router.push('/board');
    } catch (error) {
      console.error('게시글 삭제 실패:', error);
    }
  }
};

// 좋아요 처리
const handleLike = async () => {
  console.log('게시글 좋아요');
  try {
    await likeArticleApi(article.value.articleId);
    await reloadArticle(); // 좋아요 후 데이터 다시 로드
  } catch (error) {
    console.error('좋아요 처리 실패:', error);
  }
};

// 좋아요 취소 처리
const handleUnlike = async () => {
  console.log('게시글 좋아요 취소');
  try {
    await unlikeArticleApi(article.value.articleId);
    await reloadArticle(); // 좋아요 취소 후 데이터 다시 로드
  } catch (error) {
    console.error('좋아요 취소 처리 실패:', error);
  }
};

const handleAddComment = async (content) => {
  console.log('댓글 추가:', content);
  try {
    await postCommentApi(article.value.articleId, content);
    await reloadArticle(); // 댓글 추가 후 데이터 다시 로드
  } catch (error) {
    console.error('댓글 추가 실패:', error);
  }
};

const handleAddReply = async (commentId, content) => {
  console.log('대댓글 추가:', commentId, content);
  try {
    await postCommentApi(article.value.articleId, content, commentId);
    await reloadArticle(); // 대댓글 추가 후 데이터 다시 로드
  } catch (error) {
    console.error('대댓글 추가 실패:', error);
  }
};

const handleDeleteComment = async (commentId) => {
  console.log('댓글 삭제:', commentId);
  if (confirm('댓글을 삭제하시겠습니까?')) {
    try {
      await deleteCommentApi(commentId);
      await reloadArticle(); // 댓글 삭제 후 데이터 다시 로드
    } catch (error) {
      console.error('댓글 삭제 실패:', error);
    }
  }
};


// 게시글 신고 핸들러
const openReportArticleModal = () => {
  showReportArticleModal.value = true;
  reportTargetId.value = article.value.articleId;
}
const closeReportArticleModal = () => {
  showReportArticleModal.value = false;
  reportTargetId.value = null;
}
const handleReportArticle = async () => {
  const result = await postReportApi({ sourceId: reportTargetId.value, sourceType: 'ARTICLE' });
  reportTargetId.value = null;

  if (result === 'ALREADY_REPORT') {
    reportNotiMessage.value = '24시간 내에 다시 신고할 수 없습니다.';
    isFailNoti.value = true;
    showReportNotiModal.value = true;
    return;
  }
  if (!result) {
    reportNotiMessage.value = '신고 중에 오류가 발생하였습니다.';
    isFailNoti.value = true;
    showReportNotiModal.value = true;
    return;
  }
  reportNotiMessage.value = '신고가 처리되었습니다.';
  showReportNotiModal.value = true;
};

// 댓글 신고 핸들러
const openReportCommentModal = (commentId, isReply, replyId) => {
  showReportCommentModal.value = true;
  reportTargetId.value = isReply ? replyId : commentId;
}
const closeReportCommentModal = () => {
  showReportCommentModal.value = false;
  reportTargetId.value = null;
}
const handleReportComment = async () => {
  const result = await postReportApi({ sourceId: reportTargetId.value, sourceType: 'COMMENT' });
  reportTargetId.value = null;

  if (result === 'ALREADY_REPORT') {
    reportNotiMessage.value = '24시간 내에 다시 신고할 수 없습니다.';
    isFailNoti.value = true;
    showReportNotiModal.value = true;
    return;
  }
  if (!result) {
    reportNotiMessage.value = '신고 중에 오류가 발생하였습니다.';
    isFailNoti.value = true;
    showReportNotiModal.value = true;
    return;
  }
  reportNotiMessage.value = '신고가 처리되었습니다.';
  showReportNotiModal.value = true;
};

// 신고 안내 모달 핸들링
const handleCloseNotiModal = () => {
  showReportNotiModal.value = false;
  reportNotiMessage.value = null;
  isFailNoti.value = false;
}

const handleAddRegion = () => {
  console.log('관심지역 추가');
  // 실제로는 관심지역 설정 모달 표시 또는 API 호출
  interestedRegionStore.regions.push(article.value.region);
};
</script>

<style scoped>
.article-detail-page {
  min-height: 100vh;
  background-color: var(--white);
  padding: 1rem;
  font-family: 'Noto Sans KR', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: var(--dark);
}

.container {
  max-width: 1140px;
  margin: 0 auto;
}

@media (max-width: 576px) {
  .article-detail-page {
    padding: 0.75rem;
  }
}
</style>