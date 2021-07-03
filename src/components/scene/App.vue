<template lang="pug">
Suspense
  template(#default)
    ThreeCanvas
  template(#fallback)
    .loadingScreen
</template>

<script lang="ts" setup>
import { useNProgress } from "@vueuse/integrations/useNProgress"
import { onErrorCaptured, provide } from "vue"
import { useToast } from "vue-toastification"
import { createEventHook } from "@vueuse/core"
import { useThreeJs } from "../../composables/useThreeJs"
useNProgress().start()

const threeCtrlHook = createEventHook<ThreeCtrlEvent>()

useThreeJs(threeCtrlHook)

provide("threeCtrlHook", threeCtrlHook)

const toast = useToast()
onErrorCaptured(e => {
  console.log("EEE", e.message)
  toast.error(e.message)
  return false
})
</script>
