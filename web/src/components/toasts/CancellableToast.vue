<template lang="pug">
div
  p {{props.message}}
  button.btn.bg-blue-600.px-3(@click="$emit('cancel')") Cancel
</template>

<script lang="ts" setup>
const props = defineProps<{ message: string }>()
</script>
