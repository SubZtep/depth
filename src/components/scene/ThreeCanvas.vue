<template lang="pug">
Teleport(to="#world")
  canvas(ref="wc")

MainScene
</template>

<script lang="ts" setup>
import {
  Mesh,
  Color,
  Vector3,
  SpotLight,
  GridHelper,
  PlaneGeometry,
  HemisphereLight,
  MeshPhongMaterial,
  MeshBasicMaterial,
  MeshLambertMaterial,
  DoubleSide,
  BackSide,
  FrontSide,
  AmbientLight,
  DirectionalLight,
} from "three"
import { useToast } from "vue-toastification"
import { sleep, rand } from "../../misc/utils"
import { useAssets } from "../../packages/ThreeJS/useAssets"
import { useCanvas } from "../../packages/ThreeJS/useThreeJS"
import { useNProgress } from "@vueuse/integrations/useNProgress"
import { transformables } from "../../packages/ThreeJS/useTransformControls"
import { singleFns, loopFns } from "../../packages/ThreeJS/useRenderLoop"
import { useStats } from "../../packages/Stats/plugin"
import { useGui } from "../../packages/datGUI/plugin"
import { objs } from "../../packages/ThreeJS/useSceneObjects"
import { useThreeJSEventHook } from "../../packages/ThreeJS/plugin"
import { pauseLoop, resumeLoop } from "../../packages/ThreeJS/constants"
import * as sdef from "../../models/sceneDefaults"
import * as THREE from "three"

const assets = useAssets()

await assets.loadNoVideoMaterial()
const leaf = await assets.loadLeafMaterial()
const skybox = await assets.loadSkybox(rand(15))
const wc = ref() as Ref<HTMLCanvasElement>

useGui().show()

const ambLight = new AmbientLight()
const dirLight = new DirectionalLight(0xffffff, 0.5)
objs.set("ambLight", ambLight)
objs.set("dirLight", dirLight)

const grid = sdef.grid()
const plane = sdef.plane()
const leafPlane = sdef.leafPlane()
const terrainScene = sdef.terrainScene()

useCanvas(wc).add(ambLight, dirLight, grid, plane, leafPlane, terrainScene).background = skybox

// transformables.push(leafPlane.name)

await sleep(69)
useNProgress().done()

useThreeJSEventHook().trigger(resumeLoop)
</script>
