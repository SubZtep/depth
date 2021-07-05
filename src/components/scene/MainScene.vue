<template lang="pug">
Help()
PoseGroup(@loaded="loaded")
</template>

<script lang="ts" setup>
import { inject } from "vue"
import { useNProgress } from "@vueuse/integrations/useNProgress"

const gui = inject<dat.GUI>("gui")!
const toggleRun = inject("toggleRun") as () => boolean

const loaded = () => {
  useNProgress().done()
  gui.show()
  toggleRun()
}
</script>
