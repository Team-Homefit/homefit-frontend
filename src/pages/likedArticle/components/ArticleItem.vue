<template>
  <div class="article-item" @click="$emit('view-article', article.id)">
    <div class="article-region">{{ article.regionName }}</div>
    <div class="article-title">{{ article.title }}</div>

    <div class="article-meta">
      <div class="meta-left">
        <span class="author">{{ article.author.nickname }}</span>
        <span class="separator">·</span>
        <span class="date">{{ formatDate(article.createdAt) }}</span>
      </div>
      <div class="meta-right">
        <div class="stat-item">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="14"
            height="14"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
            />
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
            />
          </svg>
          <span>{{ article.viewCount }}</span>
        </div>
        <div class="stat-item">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="14"
            height="14"
            fill="#ff4d4f"
            viewBox="0 0 24 24"
            stroke="#ff4d4f"
            class="like-icon"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
            />
          </svg>
          <span>{{ article.likeCount }}</span>
        </div>
        <div class="stat-item">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="14"
            height="14"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
            />
          </svg>
          <span>{{ article.commentCount }}</span>
        </div>
      </div>
    </div>

    <div class="article-actions">
      <div class="liked-info">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="currentColor"
          class="liked-icon"
        >
          <path
            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
          />
        </svg>
        <span>{{ formatDate(article.likedAt) }}에 좋아요</span>
      </div>
      <button @click.stop="$emit('unlike-article', article.id)" class="unlike-button">좋아요 취소</button>
    </div>
  </div>
</template>

<script setup>
defineProps({
  article: {
    type: Object,
    required: true,
  },
  isLiked: {
    type: Boolean,
    default: false,
  },
});

defineEmits(["view-article", "unlike-article"]);

// 날짜 포맷 함수
const formatDate = (dateString) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now - date;
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);

  if (diffSec < 60) {
    return "방금 전";
  } else if (diffMin < 60) {
    return `${diffMin}분 전`;
  } else if (diffHour < 24) {
    return `${diffHour}시간 전`;
  } else if (diffDay < 7) {
    return `${diffDay}일 전`;
  } else {
    return `${date.getFullYear()}.${date.getMonth() + 1}.${date.getDate()}`;
  }
};
</script>

<style scoped>
.article-item {
  padding: 1rem;
  border-bottom: 1px solid var(--light-gray);
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.article-item:hover {
  background-color: var(--light);
}

.article-region {
  font-size: 0.75rem;
  color: var(--primary);
  font-weight: 500;
  margin-bottom: 0.5rem;
}

.article-title {
  font-size: 1rem;
  font-weight: 600;
  color: var(--dark);
  margin-bottom: 0.5rem;
  line-height: 1.4;
  word-break: keep-all;
  overflow-wrap: break-word;
}

.article-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.75rem;
  color: var(--gray);
  margin-bottom: 0.75rem;
}

.meta-left {
  display: flex;
  align-items: center;
}

.author {
  font-weight: 500;
}

.separator {
  margin: 0 0.25rem;
}

.meta-right {
  display: flex;
  gap: 0.5rem;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.article-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 0.75rem;
  border-top: 1px dashed var(--light-gray);
}

.liked-info {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.75rem;
  color: var(--gray);
}

.liked-icon {
  color: var(--primary);
}

.unlike-button {
  background: none;
  border: 1px solid var(--light-gray);
  border-radius: var(--border-radius);
  padding: 0.25rem 0.5rem;
  font-size: 0.75rem;
  color: var(--gray);
  cursor: pointer;
  transition: all 0.3s ease;
}

.unlike-button:hover {
  background-color: var(--error-background);
  color: var(--error);
  border-color: var(--error-light);
}

@media (max-width: 576px) {
  .article-item {
    padding: 0.75rem;
  }

  .article-title {
    font-size: 0.9375rem;
  }

  .article-actions {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }

  .unlike-button {
    align-self: flex-end;
  }
}
</style>
