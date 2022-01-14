<template lang="pug">
.flex.gap-1
  .flex-1
    input.w-full.filter(type="text" v-model.number="modelValue" :class="{ 'invert': !hover }")
  .flex-grow(v-if="hover")
    input.w-full.filter(type="range" :min="props.min" :max="props.max" :step="props.step" v-model.number="modelValue")
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

const hover = inject<Ref<boolean>>("hover")

const modelValue = ref(props.modelValue)

watch(modelValue, v => emit("update:modelValue", v))
</script>
