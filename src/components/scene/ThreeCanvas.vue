<template lang="pug">
Teleport(to="#world")
  canvas(ref="wc")

MainScene
</template>

<script lang="ts" setup>
import { AmbientLight, DirectionalLight } from "three"
import { sleep, rand } from "../../misc/utils"
import { useAssets } from "../../packages/ThreeJS/useAssets"
import { useCanvas } from "../../packages/ThreeJS/useThreeJS"
import { useNProgress } from "@vueuse/integrations/useNProgress"
import { objs } from "../../packages/ThreeJS/useSceneObjects"
import { useThreeJSEventHook } from "../../packages/ThreeJS/plugin"
import { resumeLoop } from "../../packages/ThreeJS/constants"
import * as sdef from "../../models/sceneDefaults"

const assets = useAssets()

await assets.loadNoVideoMaterial()
await assets.loadLeafMaterial()
const skybox = await assets.loadSkybox(rand(15))
const wc = ref() as Ref<HTMLCanvasElement>

const ambLight = new AmbientLight()
const dirLight = new DirectionalLight(0xffffff, 0.5)
objs.set("ambLight", ambLight)
objs.set("dirLight", dirLight)

const grid = sdef.grid()
const plane = sdef.plane()
const leafPlane = sdef.leafPlane()

useCanvas(wc).add(ambLight, dirLight, grid, plane, leafPlane).background = skybox

// transformables.push(leafPlane.name)

await sleep(69)
useNProgress().done()

useThreeJSEventHook().trigger(resumeLoop)
</script>
