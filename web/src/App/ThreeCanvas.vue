<template lang="pug">
Teleport(to="#scene")
  canvas(ref="wc")

MainScene
</template>

<script lang="ts" setup>
import { AmbientLight, DirectionalLight } from "three"
import { usePreferencesStore } from "../stores/preferences"
import { InfiniteGridHelper } from "../3D/infiniteGrid"
import { useAssets, useThreeJSEventHook, useCanvas } from "@depth/three.js"
// import { onVisibility } from "../events"
import * as sdef from "../3D/sceneDefaults"
import { rand } from "../misc/utils"
import { sleep } from "@depth/misc"
import useObjectPool from "../composables/useObjectPool"

const preferences = usePreferencesStore()
const assets = useAssets()

await assets.loadNoVideoMaterial()
await assets.loadLeafMaterial()
const skybox = await assets.loadSkybox(preferences.skybox || rand(15))
const wc = ref()

const { push } = useObjectPool()

const ambLight = new AmbientLight(0xbbbbbb)
push("GlobalAmbientLight", ambLight)

const dirLight = new DirectionalLight(0xffffff, 1)
dirLight.rotation.set(0, 1.6, -30)
push("GlobalDirectionalLight", dirLight)

const grid = sdef.grid(-7.5)
const grid2 = sdef.grid(7.5)
const plane = sdef.plane()
const leafPlane = sdef.leafPlane()
const threeJs = useThreeJSEventHook()

const igrid = InfiniteGridHelper({
  size1: 5,
  size2: 10,
  distance: 1000,
})

useCanvas(wc).add(ambLight, dirLight, igrid, grid, grid2, plane, leafPlane).background = skybox

await sleep(69)
useNProgress().done()
threeJs.trigger({ cmd: "Resume" })

// onVisibility(({ visible }) => {
//   threeJs.trigger(visible ? resumeLoop : pauseLoop)
// })
</script>
