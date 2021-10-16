<template lang="pug">
SystemCheck(v-if="hold || !ready" @done="stop")

Suspense(v-else)
  template(#default)
    ThreeCanvas
  template(#fallback)
    .loadingScreen
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

<style lang="postcss">
.loadingScreen {
  padding: 25px;
  text-align: right;
  font: bold 2.5rem "Comic Sans MS";
  text-shadow: 1px 1px 1px #fff;
  letter-spacing: 0.3rem;
  line-break: anywhere;
  justify-content: center;
  align-items: center;
  display: flex;
  cursor: none;
  &::after {
    opacity: 0.9;
    content: "loading stuff + waking ai";
  }
  &:active {
    &::after {
      content: "loadig stuff + wanking ai";
    }
  }
}
</style>
