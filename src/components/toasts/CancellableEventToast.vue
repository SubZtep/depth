<template lang="pug">
div
  p {{props.message}}
  button.btn.bg-blue-600.px-3(@click="cancel(); $emit('close-toast')") Cancel
</template>

<script lang="ts" setup>
const props = defineProps<{
  message: string
  event: Fn
}>()

let mayEvent = props.event

const cancel = () => {
  mayEvent = () => {}
}

onBeforeUnmount(() => {
  mayEvent.call(null)
})
</script>
