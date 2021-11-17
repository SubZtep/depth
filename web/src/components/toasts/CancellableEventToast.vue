<template lang="pug">
div
  p {{props.message}}
  button.btn.bg-blue-600.px-3(@click="cancel(); $emit('close-toast')") Cancel
</template>

<script lang="ts" setup>
const props = defineProps<{ message: string; event: Fn }>()

// eslint-disable-next-line vue/no-setup-props-destructure
let mayEvent = props.event

/* eslint-disable */
const cancel = () => {
  mayEvent = () => {}
}
/* eslint-enable */

onBeforeUnmount(() => {
  mayEvent.call(null)
})
</script>
