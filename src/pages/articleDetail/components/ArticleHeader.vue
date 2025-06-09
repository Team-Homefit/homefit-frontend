<template>
  <div class="article-header">
    <div class="region-badge">{{ article.regionName }}</div>
    <h1 class="article-title">{{ article.articleTitle }}</h1>
    <div class="article-meta">
      <div class="author-info">
        <span class="author-name">{{ article.nickname }}</span>
        <span class="separator">·</span>
        <div class="meta-item time-row">
          <i class="bi bi-calendar3"></i>
          <span>{{ formatDate(article.articleCreatedAt) }}</span>
          <span class="separator"></span>
          <div v-if="article.articleLastUpdatedAt" class="updated-text">
            <i class="bi bi-pencil"></i>
            <span>{{ formatDate(article.articleLastUpdatedAt) }} 수정됨</span>
          </div>
        </div>
      </div>
      <div class="article-stats">
        <div class="stat-item">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
          <span>{{ article.viewCount }}</span>
        </div>
        <div class="stat-item">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
          <span>{{ article.likeCount }}</span>
        </div>
        <div class="stat-item">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
          <span>{{ article.comments.length }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  article: {
    type: Object,
    required: true
  },
});

// 날짜 포맷 함수
// 날짜 포맷팅
const formatDate = (dateString) => {
  if (!dateString) return '';
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      console.error('잘못된 날짜 형식:', dateString);
      return dateString;
    }
    return new Intl.DateTimeFormat("ko-KR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  } catch (error) {
    console.error('날짜 포맷팅 에러:', error);
    return dateString;
  }
};
</script>

<style scoped>
.article-header {
  margin-bottom: 1.5rem;
  border-bottom: 1px solid var(--light-gray);
  padding-bottom: 1rem;
}

.region-badge {
  display: inline-block;
  background-color: var(--primary-background);
  color: var(--primary);
  font-size: 0.75rem;
  font-weight: 500;
  padding: 0.25rem 0.5rem;
  border-radius: 50rem;
  margin-bottom: 0.5rem;
}

.article-title {
  font-size: 1.5rem;
  font-weight: 700;
  margin: 0 0 1rem 0;
  line-height: 1.4;
  color: var(--dark);
  word-break: keep-all;
  overflow-wrap: break-word;
}

.article-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.875rem;
  color: var(--gray);
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  color: var(--gray);
}

.meta-item.updated {
  color: var(--primary);
  font-style: italic;
}

.meta-item i {
  font-size: 0.875rem;
}

.author-info {
  display: flex;
  align-items: center;
}

.author-name {
  font-weight: 500;
  color: var(--dark);
}

.separator {
  margin: 0 0.2rem;
}

.article-stats {
  display: flex;
  gap: 0.75rem;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.time-row {
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.updated-text {
  color: var(--primary);
  font-style: italic;
}

@media (max-width: 576px) {
  .article-title {
    font-size: 1.25rem;
  }
  
  .article-meta {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }
  
  .article-stats {
    width: 100%;
    justify-content: flex-start;
  }
}
</style>