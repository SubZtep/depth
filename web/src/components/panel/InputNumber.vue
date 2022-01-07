<template lang="pug">
.flex.gap-1
  .flex-1
    input.w-full.filter(type="text" v-model.number="modelValue" :class="{ 'invert': props.hover === false }")
  .flex-grow(v-if="props.hover !== false")
    input.w-full.filter(type="range" :min="props.min" :max="props.max" :step="props.step" v-model.number="modelValue")
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

const modelValue = ref(props.modelValue)
watch(modelValue, v => emit("update:modelValue", v))
</script>
