<template>
  <Teleport to="body">
    <dialog
      ref="modal"
      class="modal"
      @close="emit('update:visible', false)"
      data-testid="modal-confirmation"
    >
      <div class="modal-box w-[400px]">
        <h3 class="!text-lg !font-semibold text-error" data-testid="cm-title">{{ title }}</h3>
        <p class="text-neutral !text-sm !font-normal py-2">{{ message }}</p>
        <div class="flex justify-between gap-2 !mt-3">
          <div class="flex-1/2">
            <form method="dialog">
              <button class="btn btn-outline w-full">Cancel</button>
            </form>
          </div>
          <button
            class="btn btn-error flex-1/2"
            type="button"
            :disabled="loading"
            @click="emit('confirm')"
            data-testid="btn-confirm"
          >
            <span v-if="loading" class="flex items-center gap-2">
              <span class="loading loading-spinner loading-sm opacity-75"></span>
              {{ buttonText }}
            </span>
            <span v-else>
              {{ buttonText }}
            </span>
          </button>
        </div>
      </div>
      <form method="dialog" class="modal-backdrop">
        <button data-testid="btn-close">close</button>
      </form>
    </dialog>
  </Teleport>
</template>

<script setup>
  import { ref, defineEmits, watch } from 'vue'

  const props = defineProps({
    title: {
      type: String,
      default: 'Confimation',
    },
    message: {
      type: String,
      default: 'message',
    },
    buttonText: {
      type: String,
      default: 'Confirm',
    },
    visible: { type: Boolean, default: false },
    loading: { type: Boolean, default: false },
  })

  const modal = ref(null)
  const emit = defineEmits(['confirm', 'update:visible'])

  // Automatically open the modal when `visible` becomes true
  watch(
    () => props.visible,
    (val) => {
      if (val) modal.value?.showModal()
      else if (modal.value?.open) modal.value.close()
    }
  )
</script>
