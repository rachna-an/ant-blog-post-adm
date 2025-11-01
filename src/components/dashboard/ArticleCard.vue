<template>
  <div class="card bg-base-100 border border-base-300 shadow-xs rounded-lg">
    <RouterLink :to="{ name: 'article.preview', params: { id } }" class="flex flex-col flex-grow">
      <figure class="p-3">
        <img :src="thumbnail" alt="Thumbnail" class="h-[180px] w-full rounded-md object-cover" />
      </figure>

      <div class="card-body p-3 pt-0">
        <h2 class="card-title font-bold! line-clamp-1 flex-none">{{ title }}</h2>
        <div class="line-clamp-2 text-justify flex-none" v-html="htmlContent"></div>

        <div class="card-actions grow items-end">
          <img :src="avatar" alt="Creator Avatar" class="w-6 h-6 object-cover rounded-full" />
          <span class="text-sm text-zinc-500 font-medium! ">{{ creatorName }}</span>
        </div>
      </div>
    </RouterLink>
  </div>
</template>

 <script setup>
  import { QuillDeltaToHtmlConverter } from 'quill-delta-to-html'

  const props = defineProps({
    id: { type: Number, required: true },
    title: { type: String, default: '' },
    thumbnail: { type: String, default: '' },
    content: { type: String, default: '' },
    avatar: { type: String, default: '' },
    creatorName: { type: String, default: '' },
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