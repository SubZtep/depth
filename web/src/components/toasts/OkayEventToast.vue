<template lang="pug">
.p-8.bg-blue-gray-800.text-warm-gray-200.text-center.text-lg.font-serif
  p.mb-4 {{properties.message}}
  button.btn.bg-amber-900.text-amer-100.px-4.font-mono.leading-6(@click="$emit('okay')") Okay
</template>

<script lang="ts" setup>
const properties = defineProps<{ message: string }>()
</script>
