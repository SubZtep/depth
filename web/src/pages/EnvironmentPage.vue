<template lang="pug">
Title move for environment
i.text-2xl.fa-duotone.fa-cat-space.m-2.opacity-69

VoxelWorld(:cell-size="48" :cell-height="4" :position="[-24, -4.01, -45]")

ImagePlane(url="textures/no-video.png" :position="[-7, 0.001, -5]" :width="16" :height="16")

Debug.text-xl
  i.fa-duotone.fa-bug
  | 🐌
</template>

<script lang="ts" setup>
import { addGuiFolder } from "@depth/hud"
import { useFullscreen, useMemory, useWakeLock } from "@vueuse/core"
import { useEnvironmentStore } from "../stores/environment"
import { usePreferencesStore } from "../stores/preferences"
import Debug from "../components/ui/Debug.vue"

const environment = useEnvironmentStore()
const preferences = usePreferencesStore()
const fullscreen = useFullscreen()
const wakeLock = useWakeLock()
const { isSupported, memory } = useMemory()

const size = (v: number) => {
  const kb = v / 1024 / 1024
  return `${kb.toFixed(2)} MB`
}

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
