<template>
  <RouterLink :to="{ name: 'article.preview', params: { id } }" class="block">
    <div class="card bg-base-100 border border-base-300 shadow-xs rounded-lg h-[290px]">
      <figure class="p-3">
        <img :src="thumbnail" alt="Thumbnail" class="h-[150px] w-full rounded-md object-cover" />
      </figure>
      <div class="card-body p-3 pt-0">
        <h2 class="card-title font-bold! line-clamp-1">{{ title }}</h2>
        <div class="line-clamp-3 text-justify" v-html="htmlContent"></div>
      </div>
    </div>
  </RouterLink>
</template>

 <script setup>
  import { QuillDeltaToHtmlConverter } from 'quill-delta-to-html'

  const props = defineProps({
    id: { type: Number, required: true },
    title: { type: String, default: '' },
    thumbnail: { type: String, default: '' },
    content: { type: String, default: '' },
  })

  let htmlContent = ''
  try {
    const parsed = JSON.parse(props.content)
    if (parsed.ops) {
      const converter = new QuillDeltaToHtmlConverter(parsed.ops, {})
      htmlContent = converter.convert()
    } else {
      htmlContent = props.content
    }
  } catch (err) {
    htmlContent = props.content
  }
</script>