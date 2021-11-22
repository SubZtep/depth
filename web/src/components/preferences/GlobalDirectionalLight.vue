<template lang="pug">
Title Directional light
</template>

<script lang="ts" setup>
import { addGuiFolder, ColorGUIHelper, makeXYZGUI } from "@depth/dat.gui"
import { exec3D, DirectionalLightHelper } from "@depth/three.js"
import type { DirectionalLight } from "@depth/three.js"
import useResources from "~/composables/useResources"
import useSceneHelper from "~/composables/useSceneHelper"

const { addForPage } = useSceneHelper()
const { resources } = useResources()
const light = resources.get<DirectionalLight>("GlobalDirectionalLight")

const lightHelper = new DirectionalLightHelper(light, 5)
addForPage(light.target, lightHelper)

addGuiFolder(folder => {
  const updateDirectionalLight = () => {
    light.target.updateMatrixWorld()
    lightHelper.update()
  }
  folder.name = "🌞 Directional light"
  folder.addColor(new ColorGUIHelper(light, "color"), "value").name("Color").onChange(updateDirectionalLight)
  folder.add(light, "castShadow").name("Cast shadow").onChange(updateDirectionalLight)
  folder.add(light, "intensity", 0, 2, 0.01).name("Intensity").onChange(updateDirectionalLight)
  makeXYZGUI(folder, light.position, "Position", updateDirectionalLight)
  makeXYZGUI(folder, light.target.position, "Target", updateDirectionalLight)
})

onBeforeUnmount(() => {
  exec3D(() => {
    lightHelper.dispose()
  })
})
</script>
