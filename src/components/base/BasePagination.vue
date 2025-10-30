<template>
  <div class="flex items-center justify-between p-3 px-5">
    <span class="text-neutral text-sm">
      Showing {{ startEntry }} to {{ endEntry }} of {{ totalItems }} entries
    </span>

    <div v-show="totalItems > 0 && !isLoading" class="join flex items-center justify-center gap-2 !mt-4 md:!mt-0">
      <!-- Previous -->
      <button
        class="join-item btn p-2"
        :disabled="currentPage === 1"
        @click="goToPage(currentPage - 1)"
        aria-label="Previous Page"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="23"
          height="23"
          viewBox="0 0 23 23"
          fill="none"
        >
          <path
            d="M12.705 17L7.70502 11L12.705 5"
            stroke="#4A5568"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </button>

      <!-- Pages -->
      <button
        v-for="page in pages"
        :key="page.key"
        class="join-item btn"
        :class="{
          'btn-active': !page.isEllipsis && page.number === currentPage,
          'btn-ghost bg-transparent border-0 pointer-events-none': page.isEllipsis,
        }"
        :disabled="page.isEllipsis"
        @click="goToPage(page.number)"
      >
        {{ page.isEllipsis ? '...' : page.number }}
      </button>

      <!-- Next -->
      <button
        class="join-item btn p-2"
        :disabled="currentPage === totalPages"
        @click="goToPage(currentPage + 1)"
        aria-label="Next Page"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
        >
          <path
            d="M9.7052 5.58366L14.7052 11.0003L9.7052 16.417"
            stroke="#4A5568"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </button>
    </div>
  </div>
</template>

<script setup>
  import { computed } from 'vue'

  // Props & v-model
  const currentPage = defineModel(Number, { default: 1 })
  const props = defineProps({
    totalItems: { type: Number, default:0, required: true },
    perPage: { type: Number, default: 10 },
    isLoading: { type: Boolean, default: false },
  })

  const totalPages = computed(() => Math.ceil(props.totalItems / props.perPage))
  const startEntry = computed(() =>
    props.totalItems === 0 ? 0 : (currentPage.value - 1) * props.perPage + 1
  )
  const endEntry = computed(() => Math.min(currentPage.value * props.perPage, props.totalItems))

  const goToPage = (page) => {
    if (page < 1 || page > totalPages.value) return
    currentPage.value = page
  }

  // Pagination Logic
  const pages = computed(() => {
    const result = []
    const total = totalPages.value
    const current = currentPage.value

    if (total <= 7) {
      for (let i = 1; i <= total; i++) {
        result.push({ key: `page-${i}`, number: i })
      }
      return result
    }

    if (current <= 4) {
      for (let i = 1; i <= 5; i++) {
        result.push({ key: `page-${i}`, number: i })
      }
      result.push({ key: 'ellipsis-right', isEllipsis: true })
      result.push({ key: `page-${total}`, number: total })
    } else if (current >= total - 3) {
      result.push({ key: 'page-1', number: 1 })
      result.push({ key: 'ellipsis-left', isEllipsis: true })
      for (let i = total - 4; i <= total; i++) {
        result.push({ key: `page-${i}`, number: i })
      }
    } else {
      result.push({ key: 'page-1', number: 1 })
      result.push({ key: 'ellipsis-left', isEllipsis: true })
      for (let i = current - 1; i <= current + 1; i++) {
        result.push({ key: `page-${i}`, number: i })
      }
      result.push({ key: 'ellipsis-right', isEllipsis: true })
      result.push({ key: `page-${total}`, number: total })
    }
    return result
  })
</script>
