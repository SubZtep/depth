<template lang="pug">
//- WebcamPlayer(:enabled="false" @mounted="setVideoReference" @streaming="isStreaming => streaming = isStreaming")

//- ViewportView(:width="400" :height="300")
</template>

<script lang="ts" setup>
// import type { FaceMeshResults, FaceMeshResultsListener } from "@depth/mediapipe"
// import { useStats } from "@depth/stats.js"
// import { useFaceMesh } from "@depth/mediapipe"
// import { addGuiFolder } from "@depth/dat.gui"
// import useFaceRotation from "~/composables/useFaceRotation"
// import useSceneHelper from "~/composables/useSceneHelper"
// import {
//   exec3D,
//   loop3D,
//   setupBoundaries,
//   useThreeJSEventHook,
//   Vector2,
//   LatheGeometry,
//   Color,
//   Mesh,
//   Object3D,
// } from "@depth/three.js"
// import GradientMaterial from "~/3D/materials/GradientMaterial"
// import { useSingleton } from "@depth/misc"

// const threeJs = useThreeJSEventHook()
// threeJs.trigger({ cmd: "RenderFrames", param: "All" })

// const { singleton } = useSingleton()

// const { addForPage, removeForPage, bgForPage } = useSceneHelper()
// // removeForPage("grid")
// // bgForPage(0x000000)

// const video = ref<HTMLVideoElement>()
// const setVideoReference = (element?: HTMLVideoElement) => set(video, element)
// const streaming = ref(false)
// const landmarks = ref<FaceMeshResults["multiFaceLandmarks"]>()

// const points: Vector2[] = [
//   new Vector2(1, 0),
//   new Vector2(1, 1),
//   new Vector2(2, 1),
//   new Vector2(2, 2),
//   new Vector2(3, 2),
//   new Vector2(3, 3),
// ]
// const geometry = new LatheGeometry(points, 4)
// geometry.rotateX(-Math.PI / 2)
// geometry.rotateZ(Math.PI / 4)
// const material = new GradientMaterial(new Color("red"), new Color("purple"))

// const lathe = new Mesh(geometry, material)
// lathe.position.set(0, 0, 0)
// lathe.layers.enableAll()
// addForPage(lathe)

// const pivot = new Object3D()
// pivot.layers.enableAll()
// pivot.position.set(0, 0, 5)
// singleton.set("pivot", pivot)

// const pivotCamera = new Object3D()
// pivotCamera.layers.enableAll()
// pivot.add(pivotCamera)
// pivotCamera.position.setZ(-5)

// exec3D(({ cameraControls }) => {
//   cameraControls.reset(false)
//   // cameraControls.camera.layers.enableAll()
//   // cameraControls.camera.layers.set(0)
//   pivotCamera.add(cameraControls.camera)
// })

// const handler: FaceMeshResultsListener = result => {
//   pivot.position.setX(pos.value.x * 6 - 3)
//   set(landmarks, result.multiFaceLandmarks)
// }

// const { t } = await useFaceMesh({ video, streaming, handler, stats: useStats() })
// const { q, pos } = useFaceRotation(landmarks)

// loop3D(({ clock }) => {
//   pivot.quaternion.slerp(q.value, clock.getDelta() * t.value * 100)
// })

// // addGuiFolder(folder => {
// //   folder.name = "⚝ Depth"
// // })

// onBeforeUnmount(() => {
//   geometry.dispose()
//   material.dispose()
// })
</script>
