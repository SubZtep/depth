<template lang="pug">
WebcamPlayer(:enabled="true" @mounted="setVideoRef" @streaming="isStreaming => streaming = isStreaming")
</template>

<script lang="ts" setup>
import type { FaceMeshResults, FaceMeshResultsListener } from "@depth/mediapipe"
import { useStats } from "@depth/stats.js"
import { useFaceMesh } from "@depth/mediapipe"
import useFaceRotation from "~/composables/useFaceRotation"
import { exec3D, loop3D, useThreeJSEventHook } from "@depth/three.js"
import * as THREE from "three"
import GradientMaterial from "~/3D/materials/GradientMaterial"

const threeJs = useThreeJSEventHook()
threeJs.trigger({ cmd: "RenderFrames", param: "All" })

const video = ref<HTMLVideoElement>()
const setVideoRef = (el?: HTMLVideoElement) => set(video, el)
const streaming = ref(false)
const landmarks = ref<FaceMeshResults["multiFaceLandmarks"]>()

const points: THREE.Vector2[] = [
  new THREE.Vector2(1, 0),
  new THREE.Vector2(1, 1),
  new THREE.Vector2(2, 1),
  new THREE.Vector2(2, 2),
  new THREE.Vector2(3, 2),
  new THREE.Vector2(3, 3),
]
const geometry = new THREE.LatheGeometry(points, 4)
const material = new GradientMaterial(new THREE.Color("red"), new THREE.Color("purple"))

const lathe = new THREE.Mesh(geometry, material)
lathe.position.set(0, 0, 10)
lathe.rotateX(Math.PI / 2)
lathe.rotateY(Math.PI / 4)

exec3D(({ scene }) => {
  scene.add(lathe)
})

const handler: FaceMeshResultsListener = res => {
  set(landmarks, res.multiFaceLandmarks)
}

await useFaceMesh({ video, streaming, handler, stats: useStats() })
const q = useFaceRotation(landmarks)

loop3D(() => {
  lathe.setRotationFromQuaternion(q.value)
  lathe.rotateX(-Math.PI / 2)
  lathe.rotateY(-Math.PI / 4)
})

onBeforeUnmount(() => {
  exec3D(({ scene }) => scene.remove(lathe))
  geometry.dispose()
  material.dispose()
})
</script>
