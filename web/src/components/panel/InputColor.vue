<template lang="pug">
.flex.gap-1
  //- .flex-2
  .w-8
    input.w-full(type="color" v-model="state.modelValue")
  .flex-grow-1
    input.w-full(type="text" v-model="state.modelValue")
</template>

<script lang="ts" setup>
const props = defineProps<{
  modelValue: string
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
