<template lang="pug">
.flex.gap-1
  .flex-1
    input.w-full.filter(type="text" v-model.number="state.modelValue" :class="{ 'invert': !props.hover }")
  .flex-grow(v-if="props.hover")
    input.w-full.filter(type="range" :min="props.min" :max="props.max" :step="props.step" v-model.number="state.modelValue" v-visible="props.hover")
</template>

<script lang="ts" setup>
const props = defineProps<{
  modelValue: number
  min?: number
  max?: number
  step?: number
  hover?: boolean
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
