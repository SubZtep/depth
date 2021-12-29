<template lang="pug">
.flex
  .flex-1
    | X:
    input.w-8(type="text" v-model.number="state.modelValue[0]")
    br
    input.w-full(type="range" :min="state.min" :max="state.max" :step="props.step" v-model.number="state.modelValue[0]")
  .flex-1
    | Y:
    input.w-8(type="text" v-model.number="state.modelValue[1]")
    br
    input.w-full(type="range" :min="state.min" :max="state.max" :step="props.step" v-model.number="state.modelValue[1]")
  .flex-1
    | Z:
    input.w-8(type="text" v-model.number="state.modelValue[2]")
    br
    input.w-full(type="range" :min="state.min" :max="state.max" :step="props.step" v-model.number="state.modelValue[2]")
</template>

<script lang="ts" setup>
const props = defineProps<{
  modelValue: [number, number, number]
  min?: number
  max?: number
  step?: number
}>()

const emit = defineEmits<{
  (e: "update:modelValue", modelValue: [number, number, number]): void
}>()

const state = reactive({
  modelValue: props.modelValue,
  min: props.min ?? -10,
  max: props.max ?? 10,
})

watchEffect(() => {
  emit("update:modelValue", state.modelValue)
})
</script>
