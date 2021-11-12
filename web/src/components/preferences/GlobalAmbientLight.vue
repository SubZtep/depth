<template lang="pug">
Title Ambient light
</template>

<script lang="ts" setup>
import { addGuiFolder, ColorGUIHelper } from "@depth/dat.gui"
import type { AmbientLight } from "three/src/lights/AmbientLight"
import { usePreferencesStore } from "~/stores/preferences"
import useResources from "~/composables/useResources"

const resources = useResources()
const light = resources.get<AmbientLight>("GlobalAmbientLight")

const preferences = usePreferencesStore()
light.color.setHex(preferences.ambientColor)
light.intensity = preferences.ambientIntensity

addGuiFolder(folder => {
  folder.name = "💡 Ambient light"
  folder
    .addColor(new ColorGUIHelper(light, "color"), "value")
    .name("Color")
    .onChange(c => (preferences.ambientColor = parseInt(c.substring(1), 16)))
  folder
    .add(light, "intensity", 0, 2, 0.01)
    .name("Intensity")
    .onChange(v => (preferences.ambientIntensity = v))
})
</script>
