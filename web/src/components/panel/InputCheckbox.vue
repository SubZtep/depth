<template lang="pug">
input.mt-1(type="checkbox" v-model="state.modelValue")
</template>

<script lang="ts" setup>
const props = defineProps<{
  modelValue: boolean
}>()

const emit = defineEmits<{
  (e: "update:modelValue", modelValue: boolean): void
}>()

const state = reactive({
  modelValue: props.modelValue,
})

watchEffect(() => {
  emit("update:modelValue", state.modelValue)
})
</script>
