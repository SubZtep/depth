<template lang="pug">
Suspense
  template(#default)
    ThreeCanvas
  template(#fallback)
    LoadingScreen
</template>

<script lang="ts" setup>
// import { onVisibility } from "../events"
import useSystemRequirements from "~/composables/useSystemRequirements"
const toast = useToast()
const { errors, warnings } = useSystemRequirements()

for (const message of errors) {
  toast.error(message)
}
for (const message of warnings) {
  toast.warning(message)
}

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
