<template lang="pug">
.flex
  .flex-1
    | {{props.labels?.[0] ?? "X"}}:
    input.w-8(type="text" v-model.number="state.modelValue[0]")
    br
    input.w-full(type="range" min="1" max="10" v-model.number="state.modelValue[0]")
  .flex-1
    | {{props.labels?.[1] ?? "Y"}}:
    input.w-8(type="text" v-model.number="state.modelValue[1]")
    br
    input.w-full(type="range" min="1" max="10" v-model.number="state.modelValue[1]")
</template>

<script lang="ts" setup>
const props = defineProps<{
  modelValue: [number, number]
  labels?: [string, string]
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
