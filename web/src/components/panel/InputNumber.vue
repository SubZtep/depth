<template lang="pug">
.flex.gap-1
  .flex-2
    input.w-full(type="range" :min="props.min" :max="props.max" :step="props.step" v-model.number="state.modelValue")
  .flex-1
    input.w-full(type="text" v-model.number="state.modelValue")
</template>

<script lang="ts" setup>
const props = defineProps<{
  modelValue: number
  min?: number
  max?: number
  step?: number
}>()

const emit = defineEmits<{
  (e: "update:modelValue", modelValue: number): void
}>()

const state = reactive({
  modelValue: props.modelValue,
  // min: props.min ?? -10,
  // max: props.max ?? 10,
  // step: props.step ?? 1,
})

watchEffect(() => {
  emit("update:modelValue", state.modelValue)
})
</script>
