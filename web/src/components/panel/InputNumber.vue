<template lang="pug">
.flex.gap-1(@mouseover="hover = true" @mouseleave="hover = false")
  .flex-1
    input.w-full.filter(type="text" v-model.number="model" :class="{ 'invert': !hover }")
  .flex-grow(v-if="hover")
    input.w-full.filter(type="range" v-model.number="model" v-bind="rangeProps")
    //- input.w-full.filter(type="range" :value="prop" @input="v => emit('update:modelValue', v)" v-bind="rangeProps")
    //- input.w-full.filter(type="range" :value="prop" @input="emit('update:modelValue', Number($event.target!.value))" v-bind="rangeProps")
</template>

<script lang="ts" setup>
const props = defineProps<{
  modelValue: number
  min?: number
  max?: number
  step?: number
}>()

const model = ref(props.modelValue)

const emit = defineEmits<{
  (e: "update:modelValue", modelValue: number): void
}>()

// const hover = inject<Ref<boolean>>("hover")
const hover = ref(false)

const min = props.min ?? -10
const max = props.max ?? 10
const step = props.step ?? 0.01

const rangeProps = { min, max, step }

// const modelValue = ref(props.modelValue)

watch(model, v => emit("update:modelValue", v))
// watch(prop, v => console.log("update:modelValue", v))
</script>
