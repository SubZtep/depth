<template lang="pug">
.flex
  .flex-1
    | {{props.labels?.[0] ?? "X"}}:
    input.w-8.filter(type="text" v-model.number="state.modelValue[0]" :class="{ 'invert': !props.hover }")
    br
    input.w-full(type="range" min="1" max="10" v-model.number="state.modelValue[0]" v-if="props.hover")
  .flex-1
    | {{props.labels?.[1] ?? "Y"}}:
    input.w-8.filter(type="text" v-model.number="state.modelValue[1]" :class="{ 'invert': !props.hover }")
    br
    input.w-full(type="range" min="1" max="10" v-model.number="state.modelValue[1]" v-if="props.hover")
</template>

<script lang="ts" setup>
const props = defineProps<{
  modelValue: [number, number]
  labels?: [string, string]
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
