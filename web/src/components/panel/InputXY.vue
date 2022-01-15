<template lang="pug">
.flex
  .flex-1
    | {{props.labels?.[0] ?? "X"}}:
    input.w-8.ml-1.filter(type="text" v-model.number="prop[0]" :class="{ 'invert': !hover }")
    br
    input.w-full( v-if="hover" type="range" :min="props.min" :max="props.max" :step="props.step" v-model.number="prop[0]")
  .flex-1
    | {{props.labels?.[1] ?? "Y"}}:
    input.w-8.ml-1.filter(type="text" v-model.number="prop[1]" :class="{ 'invert': !hover}")
    br
    input.w-full( v-if="hover" type="range" :min="props.min" :max="props.max" :step="props.step" v-model.number="prop[1]")
</template>

<script lang="ts" setup>
const props = defineProps<{
  modelValue: [number, number]
  labels?: [string, string]
  min?: number
  max?: number
  step?: number
}>()
const prop = toRef(props, "modelValue")

const emit = defineEmits<{
  (e: "update:modelValue", modelValue: [number, number]): void
}>()

const hover = inject<Ref<boolean>>("hover")

// const state = reactive({
//   modelValue: props.modelValue,
// })
watch(prop, v => emit("update:modelValue", v))
</script>
