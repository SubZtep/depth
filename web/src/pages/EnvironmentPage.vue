<template lang="pug">
Title move for environment
//- h1 LOLOLOL
</template>

<script lang="ts" setup>
import { addGuiFolder } from "@depth/hud"
import { useFullscreen } from "@vueuse/core"
import { useEnvironmentStore } from "../stores/environment"
import { usePreferencesStore } from "../stores/preferences"
// import { useInfiniteGrid, useSkybox } from "@depth/world"
// import { useThreeJSEventHook } from "@depth/three.js"

// const threeJs = useThreeJSEventHook()
// threeJs.trigger({ cmd: "RenderFrames", param: "All" })
const environment = useEnvironmentStore()
const preferences = usePreferencesStore()

addGuiFolder(folder => {
  folder.name = "⚙ Skybox"
  folder.add(environment, "skybox", 1, 15, 1)
})

addGuiFolder(folder => {
  folder.name = "⚙ Grid"
  folder.add(environment, "size", 1, 15, 1)
  folder.addColor(environment, "color")
  folder.add(environment, "distance", 1, 9_000, 10)
})

addGuiFolder(folder => {
  folder.name = "⚙ Preferences"
  folder.add(preferences, "showDebug").name("Show debug").onChange(v => {
    document.querySelector("#scene")?.classList.toggle("paused", v)
  })
    // folder
    // .add({ guiScale: preferences.guiScale }, "guiScale", 0.5, 3, 0.1)
    // .name("GUI scale")
    // .onFinishChange(scale => (preferences.guiScale = String(scale)))
  folder
    .add({ fullscreen: false }, "fullscreen")
    .name("Go Fullscreen")
    .onChange(async v => {
      await useFullscreen()[v ? "enter" : "exit"]()
    })
})
</script>
