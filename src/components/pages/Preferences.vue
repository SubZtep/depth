<template lang="pug">
Title Preferences
pre STATE {{state}}
</template>

<script lang="ts" setup>
import { onBeforeUnmount } from "@vue/runtime-core"
import { useGui } from "../../packages/datGUI/plugin"
import { get, set, useFullscreen, useCssVar, toRefs } from "@vueuse/core"
import { useGlobalState } from "../../store"

const state = useGlobalState()
const { guiScale } = toRefs(state)

const gui = useGui()
const { toggle } = useFullscreen()
const pref = {
  guiScale: get(guiScale),
  toggle,
}

const folder = gui.addFolder("Preferences")
folder
  .add(pref, "guiScale", 0.5, 3.5, 0.1)
  .name("GUI scale pc.")
  .onFinishChange(v => set(guiScale, v))
folder.add(pref, "toggle").name("Toggle fullscreen")
folder.open()

onBeforeUnmount(() => {
  gui.removeFolder(folder)
})
</script>
