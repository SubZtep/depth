<template lang="pug">
//- Title Ambient light
//- Debug {{ preferences }}
</template>

<script lang="ts" setup>
import { addGuiFolder, ColorGUIHelper } from "@depth/dat.gui"
import type { AmbientLight } from "three/src/lights/AmbientLight"
import useObjectPool from "~/composables/useObjectPool"
import { usePreferencesStore } from "~/stores/preferences"

const preferences = usePreferencesStore()
// const light = useObjectPool().pop("GlobalAmbientLight") as AmbientLight
// light.color.setHex(preferences.ambientColor)
// light.intensity = preferences.ambientIntensity

addGuiFolder(folder => {
  folder.name = "💡 Ambient light"
  // folder
  //   .addColor(new ColorGUIHelper(light, "color"), "value")
  //   .name("Color")
  //   .onChange(c => (preferences.ambientColor = parseInt(c.substring(1), 16)))
  // folder
  //   .add(light, "intensity", 0, 2, 0.01)
  //   .name("Intensity")
  //   .onChange(v => (preferences.ambientIntensity = v))
})
</script>
