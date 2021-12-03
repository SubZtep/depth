<template lang="pug">
Title move for environment
i.text-3xl.fa-duotone.fa-cat-space.m-2.opacity-69
</template>

<script lang="ts" setup>
import { addGuiFolder } from "@depth/hud"
import { useFullscreen, useWakeLock } from "@vueuse/core"
import { useEnvironmentStore } from "../stores/environment"
import { usePreferencesStore } from "../stores/preferences"

const environment = useEnvironmentStore()
const preferences = usePreferencesStore()
const fullscreen = useFullscreen()
const wakeLock = useWakeLock()

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
  folder
    .add(preferences, "showDebug")
    .name("Show debug")
    .onChange(v => {
      // document.querySelector(".Stats")?.classList.toggle("!hidden", !v)
      // document.querySelector("#scene")?.classList.toggle("paused", v)
    })
  // folder
  // .add({ guiScale: preferences.guiScale }, "guiScale", 0.5, 3, 0.1)
  // .name("GUI scale")
  // .onFinishChange(scale => (preferences.guiScale = String(scale)))
  folder
    .add({ fullscreen: false }, "fullscreen")
    .name("Go Fullscreen")
    .onChange(async v => {
      await fullscreen.toggle()
      await (v ? wakeLock.request("screen") : wakeLock.release())
    })
})
</script>
