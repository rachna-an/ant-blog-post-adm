<template>
  <div>
    <legend class="fieldset-legend">{{ label }}</legend>
    <label class="input" :class="{ 'border-error focus:!border-error focus-within:!border-error': errorMsg }">
      <!-- slot for icon -->
      <slot></slot>
      <input
        :type="type"
        :placeholder="placeholder"
        :value="modelValue"
        @input="$emit('update:modelValue', $event.target.value)"
        @blur="$emit('blur')"
        :required="required"
        :readonly="readonly"
        :disabled="disabled"
      />
    </label>
    <div v-if="errorMsg" class="text-error pt-2">{{ errorMsg }}</div>
  </div>
</template>

<script setup>
  defineProps({
    modelValue: String,
    label: {
      type: String,
      default: 'Label',
    },
    type: {
      type: String,
      default: 'text',
    },
    placeholder: {
      type: String,
      default: '',
    },
    required: {
      type: Boolean,
      default: false,
    },
    readonly: {
      type: Boolean,
      default: false,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    errorMsg: {
      type: String,
      default: '',
    },
  })
  defineEmits(['update:modelValue', 'blur'])
</script>

