<template lang="pug">
Teleport(to="#scene")
  canvas(ref="wc")

MainScene
</template>

<script lang="ts" setup>
import { AmbientLight, DirectionalLight } from "three"
import { useThreeJSEventHook } from "~/packages/ThreeJS/plugin"
import { usePreferencesStore } from "~/stores/preferences"
import { InfiniteGridHelper } from "~/3D/infiniteGrid"
import { useCanvas } from "~/packages/ThreeJS/useThreeJS"
import { resumeLoop } from "~/packages/ThreeJS/constants"
import { objs } from "~/packages/ThreeJS/useSceneObjects"
import { useAssets } from "~/packages/ThreeJS/useAssets"
import * as sdef from "~/3D/sceneDefaults"
import { sleep, rand } from "~/misc/utils"

const toast = useToast()
const preferences = usePreferencesStore()
const assets = useAssets()

await assets.loadNoVideoMaterial()
await assets.loadLeafMaterial()
const skybox = await assets.loadSkybox(preferences.skybox || rand(15))
const wc = ref() as Ref<HTMLCanvasElement>

const ambLight = new AmbientLight(0xbbbbbb)
const dirLight = new DirectionalLight(0xffffff, 0.6)
objs.set("ambLight", ambLight)
objs.set("dirLight", dirLight)

const grid = sdef.grid(-7.5)
const grid2 = sdef.grid(7.5)
const plane = sdef.plane()
const leafPlane = sdef.leafPlane()
const igrid = InfiniteGridHelper()

useCanvas(wc).add(ambLight, dirLight, plane, leafPlane, grid, grid2, igrid).background = skybox

// transformables.push(leafPlane.name)

await sleep(69)
useNProgress().done()

useThreeJSEventHook().trigger(resumeLoop)

const visibility = useDocumentVisibility()

watch(visibility, (current, previous) => {
  if (current === "visible" && previous === "hidden") {
    toast.success("🎉 Welcome back!")
  }
})
</script>
