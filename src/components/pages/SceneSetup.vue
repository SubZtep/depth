<template lang="pug">
</template>

<script lang="ts" setup>
import { onBeforeUnmount } from "@vue/runtime-core"
import { useGui } from "../../packages/datGUI/plugin"

const gui = useGui()
const folder = gui.addFolder("Light setup")

onBeforeUnmount(() => {
  gui.removeFolder(folder)
})

</script>
