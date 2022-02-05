<template lang="pug">
.bg-white.text-black.p-4
  h2 Hierarchy

</template>

<script lang="ts" setup>
console.log("qw")
const props = defineProps<{
  title: string
  position?: [number, number, number]
  scale?: number
  open?: boolean
}>()
</script>
