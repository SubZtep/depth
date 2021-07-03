<template lang="pug">
//- Help()
PoseGroup(@loaded="loaded")
</template>

<script lang="ts" setup>
import { inject } from "vue"
import { useNProgress } from "@vueuse/integrations/useNProgress"
import { toggleRun } from "../../composables/useThreeJs"

const gui = inject<dat.GUI>("gui")!

const loaded = () => {
  useNProgress().done()
  gui.show()
  toggleRun()
}
</script>
