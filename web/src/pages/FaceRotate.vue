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
import GradientMaterial from "~/3D/materials/GradientMaterial"
import { Vector2 } from "three/src/math/Vector2"
import { LatheGeometry } from "three/src/geometries/LatheGeometry"
import { Color } from "three/src/math/Color"
import { Mesh } from "three/src/objects/Mesh"
import { Box3 } from "three/src/math/Box3"
import { Vector3 } from "three/src/math/Vector3"

const { addForPage } = useSceneHelper()

const threeJs = useThreeJSEventHook()
threeJs.trigger({ cmd: "RenderFrames", param: "All" })

const video = ref<HTMLVideoElement>()
const setVideoRef = (el?: HTMLVideoElement) => set(video, el)
const streaming = ref(false)
const landmarks = ref<FaceMeshResults["multiFaceLandmarks"]>()

const points: Vector2[] = [
  new Vector2(1, 0),
  new Vector2(1, 1),
  new Vector2(2, 1),
  new Vector2(2, 2),
  new Vector2(3, 2),
  new Vector2(3, 3),
]
const geometry = new LatheGeometry(points, 4)
geometry.rotateX(-Math.PI / 2)
geometry.rotateZ(Math.PI / 4)
const material = new GradientMaterial(new Color("red"), new Color("purple"))

const lathe = new Mesh(geometry, material)
lathe.position.set(0, 0, -10)

addForPage(lathe)
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

  const o = new Vector3()
  cameraControls.getPosition(o)
})

onBeforeUnmount(() => {
  geometry.dispose()
  material.dispose()
})
</script>
