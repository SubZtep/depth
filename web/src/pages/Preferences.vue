<template lang="pug">
Title Preferences
</template>

<script lang="ts" setup>
// import { addGuiFolder } from "@depth/dat.gui"
// import { singleFns, objs, useThreeJSEventHook, renderAllFrames, renderFramesWithCameraMove } from "@depth/three.js"
// import { AmbientLight, DirectionalLight, DirectionalLightHelper } from "three"
// import { ColorGUIHelper, makeXYZGUI } from "@depth/dat.gui"

import { addGuiFolder } from "@depth/dat.gui"
import { useAssets, exec3D, setupBoundaries } from "@depth/three.js"
import { usePreferencesStore } from "../stores/preferences"

const preferences = usePreferencesStore()
const guiScaleCss = useCssVar("--gui-scale")
const { loadSkybox } = useAssets()

addGuiFolder(folder => {
  folder.name = "⚙ Preferences"
  folder
    .add(preferences, "guiScale", 0.5, 3, 0.1)
    .name("GUI scale")
    .onFinishChange(scale => set(guiScaleCss, String(scale)))
  folder
    .add(preferences, "skybox", 1, 15, 1)
    .name("Skybox")
    .onChange(async nr => {
      const bg = await loadSkybox(nr)
      exec3D(({ scene }) => {
        scene.background = bg
      })
    })
  folder
    .add(preferences, "horizontalLock")
    .name("Rotation lock")
    .onChange((lock: boolean) => {
      exec3D(({ cameraControls }) => {
        setupBoundaries(cameraControls, lock ? "Full" : "Simple")
      })
    })
})

// const ambLight = objs.get("ambLight") as AmbientLight
// const dirLight = objs.get("dirLight") as DirectionalLight
// const dirLightHelper = new DirectionalLightHelper(dirLight, 5)
// singleFns.add(({ scene }) => scene.add(dirLight.target, dirLightHelper))

// const threeJs = useThreeJSEventHook()
// threeJs.trigger("renderAllFrames")

// addGuiFolder(folder => {
//   folder.name = "💡 Ambient light"
//   folder.addColor(new ColorGUIHelper(ambLight, "color"), "value").name("Color")
//   folder.add(ambLight, "intensity", 0, 2, 0.01).name("Intensity")
// })

// addGuiFolder(folder => {
//   const updateDirLight = () => {
//     dirLight.target.updateMatrixWorld()
//     dirLightHelper.update()
//   }
//   folder.name = "🌞 Directional light"
//   folder.addColor(new ColorGUIHelper(dirLight, "color"), "value").name("Color").onChange(updateDirLight)
//   folder.add(dirLight, "castShadow").name("Cast shadow").onChange(updateDirLight)
//   folder.add(dirLight, "intensity", 0, 2, 0.01).name("Intensity").onChange(updateDirLight)
//   makeXYZGUI(folder, dirLight.position, "Position", updateDirLight)
//   makeXYZGUI(folder, dirLight.target.position, "Target", updateDirLight)
// })

// onBeforeUnmount(() => {
//   threeJs.trigger("renderFramesWithCameraMove")
//   singleFns.add(({ scene }) => {
//     scene.remove(dirLightHelper, dirLight.target)
//     dirLightHelper.dispose()
//   })
// })
</script>
