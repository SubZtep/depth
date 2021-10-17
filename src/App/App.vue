<template lang="pug">
SystemCheck(v-if="hold || !ready" @done="stop")

Suspense(v-else)
  template(#default)
    ThreeCanvas
  template(#fallback)
    LoadingScreen
</template>

<script lang="ts" setup>
const hold = ref(true)
const { ready, start, stop } = useTimeout(5000, { controls: true, immediate: false })

if (process.env.NODE_ENV === "production") {
  start()
}
set(hold, false)

useNProgress().start()
</script>
