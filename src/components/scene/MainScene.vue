<template lang="pug">
Help
component(:is="pageComponent")
</template>

<script lang="ts" setup>
import type { EventHook } from "@vueuse/core"
import { inject, onMounted, ref} from "vue"
import { useNProgress } from "@vueuse/integrations/useNProgress"
import { set } from "@vueuse/core"

const gui = inject<dat.GUI>("gui")!
const toggleRun = inject<() => boolean>("toggleRun")!
const routerHook = inject<EventHook<RouterEvent>>("routerHook")!

const pageComponent = ref()
routerHook.on(({ component }) => set(pageComponent, component))

onMounted(() => {
  useNProgress().done()
  gui.show()
  toggleRun()
})
</script>
