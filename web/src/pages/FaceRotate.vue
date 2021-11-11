<template lang="pug">
WebcamPlayer(:enabled="true" @mounted="setVideoRef" @streaming="isStreaming => streaming = isStreaming")
</template>

<script lang="ts" setup>
import type { FaceMeshResults, FaceMeshResultsListener } from "@depth/mediapipe"
import { useStats } from "@depth/stats.js"
import { useFaceMesh } from "@depth/mediapipe"
import useFaceRotation from "~/composables/useFaceRotation"
import useSceneHelper from "~/composables/useSceneHelper"
import { exec3D, loop3D, useThreeJSEventHook } from "@depth/three.js"
import * as THREE from "three"
import GradientMaterial from "~/3D/materials/GradientMaterial"
import { Box3, Vector3 } from "three"

const { object3dForPage } = useSceneHelper()

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
geometry.rotateX(-Math.PI / 2)
geometry.rotateZ(Math.PI / 4)
const material = new GradientMaterial(new THREE.Color("red"), new THREE.Color("purple"))

const lathe = new THREE.Mesh(geometry, material)
lathe.position.set(0, 0, -10)

object3dForPage(lathe)
threeJs.trigger({ cmd: "RenderFrames", param: "All" })

const handler: FaceMeshResultsListener = res => {
  lathe.setRotationFromQuaternion(q.value)
  set(landmarks, res.multiFaceLandmarks)
}

const fit = new Box3(new Vector3(-3, -2, -10), new Vector3(3, 2, -10))

exec3D(({ cameraControls }) => {
  cameraControls.fitToBox(fit, true)
  cameraControls.setPosition(0, 1, -20, true)
})

const { t } = await useFaceMesh({ video, streaming, handler, stats: useStats() })
const { q, pos } = useFaceRotation(landmarks)
watch(streaming, isStreaming => (lathe.material.visible = isStreaming))

loop3D(({ clock, cameraControls }) => {
  // if (!streaming.value) return
  lathe.quaternion.slerp(q.value, t.value * clock.getDelta() * 100)
  // lathe.position.setX((pos.value.x * -(100 / 6)) + 6)

  const o = new Vector3()
  cameraControls.getPosition(o)
  console.log(o)
})

onBeforeUnmount(() => {
  geometry.dispose()
  material.dispose()
})
</script>
