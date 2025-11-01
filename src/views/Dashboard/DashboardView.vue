<template>
  <div>
    <div>
      <h1 class="text-[28px] font-bold! text-primary mb-2!">All Articles</h1>
      <p class="!text-neutral !font-medium hidden md:flex">Browse all published articles</p>
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 my-5!">
      <template v-if="articleStore.isLoading && !articleStore.articles.length">
        <ArticleCardSkeleton v-for="n in 4" :key="n" />
      </template>

      <template v-else>
        <ArticleCard
          v-for="article in articleStore.articles"
          :key="article.id"
          :id="article.id"
          :thumbnail="article.thumbnail"
          :title="article.title"
          :content="article.content"
          :avatar="article.creator.avatar"
          :creatorName="`${article.creator.firstName} ${article.creator.lastName}`"
        />
      </template>
    </div>

    <div class="flex justify-center mt-6">
      <BaseButton
        v-if="articleStore.hasMore"
        btnClass="btn-outline border-neutral-400 text-neutral-600 hover:bg-neutral-100 hover:text-neutral-700 disabled:bg-neutral-100 disabled:text-neutral-400"
        @click="articleStore.loadMoreArticles"
        :disabled="!articleStore.hasMore || articleStore.isLoading"
        :isLoading="articleStore.isLoading"
      >
        {{ articleStore.isLoading ? 'Loading...' : 'Load More' }}
      </BaseButton>
    </div>
  </div>
</template>

<script setup>
  import ArticleCard from '@/components/dashboard/ArticleCard.vue'
  import ArticleCardSkeleton from '@/components/dashboard/ArticleCardSkeleton.vue'
  import { useArticleStore } from '@/stores/article'
  import { onMounted } from 'vue'

  const articleStore = useArticleStore()

  onMounted(() => {
    articleStore.resetPagination()
    articleStore.fetchArticles()
  })
</script>