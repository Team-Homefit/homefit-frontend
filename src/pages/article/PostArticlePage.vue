<template>
  <div class="article-form-page">
    <div class="container">
      <form @submit.prevent="handleSubmit" class="write-form">
        <div class="form-group">
          <label class="form-label">게시판</label>
          <div class="region-display">{{ currentRegion.name }}</div>
        </div>
        <TitleInput v-model="article.title" />
        <ContentTextarea v-model="article.content" />
        <FormButtons
          :is-submitting="isSubmitting"
          :is-form-valid="isFormValid"
          button-text="등록하기"
          @cancel="goBack"
          @submit="handleSubmit"
        />
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeMount } from 'vue';
import { useInterestedRegionStore } from '@/features/interestedRegion/interestedRegionStore';
import { useRouter } from 'vue-router';
import TitleInput from './components/TitleInput.vue';
import ContentTextarea from './components/ContentTextarea.vue';
import FormButtons from './components/FormButtons.vue';
import { postArticleApi } from '@/entities/article/postArticleApi';

const interestedRegionStore = useInterestedRegionStore();
const router = useRouter();
const article = ref({
  title: '',
  content: '',
});
const isSubmitting = ref(false);
const currentRegion = ref(null);

const isFormValid = computed(() => {
  const title = article.value.title;
  const content = article.value.content;
  
  // 제목 검사
  const isTitleValid = title.length >= 3 && 
                      title.length <= 100;
  
  // 내용 검사 (마크다운 지원으로 길이 증가)
  const isContentValid = content.length >= 10 && 
                        content.length <= 5000;
  
  return isTitleValid && isContentValid;
});

onBeforeMount(() => {
  const boardId = Number(router.currentRoute.value.params.boardId);
  currentRegion.value = interestedRegionStore.regions.find(region => region.boardId === boardId);
});

onMounted(() => {
  const savedDraft = localStorage.getItem('articleDraft');
  if (savedDraft) {
    try {
      const draft = JSON.parse(savedDraft);
      article.value.title = draft.title || '';
      article.value.content = draft.content || '';
    } catch {}
  }
  const autosaveInterval = setInterval(() => {
    if (article.value.title || article.value.content) saveDraft();
  }, 5000);
  return () => clearInterval(autosaveInterval);
});

const saveDraft = () => {
  localStorage.setItem('articleDraft', JSON.stringify({
    region: currentRegion.value,
    title: article.value.title,
    content: article.value.content,
    timestamp: new Date().toISOString()
  }));
};

const handleSubmit = async () => {
  if (!isFormValid.value) return;
  isSubmitting.value = true;
  try {
    await postArticleApi(article.value.title, article.value.content, currentRegion.value.boardId);
    localStorage.removeItem('articleDraft');
    alert('게시글이 등록되었습니다.');
    router.go(-1);
  } catch {
    alert('게시글 등록에 실패했습니다.');
  } finally {
    isSubmitting.value = false;
  }
};

const goBack = () => {
  // 작성 중인 글이 있는지 확인
  if (article.value.title || article.value.content) {
    if (confirm('작성 중인 글이 있습니다. 정말로 나가시겠습니까?')) {
      localStorage.removeItem('articleDraft');
      article.value.title = '';
      article.value.content = '';
      router.go(-1);
    }
  } else {
    router.go(-1);
  }
};
</script>

<style scoped>
.article-form-page {
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

.write-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-label {
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--dark);
}

.region-display {
  padding: 0.75rem;
  border: 1px solid var(--light-gray);
  border-radius: var(--border-radius);
  font-size: 1rem;
  color: var(--dark);
  background-color: var(--light);
  font-weight: 500;
}

@media (max-width: 576px) {
  .article-form-page {
    padding: 0.75rem;
  }
  
  .write-form {
    gap: 1rem;
  }
}
</style>
