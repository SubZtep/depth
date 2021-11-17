<template lang="pug">
div
  p {{properties.message}}
  button.btn.bg-blue-600.px-3(@click="cancel(); $emit('close-toast')") Cancel
</template>

<script lang="ts" setup>
const properties = defineProps<{ message: string; event: Fn }>()

// eslint-disable-next-line vue/no-setup-props-destructure
let mayEvent = properties.event

const cancel = () => {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  mayEvent = () => {}
}

onBeforeUnmount(() => {
  mayEvent()
})
</script>
