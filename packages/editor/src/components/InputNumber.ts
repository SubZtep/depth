import { defineComponent } from "vue"

export default defineComponent({
  props: {
    modelValue: { type: Number, required: true },
    min: { type: Number, required: false },
    max: { type: Number, required: false },
    step: { type: Number, required: false },
  },
  setup(props, { slots }) {
    return () => slots.default?.()
  },
})
// <!-- <template lang="pug">
// .flex.gap-1(@mouseover="hover = true" @mouseleave="hover = false")
//   .flex-1
//     input.w-full.filter(type="text" v-model.number="model" :class="{ 'invert': !hover }")
//   .flex-grow(v-if="hover")
//     input.w-full.filter(type="range" v-model.number="model" v-bind="rangeProps")
// </template>

// <script lang="ts" setup>
// const props = defineProps<{
//   modelValue: number
//   min?: number
//   max?: number
//   step?: number
// }>()

// const emit = defineEmits<{
//   (e: "update:modelValue", modelValue: number): void
// }>()

// const hover = ref(false)
// const model = ref(props.modelValue)
// const min = props.min ?? -10
// const max = props.max ?? 10
// const step = props.step ?? 0.01

// const rangeProps = { min, max, step }

// watch(model, v => emit("update:modelValue", v))
// </script> -->
