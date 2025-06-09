<template>
  <div class="report-item">
    <div class="report-header">
      <div class="user-info">
        <span class="nickname">{{ reportee.reporteeNickname }}</span>
        <span class="username">{{ reportee.reporteeUsername }}</span>
        <span class="report-count">신고 {{ reportCount }}회</span> 
        <span class="sum-report-count">누적 신고 {{ reportee.totalReportCount }}회</span>
      </div>
    </div>

    <div class="report-content">
      <div class="content-type" v-for="source in reportee.sources">
        <i :class="getContentTypeIcon(source.type)"></i>
        {{ getContentTypeLabel(source.type) }}:
        <button class="content-link" @click="navigateToSource(source)">
          {{ source.type === 'ARTICLE' ? '게시글 보기' : '댓글 보기' }}
        </button>
      </div>
    </div>

    <div class="report-footer">      
      <div class="report-actions">
        <button 
          class="action-button banned" 
          @click="bannedUser(reportee.reporteeId)"
        >
          <i class="bi bi-person-x"></i>
          사용자 정지
        </button>
        <button
          class="action-button ignore"
          @click="emit('pass-report', reportee.reporteeId)"
        >
          <i class="bi bi-x-circle"></i>
          무시하기
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, defineProps, defineEmits, computed } from 'vue';
import { useRouter } from 'vue-router';
import { getArticleByCommentApi } from '@/entities';

const props = defineProps({
  reportee: {
    type: Object,
    required: true
  }
});

const emit = defineEmits(['banned-user', 'pass-report']);

const router = useRouter();

const reportCount = computed(() => props.reportee.sources
  .map(source => source.reports || [])
  .flat().length
);

// 콘텐츠 타입 아이콘
const getContentTypeIcon = (type) => {
  return type === 'ARTICLE' ? 'bi bi-file-text' : 'bi bi-chat-text';
};

// 콘텐츠 타입 라벨
const getContentTypeLabel = (type) => {
  return type === 'ARTICLE' ? '게시글' : '댓글';
};

const navigateToSource = async (source) => {
  let articleId = source.targetSourceId;
  console.log(source);
  console.log(source.targetSourceId);
  if (source.type === 'COMMENT') {
    const result = await getArticleByCommentApi(source.targetSourceId);
    articleId = result.articleId;
  }

  router.push(`/board/article/${articleId}`);
}

// 사용자 정지
const bannedUser = () => {
  const bannedMember = {
    id: props.reportee.reporteeId,
    username: props.reportee.reporteeUsername,
    nickname: props.reportee.reporteeNickname,
    reportCount: props.reportee.reportCount
  }
  emit('banned-user', bannedMember);
};
</script>

<style scoped>
.report-item {
  min-width: 800px;
  background-color: var(--white);
  border: 1px solid var(--light-gray);
  border-radius: var(--border-radius);
  padding: 16px;
  box-shadow: var(--shadow);
  transition: all 0.2s ease;
}

.report-item.processed {
  opacity: 0.7;
}

.report-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 8px;
}

.nickname {
  font-weight: 600;
  font-size: 16px;
}

.username {
  color: var(--gray);
  font-size: 14px;
}

.report-count {
  background-color: var(--primary-background);
  color: var(--primary);
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
}

.sum-report-count {
  background-color: var(--orangeBackground);
  color: var(--orange);
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
}

.report-content {
  background-color: var(--light);
  padding: 12px;
  border-radius: var(--border-radius);
  margin-bottom: 12px;
}

.content-type {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
  line-height: 1.5;
  color: var(--gray);
  margin-bottom: 8px;
}

.content-link {
  color: var(--primary);
  text-decoration: none;
  font-weight: 500;
  background-color: var(--light);
  border: none;
}

.content-link:hover {
  text-decoration: underline;
}

.report-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.report-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.reporters-info {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: var(--gray);
}

.reporters-toggle {
  background: transparent;
  border: none;
  color: var(--gray);
  cursor: pointer;
  padding: 0;
  display: flex;
  align-items: center;
}

.report-actions {
  display: flex;
  gap: 8px;
}

.action-button {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 12px;
  border-radius: var(--border-radius);
  font-size: 14px;
  font-weight: 500;
  border: none;
  cursor: pointer;
  transition: background-color 0.2s;
}

.action-button.banned {
  background-color: #dc3545;
  color: white;
}

.action-button.ignore {
  background-color: var(--light-gray);
  color: var(--gray);
}

.action-button.banned:hover {
  background-color: #c82333;
}

.action-button.ignore:hover {
  background-color: #d1d3d4;
}

.report-status {
  display: flex;
  align-items: center;
}

.status-badge {
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
}

.status-badge.processed {
  background-color: var(--light-gray);
  color: var(--gray);
}

.reporters-list {
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid var(--light-gray);
}

.reporters-list h4 {
  font-size: 14px;
  font-weight: 600;
  margin: 0 0 12px 0;
}

.reporters-list ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.reporters-list li {
  display: flex;
  justify-content: space-between;
  padding: 8px 0;
  border-bottom: 1px solid var(--light-gray);
  font-size: 14px;
}

.reporters-list li:last-child {
  border-bottom: none;
}

.reporter-username {
  font-weight: 500;
}

.reporter-date {
  color: var(--gray);
}

.page-info {
  font-size: 14px;
  color: var(--gray);
}

@media (max-width: 768px) {
  .list-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }
  
  .filter-controls {
    width: 100%;
    flex-direction: column;
    gap: 8px;
  }
  
  .search-box input {
    width: 100%;
  }
  
  .status-filter {
    width: 100%;
  }
  
  .report-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }
  
  .report-footer {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }
  
  .report-actions {
    width: 100%;
  }
  
  .action-button {
    flex: 1;
    justify-content: center;
  }
}
</style>