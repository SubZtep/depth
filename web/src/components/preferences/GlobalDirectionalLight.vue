<template lang="pug">
Title Directional light
</template>

<script lang="ts" setup>
import { DirectionalLight, DirectionalLightHelper } from "three"
import { addGuiFolder, ColorGUIHelper, makeXYZGUI } from "@depth/dat.gui"
import useObjectPool from "../../composables/useObjectPool"
import { exec3D } from "@depth/three.js"

const light = useObjectPool().pop("GlobalDirectionalLight") as DirectionalLight
const lightHelper = new DirectionalLightHelper(light, 5)
exec3D(({ scene }) => scene.add(light.target, lightHelper))

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
  exec3D(({ scene }) => {
    scene.remove(light.target, lightHelper)
    lightHelper.dispose()
  })
})
</script>
