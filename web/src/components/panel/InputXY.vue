<template lang="pug">
.flex
  .flex-1
    | {{props.labels?.[0] ?? "X"}}:
    input.w-8.ml-1.filter(type="text" v-model.number="state.modelValue[0]" :class="{ 'invert': props.hover === false }")
    br
    input.w-full(type="range" :min="props.min ?? 1" :max="props.max ?? 10" :step="props.step" v-model.number="state.modelValue[0]" v-if="props.hover !== false")
  .flex-1
    | {{props.labels?.[1] ?? "Y"}}:
    input.w-8.ml-1.filter(type="text" v-model.number="state.modelValue[1]" :class="{ 'invert': props.hover === false}")
    br
    input.w-full(type="range" :min="props.min ?? 1" :max="props.max ?? 10" :step="props.step" v-model.number="state.modelValue[1]" v-if="props.hover !== false")
</template>

<script lang="ts" setup>
const props = defineProps<{
  modelValue: [number, number]
  labels?: [string, string]
  min?: number
  max?: number
  step?: number
  hover?: boolean
}>()

const emit = defineEmits<{
  (e: "update:modelValue", modelValue: [number, number]): void
}>()

const state = reactive({
  modelValue: props.modelValue,
})

watchEffect(() => {
  emit("update:modelValue", state.modelValue)
})
</script>
