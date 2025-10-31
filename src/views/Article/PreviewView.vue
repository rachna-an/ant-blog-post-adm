<template>
  <div v-if="article" class="grid gap-4 my-2! text-neutral-800">
    <div class="relative">
      <div
        class="absolute badge badge-soft bg-white/40 !border-white/10 rounded-full py-3! px-5! text-zinc-600! font-semibold! m-3! backdrop-blur-xs!"
      >
        {{ article.category.name }}
      </div>
      <img
        :src="article.thumbnail"
        alt="Thumbnail"
        class="w-full h-[350px] rounded-lg object-cover"
      />
    </div>

    <div class="flex items-center gap-2">
      <img
        :src="article.creator.avatar"
        alt="Creator Avatar"
        class="w-10 h-10 object-cover rounded-full border border-zinc-50"
      />
      <div class="grid text-zinc-700">
        <span class="text-[16px] font-semibold!">
          {{ article.creator.firstName }} {{ article.creator.lastName }}
        </span>
        <span class="text-sm italic">
          Published on: {{ formatDate(article.createdAt, 'MMM DD, YYYY') }}
        </span>
      </div>
    </div>

    <h1 class="text-4xl font-extrabold!">{{ article.title }}</h1>

    <QuillEditor
      :content="deltaContent"
      class="!border-none"
      theme="snow"
      :options="quillOptions"
    />
  </div>

  <!-- Loading -->
  <div v-else class="grid gap-4 my-2 animate-pulse">
    <div class="w-full h-[350px] bg-base-300 rounded-lg"></div>

    <div class="flex items-center gap-2">
      <div class="w-10 h-10 bg-base-300 rounded-full"></div>
      <div class="grid gap-2!">
        <div class="h-3.5 w-40 bg-base-300 rounded-xl"></div>
        <div class="h-3.5 w-32 bg-base-300 rounded-xl"></div>
      </div>
    </div>

    <!-- Title -->
    <div class="h-8 w-3/4 bg-base-300 rounded-xl"></div>

    <!-- Content -->
    <div class="space-y-2!">
      <div class="h-4 bg-base-300 rounded-xl"></div>
      <div class="h-4 bg-base-300 rounded-xl"></div>
      <div class="h-4 bg-base-300 rounded-xl"></div>
      <div class="h-4 bg-base-300 rounded-xl w-11/12"></div>
    </div>
  </div>
</template>

<script setup>
  import { useArticleStore } from '@/stores/article'
  import { onMounted, ref, computed, toRaw } from 'vue'
  import { formatDate } from '@/utils/dateFormat'
  import { QuillEditor } from '@vueup/vue-quill'
  import Delta from 'quill-delta'
  import hljs from 'highlight.js'
  import 'highlight.js/styles/atom-one-dark.css'

  const articleStore = useArticleStore()

  const props = defineProps({ id: { type: String, required: true } })
  const article = ref(null)

  onMounted(async () => {
    article.value = await articleStore.fetchArticleById(props.id)
  })

  // Quill Editor options
  const quillOptions = {
    readOnly: true,
    modules: {
      syntax: {
        highlight: (text) => hljs.highlightAuto(text).value,
      },
      toolbar: false,
    },
  }

  const deltaContent = computed(() => {
    if (!article.value || !article.value.content) return new Delta().insert('')

    const content = article.value.content
    try {
      const parsed = JSON.parse(content)
      if (parsed && parsed.ops) return new Delta(toRaw(parsed))
      return new Delta().insert(String(content))
    } catch (e) {
      return new Delta().insert(String(content))
    }
  })
</script>
