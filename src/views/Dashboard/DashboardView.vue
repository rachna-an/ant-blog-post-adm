<template>
  <div>
    <h1 class="text-[28px] font-bold! text-primary mb-2!">All Articles</h1>
    <p class="!text-neutral !font-medium hidden md:flex">Browse all published articles</p>
  </div>

  <div class="grid grid-cols-3 gap-4 my-5!">
    <ArticleCard
      v-for="article in articleStore.articles"
      :key="article.id"
      :id="article.id"
      :thumbnail="article.thumbnail"
      :title="article.title"
      :content="article.content"
    />
  </div>
</template>

<script setup>
  import ArticleCard from '@/components/dashboard/ArticleCard.vue'
  import { useArticleStore } from '@/stores/article'
  import { onMounted } from 'vue'

  const articleStore = useArticleStore()

  onMounted(articleStore.onLoadArticles)
</script>