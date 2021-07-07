<template lang="pug">
Help
component(v-if="pageComponent === 'EstimateFrames'" :is="EstimateFrames")
component(v-else-if="pageComponent === 'PoseGroup'" :is="PoseGroup")
component(v-else-if="pageComponent === 'RecordVideo'" :is="RecordVideo")
</template>

<script lang="ts" setup>
import type { EventHook } from "@vueuse/core"
import { get, set } from "@vueuse/core"
import { inject, onMounted, ref, useAttrs, useContext, watch } from "vue"
import { useNProgress } from "@vueuse/integrations/useNProgress"
import EstimateFrames from "../pages/EstimateFrames.vue"
import PoseGroup from "../pages/PoseGroup.vue"
import RecordVideo from "../pages/RecordVideo.vue"

const gui = inject<dat.GUI>("gui")!
const toggleRun = inject("toggleRun") as () => boolean

const pageComponent = ref<string>()
const routerHook = inject<EventHook<RouterEvent>>("routerHook")!

routerHook.on(({ component }) => set(pageComponent, component))

onMounted(() => {
  // if (get(pageComponent) === undefined) {
  //   // console.log("OK GO FOR IT", gui.__folders["Go places"].__controllers[0])
  //   // routerHook.trigger({ ...(inject<() => Route>("routeByPath")!()), enableTransition: true })
  // }
  useNProgress().done()
  gui.show()
  toggleRun()
})
</script>
