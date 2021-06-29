<template lang="pug">
//- h3 qq {{inputs}}
//- .grid
  template(v-for="opts of inputs" :key="opts.id")
    VideoInput(v-if="'src' in opts" :opts="opts")
    MediaInput(v-else :opts="opts")

Suspense
  template(#default)
    ThreeCanvas
  template(#fallback)
    .loadingScreen

//- VideoPlayer2D(src="happy.webm")
</template>

<script lang="ts" setup>
// import { reactive, provide } from "vue"
// import { get, set, createEventHook } from "@vueuse/core"
import { useNProgress } from "@vueuse/integrations/useNProgress"
// import { useThreeJs } from "../composables/useThreeJs"
// import { useDatGui } from "../composables/useDatGui"
import { onErrorCaptured } from "vue"
import ThreeCanvas from "./ThreeCanvas.vue"
import { useToast } from "vue-toastification"
const { start, done } = useNProgress()
start()

// const threeCtrlHook = createEventHook<ThreeCtrlEvent>()
// provide("threeCtrlHook", threeCtrlHook)

// const { guiEvent } = useDatGui()
// const inputs = reactive(new Set<InputGroup>())
// guiEvent.on(({ cmd, group }) => void get(inputs)[cmd](group))

// useThreeJs(threeCtrlHook)

onErrorCaptured(e => {
  const toast = useToast()
  toast.info("AMYAR")
  // this.$toast.error(`Hey! I'm here`);

  // @ts-ignore
  toast.error(e.message)
  // alert()

  // return true
})
</script>
