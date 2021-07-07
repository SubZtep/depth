<template lang="pug">
Help
component(:is="page")
</template>

<script lang="ts" setup>
import { inject, onMounted } from "vue"
import { useNProgress } from "@vueuse/integrations/useNProgress"
import { useRoutedComponent } from "../../plugins/router"
import { useGui } from "../../plugins/datGUI"

const gui = useGui()
const toggleRun = inject<() => boolean>("toggleRun")!
const page = useRoutedComponent()

onMounted(() => {
  useNProgress().done()
  gui.show()
  toggleRun()
})
</script>
