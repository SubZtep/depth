<template lang="pug">
Teleport(to="#panel")
  .bg-black.border-red-500.text-green-300
    h3.text-center {{props.title}}
    slot
</template>

<script lang="ts" setup>
const props = defineProps<{
  title: string
}>()
</script>
