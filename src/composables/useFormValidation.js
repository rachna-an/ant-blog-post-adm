import { reactive, computed } from 'vue'

// --- Helper Functions ---
const normalizeValue = (value) => {
  if (value === null || value instanceof File) return value
  if (typeof value === 'string') return value.trim()
  return value ?? ''
}

export function useFormValidation(schema, initialFormData = {}) {
  // --- Field Names & Schemas ---
  const fieldNames = Object.keys(initialFormData).length
    ? Object.keys(initialFormData)
    : Object.keys(schema.shape || {})

  const fieldSchemas = Object.fromEntries(fieldNames.map((f) => [f, schema.pick({ [f]: true })]))

  // --- Reactive State ---
  const vErrors = reactive(fieldNames.reduce((acc, f) => ({ ...acc, [f]: '' }), {}))
  const validationState = reactive({
    blurredOnce: fieldNames.reduce((acc, f) => ({ ...acc, [f]: false }), {}),
    isSubmitAttempted: false,
  })
  const initialValues = reactive({ ...initialFormData })
  const modifiedFields = reactive({})

  // --- Field Change Tracking ---
  const markFieldChange = (fieldName, newValue) => {
    const normalizedNew = normalizeValue(newValue)
    const normalizedOld = normalizeValue(initialValues[fieldName])
    if (normalizedNew !== normalizedOld) {
      modifiedFields[fieldName] = normalizedNew
    } else {
      delete modifiedFields[fieldName]
    }
  }

  // --- Validation Logic ---
  const validateField = (fieldName, value) => {
    const result = fieldSchemas[fieldName].safeParse({
      [fieldName]: normalizeValue(value),
    })

    markFieldChange(fieldName, value)

    if (result.success) {
      vErrors[fieldName] = ''
      return true
    } else {
      vErrors[fieldName] = result.error.issues?.[0]?.message || 'Invalid value'
      return false
    }
  }

  const onBlur = (fieldName, value) => {
    markFieldChange(fieldName, value)
    const normalized = normalizeValue(value)
    validationState.blurredOnce[fieldName] = true

    if (normalized !== '') {
      return validateField(fieldName, value)
    }
    vErrors[fieldName] = ''
    return true
  }

  const onInput = (fieldName, value) => {
    markFieldChange(fieldName, value)
    const normalized = normalizeValue(value)

    if (validationState.blurredOnce[fieldName] && vErrors[fieldName] && normalized !== '') {
      return validateField(fieldName, value)
    }

    // Clear error if field becomes empty
    if (normalized === '') {
      vErrors[fieldName] = ''
    }
    return true
  }

  const validateForm = (formData) => {
    validationState.isSubmitAttempted = true
    const result = schema.safeParse(formData)

    // Track all field changes
    fieldNames.forEach((f) => markFieldChange(f, formData[f]))

    if (result.success) {
      Object.keys(vErrors).forEach((f) => (vErrors[f] = ''))
      return true
    }

    Object.keys(vErrors).forEach((f) => (vErrors[f] = ''))
    result.error.issues.forEach((err) => {
      const field = err.path[0]
      if (field in vErrors) {
        vErrors[field] = err.message
        validationState.blurredOnce[field] = true
      }
    })

    return false
  }

  const resetValidation = () => {
    Object.keys(vErrors).forEach((f) => (vErrors[f] = ''))
    Object.keys(validationState.blurredOnce).forEach(
      (f) => (validationState.blurredOnce[f] = false),
    )
    validationState.isSubmitAttempted = false
    Object.keys(modifiedFields).forEach((f) => delete modifiedFields[f])
  }

  const isFormValid = computed(() => Object.values(vErrors).every((msg) => !msg))

  return {
    vErrors,
    validationState,
    isFormValid,
    modifiedFields,

    validateField,
    onInput,
    onBlur,
    validateForm,
    resetValidation,
  }
}
