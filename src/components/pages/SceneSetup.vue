<template lang="pug">
Title Scene setup
</template>

<script lang="ts" setup>
import { onBeforeUnmount } from "vue"
import { singleFns } from "~/packages/ThreeJS/useRenderLoop"
import { useGuiFolder } from "~/packages/datGUI"
import { AmbientLight, DirectionalLight, DirectionalLightHelper } from "three"
import { ColorGUIHelper, makeXYZGUI } from "~/packages/datGUI/extend"
import { objs } from "~/packages/ThreeJS/useSceneObjects"
import { useThreeJSEventHook } from "~/packages/ThreeJS/plugin"
import { doRenderAllFrames, dontRenderAllFrames } from "~/packages/ThreeJS/constants"

const ambLight = objs.get("ambLight") as AmbientLight
const dirLight = objs.get("dirLight") as DirectionalLight
const dirLightHelper = new DirectionalLightHelper(dirLight, 5)
singleFns.add(({ scene }) => scene.add(dirLight.target, dirLightHelper))

const threeJs = useThreeJSEventHook()
threeJs.trigger(doRenderAllFrames)

useGuiFolder(folder => {
  folder.name = "💡 Ambient light"
  folder.addColor(new ColorGUIHelper(ambLight, "color"), "value").name("Color")
  folder.add(ambLight, "intensity", 0, 2, 0.01).name("Intensity")
})

useGuiFolder(folder => {
  const updateDirLight = () => {
    dirLight.target.updateMatrixWorld()
    dirLightHelper.update()
  }
  folder.name = "🌞 Directional light"
  folder.addColor(new ColorGUIHelper(dirLight, "color"), "value").name("Color").onChange(updateDirLight)
  folder.add(dirLight, "castShadow").name("Cast shadow").onChange(updateDirLight)
  folder.add(dirLight, "intensity", 0, 2, 0.01).name("Intensity").onChange(updateDirLight)
  makeXYZGUI(folder, dirLight.position, "Position", updateDirLight)
  makeXYZGUI(folder, dirLight.target.position, "Target", updateDirLight)
})

onBeforeUnmount(() => {
  threeJs.trigger(dontRenderAllFrames)
  singleFns.add(({ scene }) => {
    scene.remove(dirLightHelper, dirLight.target)
    dirLightHelper.dispose()
  })
})
</script>
