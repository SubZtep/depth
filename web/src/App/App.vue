<template lang="pug">
Suspense
  template(#default)
    ThreeCanvas
  template(#fallback)
    LoadingScreen
</template>

<script lang="ts" setup>
import ThreeCanvas from "~/App/ThreeCanvas.vue"
import LoadingScreen from "~/App/LoadingScreen.vue"
// import { onVisibility } from "../events"

// onVisibility(({ visible, since }) => {
//   if (visible) {
//     // show more than 30 secs
//     if (Date.now() - since.getTime() > 30_000) {
//       const ago = useTimeAgo(since, { updateInterval: 0 })
//       toast.info(`Hello, since ${ago.value}.`, { id: "hello" })
//     }
//   }
// })
</script>
