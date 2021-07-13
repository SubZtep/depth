<template lang="pug">
//-h1 {{opts.skyboxNr}}
</template>

<script lang="ts" setup>
import { onBeforeUnmount } from "@vue/runtime-core"
import { loopFns, singleFns } from "../../packages/ThreeJS/useRenderLoop"
import { useGui } from "../../packages/datGUI/plugin"
import { useAssets } from "../../packages/ThreeJS/useAssets"
import { useInterval, set } from "@vueuse/core"
import { AmbientLight, CubeTexture, DirectionalLight, DirectionalLightHelper } from "three"
import { ColorGUIHelper } from "../../packages/datGUI/extend"

const gui = useGui()
const folder = gui.addFolder("Scene setup")
folder.open()

const assets = useAssets()
let skybox: CubeTexture

const opts = reactive({
  skyboxNr: 1,
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
bgFolder.add(opts, "skyboxNr", 1, 15, 1).listen().onChange(v => set(counter, v)).name("Skybox nr.")
bgFolder.add(opts, "timeLapse").onChange(v => (v ? resume() : pause())).name("Time-lapse preview")

const ambLight = new AmbientLight()
const ambLightFolder = folder.addFolder("Ambient light")
ambLightFolder.addColor(new ColorGUIHelper(ambLight, "color"), "value").name("Color")
ambLightFolder.add(ambLight, "intensity", 0, 2, 0.01)

const dirLight = new DirectionalLight( 0xffffff, 0.5 );
const dirLightHelper = new DirectionalLightHelper( dirLight, 5 );
function updateDirLight() {
  dirLight.target.updateMatrixWorld()
  dirLightHelper.update()
}

const dirlightFolder = folder.addFolder("Directional light")
dirlightFolder.open()
dirlightFolder.closed
dirlightFolder.addColor(new ColorGUIHelper(dirLight, "color"), "value").name("Color").onChange(updateDirLight)
dirlightFolder.add(dirLight, "castShadow").onChange(updateDirLight)
dirlightFolder.add(dirLight, "intensity", 0, 2, 0.01).onChange(updateDirLight)
dirlightFolder.add(dirLight.position, "x", -100, 100).name("Position X").onChange(updateDirLight)
dirlightFolder.add(dirLight.position, "y", -1, 100).name("Position Y").onChange(updateDirLight)
dirlightFolder.add(dirLight.position, "z", -100, 100).name("Position Z").onChange(updateDirLight)
dirlightFolder.add(dirLight.target.position, "x", -100, 100).name("Target X").onChange(updateDirLight)
dirlightFolder.add(dirLight.target.position, "y", -1, 100).name("Target Y").onChange(updateDirLight)
dirlightFolder.add(dirLight.target.position, "z", -100, 100).name("Target Z").onChange(updateDirLight)

singleFns.add(({ scene }) => scene.add(ambLight, dirLight, dirLight.target, dirLightHelper))

loopFns.add(({ scene }) => {
  if (skybox) {
    scene.background = skybox
  }
})

onBeforeUnmount(() => {
  singleFns.add(({ scene }) => {
    scene.remove(dirLightHelper)
    dirLightHelper.dispose()
  })
  gui.removeFolder(folder)
})
</script>
