<template lang="pug">
Suspense
  template(#default)
    ThreeCanvas
  template(#fallback)
    .loadingScreen
</template>

<script lang="ts" setup>
import { useNProgress } from "@vueuse/integrations/useNProgress"
import { onErrorCaptured } from "vue"
import { useToast } from "vue-toastification"
useNProgress().start()

const toast = useToast()
onErrorCaptured(e => {
  toast.info(e.message)
  return false
})
</script>
