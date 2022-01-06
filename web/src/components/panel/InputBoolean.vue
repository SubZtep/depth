<template lang="pug">
input.mt-1(type="checkbox" v-model="modelValue")
</template>

<script lang="ts" setup>
const props = defineProps<{
  modelValue: boolean
}>()

const emit = defineEmits<{
  (e: "update:modelValue", modelValue: boolean): void
}>()

const modelValue = ref(props.modelValue)

watch(modelValue, v => emit("update:modelValue", v))
</script>
