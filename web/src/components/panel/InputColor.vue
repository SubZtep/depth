<template lang="pug">
.flex.gap-1.w-full
  .flex-1
    input.w-full(type="color" v-model="state.modelValue")
  .flex-1(v-if="props.hover")
    input.w-full(type="text" v-model="state.modelValue")
</template>

<script lang="ts" setup>
const props = defineProps<{
  modelValue: string
  hover?: boolean
}>()

const emit = defineEmits<{
  (e: "update:modelValue", modelValue: string): void
}>()

const state = reactive({
  modelValue: props.modelValue,
})

watchEffect(() => {
  emit("update:modelValue", state.modelValue)
})
</script>
