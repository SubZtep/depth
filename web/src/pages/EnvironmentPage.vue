<template lang="pug">
Title move for environment
i.text-2xl.fa-duotone.fa-cat-space.m-2.opacity-69

Debug.text-xl
  i.fa-duotone.fa-bug
  | 🐌
</template>

<script lang="ts" setup>
import { useFullscreen, useMemory, useWakeLock } from "@vueuse/core"
import { useEnvironmentStore } from "~/stores/environment"
import { usePreferencesStore } from "~/stores/preferences"

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
  folder.add(environment, "distance", 1, 1_000)
})

addGuiFolder(folder => {
  folder.name = "⚙ Preferences"
  folder.add(preferences, "showDebug").name("Show debug")
  folder
    .add({ fullscreen: false }, "fullscreen")
    .name("Go Fullscreen")
    .onChange(async v => {
      await fullscreen.toggle()
      await (v ? wakeLock.request("screen") : wakeLock.release())
    })
})
</script>
