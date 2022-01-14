<template lang="pug">
.panelInput.flex
  .flex-1
    | X:
    input.w-8.ml-1.filter(type="text" v-model.number="state.modelValue[0]" :class="{ 'invert': !hover }")
    br
    input.w-full(type="range" :min="state.min" :max="state.max" :step="props.step" v-model.number="state.modelValue[0]" v-if="hover")
  .flex-1
    | Y:
    input.w-8.ml-1.filter(type="text" v-model.number="state.modelValue[1]" :class="{ 'invert': !hover }")
    br
    input.w-full(type="range" :min="state.min" :max="state.max" :step="props.step" v-model.number="state.modelValue[1]" v-if="hover")
  .flex-1
    | Z:
    input.w-8.ml-1.filter(type="text" v-model.number="state.modelValue[2]" :class="{ 'invert': !hover }")
    br
    input.w-full(type="range" :min="state.min" :max="state.max" :step="props.step" v-model.number="state.modelValue[2]" v-if="hover")
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

const hover = inject<Ref<boolean>>("hover")

const state = reactive({
  modelValue: props.modelValue,
  min: props.min ?? -10,
  max: props.max ?? 10,
})

watchEffect(() => {
  emit("update:modelValue", state.modelValue)
})
</script>
