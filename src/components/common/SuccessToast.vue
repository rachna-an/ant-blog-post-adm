<template>
  <Teleport to="#app">
    <Transition name="fade-toast" @after-leave="$emit('afterLeave')">
      <div
        v-show="visible"
        data-testid="success-toast"
        role="alert"
        class="alert alert-success fixed bottom-5 left-5 bg-[#D8ECDC]/90 border-[#5CB85C] rounded-xl text-neutral !font-medium shadow-sm min-w-75 !pr-6 select-none hover:bg-[#D8ECDC]/70 hover:border-[#468f46]"
        @mouseenter="$emit('mouseEnter')"
        @mouseleave="$emit('mouseLeave')"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
        >
          <path
            d="M8.5 11.5L11 14L15 10M21 12C21 13.1819 20.7672 14.3522 20.3149 15.4442C19.8626 16.5361 19.1997 17.5282 18.364 18.364C17.5282 19.1997 16.5361 19.8626 15.4442 20.3149C14.3522 20.7672 13.1819 21 12 21C10.8181 21 9.64778 20.7672 8.55585 20.3149C7.46392 19.8626 6.47177 19.1997 5.63604 18.364C4.80031 17.5282 4.13738 16.5361 3.68508 15.4442C3.23279 14.3522 3 13.1819 3 12C3 9.61305 3.94821 7.32387 5.63604 5.63604C7.32387 3.94821 9.61305 3 12 3C14.3869 3 16.6761 3.94821 18.364 5.63604C20.0518 7.32387 21 9.61305 21 12Z"
            stroke="#5CB85C"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
        {{ message }}
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
  import { ref, onMounted } from 'vue'

  defineProps({
    message: {
      type: String,
      default: "You've saved successfully.",
    },
  })

  defineEmits(['mouseEnter', 'mouseLeave', 'afterLeave'])

  const visible = ref(false)

  onMounted(() => {
    requestAnimationFrame(() => {
      visible.value = true
    })
  })

  defineExpose({ visible })
</script>

<style scoped>
  .fade-toast-enter-active,
  .fade-toast-leave-active {
    transition: opacity 0.4s ease, transform 0.4s ease;
  }
  .fade-toast-enter-from,
  .fade-toast-leave-to {
    opacity: 0;
    transform: translateY(20px);
  }
  .fade-toast-enter-to,
  .fade-toast-leave-from {
    opacity: 1;
    transform: translateY(0);
  }
</style>
