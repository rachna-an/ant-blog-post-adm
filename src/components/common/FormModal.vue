<!-- FormModal.vue -->
<template>
  <Teleport to="body">
    <dialog ref="modal" class="modal" @close="emit('update:show', false)">
      <div class="modal-box w-[350px] md:w-[462px] !overflow-visible">
        <form method="dialog">
          <button
            class="btn btn-sm btn-ghost absolute right-2 top-3 bg-transparent border-0 hover:contrast-125"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="30"
              height="30"
              viewBox="0 0 32 32"
              fill="none"
            >
              <path
                d="M8 24L23.92 8M24 24L8.08 8"
                stroke="#4A5568"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </button>
        </form>

        <!-- Title -->
        <h3 class="!text-2xl !font-semibold text-primary">{{ title }}</h3>

        <!-- Form -->
        <div class="mt-5! mb-7!">
          <slot></slot>
        </div>

        <!-- Button -->
        <BaseButton class="w-full" :loading="loading" @click="handleSave">
          <template #icon>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                d="M18 5V4C18 3.73478 17.8946 3.48043 17.7071 3.29289C17.5196 3.10536 17.2652 3 17 3H8.914C8.6488 3.00006 8.39449 3.10545 8.207 3.293L4.293 7.207C4.10545 7.39449 4.00006 7.64881 4 7.914V20C4 20.2652 4.10536 20.5196 4.29289 20.7071C4.48043 20.8946 4.73478 21 5 21H17C17.2652 21 17.5196 20.8946 17.7071 20.7071C17.8946 20.5196 18 20.2652 18 20V15M9 3V7C9 7.26522 8.89464 7.51957 8.70711 7.70711C8.51957 7.89464 8.26522 8 8 8H4M15.383 8.772L18.128 11.518M19.343 7.612C19.7344 8.00371 19.9542 8.53478 19.9542 9.0885C19.9542 9.64222 19.7344 10.1733 19.343 10.565L12.693 17.211L9 17.95L9.739 14.258L16.385 7.612C16.5789 7.41722 16.8094 7.26267 17.0632 7.15721C17.317 7.05175 17.5892 6.99746 17.864 6.99746C18.1388 6.99746 18.411 7.05175 18.6648 7.15721C18.9186 7.26267 19.1491 7.41722 19.343 7.612Z"
                stroke="white"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </template>
          {{ loading ? 'Saving...' : 'Save' }}
        </BaseButton>
      </div>
    </dialog>
  </Teleport>
</template>


<script setup>
  import { ref, defineEmits, watch } from 'vue'

  const props = defineProps({
    title: {
      type: String,
      default: '',
    },
    show: { type: Boolean, default: false },
    loading: { type: Boolean, default: false },
  })

  const emit = defineEmits(['save', 'update:show', 'close'])
  const modal = ref(null)

  watch(
    () => props.show,
    (val) => {
      if (val) modal.value?.showModal()
      else if (modal.value?.open) modal.value.close()
    }
  )

  function handleSave() {
    emit('save')
  }
</script>
