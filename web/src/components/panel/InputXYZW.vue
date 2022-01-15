<template lang="pug">

//- .text-white(v-for="x in ['X', 'Y', 'Z', 'W']" :key="x") {{x}}

.panelInput.flex
  .flex-1
    | X:
    input.w-8.ml-1.filter(type="text" v-model.number="prop[0]" v-bind="rangeProps" :class="{ 'invert': !hover }")
    br
    input.w-full(v-if="hover" type="range" v-model.number="prop[0]" v-bind="rangeProps")
  .flex-1
    | Y:
    input.w-8.ml-1.filter(type="text" v-model.number="prop[1]" :class="{ 'invert': !hover }")
    br
    input.w-full(type="range" :min="state.min" :max="state.max" :step="props.step" v-model.number="prop[1]" v-if="hover")
  .flex-1
    | Z:
    input.w-8.ml-1.filter(type="text" v-model.number="prop[2]" :class="{ 'invert': !hover }")
    br
    input.w-full(type="range" :min="state.min" :max="state.max" :step="props.step" v-model.number="prop[2]" v-if="hover")
  .flex-1
    | W:
    input.w-8.ml-1.filter(type="text" v-model.number="prop[2]" :class="{ 'invert': !hover }")
    br
    input.w-full(type="range" :min="state.min" :max="state.max" :step="props.step" v-model.number="prop[2]" v-if="hover")
</template>

<script lang="ts" setup>
const props = defineProps<{
  modelValue: [number, number, number, number]
  min?: number
  max?: number
  step?: number
}>()
const prop = toRef(props, "modelValue")
const emit = defineEmits<{
  (e: "update:modelValue", modelValue: [number, number, number, number]): void
}>()

const hover = inject<Ref<boolean>>("hover")

const min = props.min ?? -10
const max = props.max ?? 10
const step = props.step ?? 0.01

const state = reactive({
  modelValue: props.modelValue,
  min: props.min ?? -10,
  max: props.max ?? 10,
})

const rangeProps = { min, max, step}


watch(prop, v => emit("update:modelValue", v))
</script>
