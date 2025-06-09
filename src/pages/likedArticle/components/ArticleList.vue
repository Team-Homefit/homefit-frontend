<template>
  <div class="article-list">
    <ArticleItem 
      v-for="article in articles" 
      :key="article.id"
      :article="article"
      @view-article="$emit('view-article', article.id)"
      @unlike-article="$emit('unlike-article', article.id)"
    />
  </div>
</template>

<script setup>
import ArticleItem from './ArticleItem.vue';

defineProps({
  articles: {
    type: Array,
    required: true
  }
});

defineEmits(['view-article', 'unlike-article']);
</script>

<style scoped>
.article-list {
  display: flex;
  flex-direction: column;
}
</style>
