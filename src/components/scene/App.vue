<template lang="pug">
Suspense
  template(#default)
    ThreeCanvas
  template(#fallback)
    .loadingScreen
</template>

<script lang="ts" setup>
import { useNProgress } from "@vueuse/integrations/useNProgress"
useNProgress().start()
</script>

<style lang="postcss">
.loadingScreen {
  padding: 25px;
  text-align: right;
  font: bold 2.5rem Merriweather;
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
