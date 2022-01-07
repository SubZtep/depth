<template lang="pug">
.flex.gap-1.w-full
  .flex-1
    input.w-full(type="color" v-model="modelValue")
  .flex-1(v-if="props.hover !== false")
    input.w-full(type="text" v-model="modelValue")
</template>

<script lang="ts" setup>
const props = defineProps<{
  modelValue: string
  hover?: boolean
}>()

const emit = defineEmits<{
  (e: "update:modelValue", modelValue: string): void
}>()

const modelValue = ref(props.modelValue)
watch(modelValue, v => emit("update:modelValue", v))
</script>
