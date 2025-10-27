<template>
  <button
    class="btn btn-primary"
    type="button"
    :disabled="disabled || loading"
    @click="handleClick"
  >
    <span v-if="loading" class="flex items-start gap-2">
      <span class="loading loading-spinner loading-sm opacity-75"></span>
      <slot>Loading...</slot>
    </span>
    <template v-else>
      <slot name="icon"></slot>
      <slot></slot>
    </template>
  </button>
</template>

<script setup>
  const props = defineProps({
    disabled: {
      type: Boolean,
      default: false,
    },
    loading: {
      type: Boolean,
      default: false,
    },
  })

  const emit = defineEmits(['click'])
  const handleClick = (event) => {
    if (!props.loading && !props.disabled) {
      emit('click', event)
    }
  }
</script>

