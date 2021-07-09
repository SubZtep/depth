<template lang="pug">
Help
component(:is="page")
</template>

<script lang="ts" setup>
import { inject, onMounted } from "vue"
// import { useNProgress } from "@vueuse/integrations/useNProgress"
// import { useActiveRoute } from "../../plugins/router"
import { useActiveRoute } from "../../packages/router/plugin"
import { useGui } from "../../packages/datGUI/plugin"

// const gui = useGui()
// const toggleRun = inject<IsFn>("toggleRun")!
useGui().show()
const page = useActiveRoute()

onMounted(() => {
//   // useNProgress().done()
//   // toggleRun()
})
</script>
