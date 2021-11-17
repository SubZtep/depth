<template lang="pug">
Title Directional light
</template>

<script lang="ts" setup>
import { addGuiFolder, ColorGUIHelper, makeXYZGUI } from "@depth/dat.gui"
import { exec3D } from "@depth/three.js"
import useResources from "~/composables/useResources"
import type { DirectionalLight } from "three/src/lights/DirectionalLight"
import { DirectionalLightHelper } from "three/src/helpers/DirectionalLightHelper"
import useSceneHelper from "~/composables/useSceneHelper"

const { addForPage } = useSceneHelper()
const resources = useResources()
const light = resources.get<DirectionalLight>("GlobalDirectionalLight")

const lightHelper = new DirectionalLightHelper(light, 5)
addForPage(light.target, lightHelper)

addGuiFolder(folder => {
  const updateDirLight = () => {
    light.target.updateMatrixWorld()
    lightHelper.update()
  }
  folder.name = "🌞 Directional light"
  folder.addColor(new ColorGUIHelper(light, "color"), "value").name("Color").onChange(updateDirLight)
  folder.add(light, "castShadow").name("Cast shadow").onChange(updateDirLight)
  folder.add(light, "intensity", 0, 2, 0.01).name("Intensity").onChange(updateDirLight)
  makeXYZGUI(folder, light.position, "Position", updateDirLight)
  makeXYZGUI(folder, light.target.position, "Target", updateDirLight)
})

onBeforeUnmount(() => {
  exec3D(() => {
    lightHelper.dispose()
  })
})
</script>
