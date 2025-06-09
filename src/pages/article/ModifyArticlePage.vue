<template>
  <div class="article-form-page">
    <div class="container">
      <form @submit.prevent="handleSubmit" class="write-form">
        <div class="form-group">
          <label class="form-label">게시판</label>
          <div class="region-display">{{ currentRegionName }}</div>
        </div>
        <TitleInput v-model="title" />
        <ContentTextarea v-model="content" />
        <FormButtons
          :is-submitting="isSubmitting"
          :is-form-valid="isFormValid"
          button-text="수정하기"
          @cancel="goBack"
          @submit="handleSubmit"
        />
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, toRaw } from 'vue';
import TitleInput from './components/TitleInput.vue';
import ContentTextarea from './components/ContentTextarea.vue';
import FormButtons from './components/FormButtons.vue';
import { useRoute, useRouter } from 'vue-router';
import { getArticleDetailApi } from '@/entities/article/getArticleDetailApi';
import { updateArticleApi } from '@/entities/article/updateArticleApi';
import { useInterestedRegionStore } from '@/features/interestedRegion/interestedRegionStore';

const route = useRoute();
const router = useRouter();
const articleId = ref(0);
const interestedRegionStore = useInterestedRegionStore();

const currentRegionName = ref('');

const title = ref('');
const content = ref('');
const isSubmitting = ref(false);
const isFormValid = computed(() => {
  // 제목 검사
  const isTitleValid = title.value.length >= 3 && 
                      title.value.length <= 100;
  
  // 내용 검사 (마크다운 지원으로 길이 증가)
  const isContentValid = content.value.length >= 10 && 
                        content.value.length <= 5000;
  
  return isTitleValid && isContentValid;
});

onMounted(async () => {
  console.log('route.params:', route.params.id);
  articleId.value = Number(route.params.id);
  console.log('articleId', articleId.value);
  try {
    const article = await getArticleDetailApi(articleId.value);
    console.log('article', article);
    title.value = article.articleTitle;
    content.value = article.articleContent;
    currentRegionName.value = article.regionName;
  } catch {
    alert('게시글을 불러오는데 실패했습니다.');
    goBack();
  }
});

const handleSubmit = async () => {
  if (!isFormValid.value) return;
  isSubmitting.value = true;
  try {
    await interestedRegionStore.fetchInterestRegions();
    const regions = toRaw(interestedRegionStore.regions);
    
    // 현재 지역명과 일치하는 지역 찾기
    console.log('=== 지역명 비교 시작 ===');
    console.log('현재 지역명:', currentRegionName.value);
    console.log('등록된 지역 목록:', regions.map(r => r.name));
    
    const currentRegion = regions.find(region => {
      const regionName = region.name?.trim();
      const currentName = currentRegionName.value.trim();
      console.log('비교:', {
        찾는지역: regionName,
        현재지역: currentName,
        일치여부: regionName === currentName
      });
      return regionName === currentName;
    });

    if (!currentRegion) {
      console.error('현재 게시판을 찾을 수 없습니다.', {
        현재지역명: currentRegionName.value,
        등록된지역: regions.map(r => r.name)
      });
      throw new Error('현재 게시판을 찾을 수 없습니다.');
    }

    console.log(currentRegion.boardId);
    console.log(articleId.value);

    await updateArticleApi(currentRegion.boardId, { 
      id: articleId.value, 
      title: title.value, 
      content: content.value 
    });
    
    alert('게시글이 수정되었습니다.');
    goBack();
  } catch (error) {
    console.error('게시글 수정 실패:', error);
    alert('게시글 수정에 실패했습니다.');
  } finally {
    isSubmitting.value = false;
  }
};

const goBack = () => {
  router.go(-1);
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
