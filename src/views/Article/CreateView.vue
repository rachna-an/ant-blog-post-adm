<template>
  <div class="mb-5!">
    <h1 class="text-[28px] font-bold! text-primary mb-2!">Create Article</h1>
    <p class="!text-neutral !font-medium hidden md:flex">
      Compose a new article and publish it to your platform.
    </p>
  </div>

  <div class="card rounded-xl border border-base-300 bg-base-100 p-6">
    <ArticleForm ref="formRef" v-model="formData" />
  </div>
</template>

<script setup>
  import { reactive, ref } from 'vue'
  import ArticleForm from '@/components/forms/ArticleForm.vue'

  const formRef = ref(null)
  const formData = reactive({
    name: '',
    categoryId: '',
  })
</script>