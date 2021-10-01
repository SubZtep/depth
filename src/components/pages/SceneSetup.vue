<template lang="pug">
Title Scene setup
//-h1 {{opts.skyboxNr}}
</template>

<script lang="ts" setup>
import { onBeforeUnmount } from "@vue/runtime-core"
import { loopFns, singleFns } from "../../packages/ThreeJS/useRenderLoop"
import { useGui } from "../../packages/datGUI"
import { useAssets } from "../../packages/ThreeJS/useAssets"
import { useInterval, set } from "@vueuse/core"
import { AmbientLight, CubeTexture, DirectionalLight, DirectionalLightHelper } from "three"
import { ColorGUIHelper, makeXYZGUI } from "../../packages/datGUI/extend"
import { objs } from "../../packages/ThreeJS/useSceneObjects"
import { useThreeJSEventHook } from "../../packages/ThreeJS/plugin"
import { doRenderAllFrames, dontRenderAllFrames } from "../../packages/ThreeJS/constants"

const threeJs = useThreeJSEventHook()

const gui = useGui()
const folder = gui.addFolder("Scene setup")
folder.open()

const assets = useAssets()
let skybox: CubeTexture

const opts = reactive({
  skyboxNr: 1,
  skyboxRotZ: 0,
  timeLapse: false,
})
const { counter, pause, resume } = useInterval(3000, { controls: true, immediate: false })
watch(counter, async newCount => {
  if (newCount > 15) set(counter, 1)
  opts.skyboxNr = counter.value
  skybox = await assets.loadSkybox(opts.skyboxNr as SkyboxNumber)
})

const bgFolder = folder.addFolder("Background")
bgFolder.open()
bgFolder
  .add(opts, "skyboxNr", 1, 15, 1)
  .listen()
  .onChange(v => set(counter, v))
  .name("Skybox nr.")
bgFolder
  .add(opts, "timeLapse")
  .onChange(v => (v ? resume() : pause()))
  .name("Time-lapse preview")

const ambLight = objs.get("ambLight") as AmbientLight
const ambLightFolder = folder.addFolder("Ambient light")
ambLightFolder.addColor(new ColorGUIHelper(ambLight, "color"), "value").name("Color")
ambLightFolder.add(ambLight, "intensity", 0, 2, 0.01)
ambLightFolder.open()

const dirLight = objs.get("dirLight") as DirectionalLight
const dirLightHelper = new DirectionalLightHelper(dirLight, 5)
function updateDirLight() {
  dirLight.target.updateMatrixWorld()
  dirLightHelper.update()
}

const dirlightFolder = folder.addFolder("Directional light")
dirlightFolder.open()
dirlightFolder.addColor(new ColorGUIHelper(dirLight, "color"), "value").name("Color").onChange(updateDirLight)
dirlightFolder.add(dirLight, "castShadow").onChange(updateDirLight)
dirlightFolder.add(dirLight, "intensity", 0, 2, 0.01).onChange(updateDirLight)
makeXYZGUI(dirlightFolder, dirLight.position, "Position", updateDirLight)
makeXYZGUI(dirlightFolder, dirLight.target.position, "Target", updateDirLight)

singleFns.add(({ scene }) => scene.add(dirLight.target, dirLightHelper))

loopFns.add(({ scene }) => {
  if (skybox) {
    scene.background = skybox
  }
})

threeJs.trigger(doRenderAllFrames)

onBeforeUnmount(() => {
  threeJs.trigger(dontRenderAllFrames)
  singleFns.add(({ scene }) => {
    scene.remove(dirLightHelper, dirLight.target)
    dirLightHelper.dispose()
  })
  gui.removeFolder(folder)
})
</script>
