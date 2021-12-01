<template lang="pug">
WebcamPlayer(
  @mounted="el => video = el"
  @streaming="v => streaming = v"
  :folder-closed="false"
  :enabled="true")
</template>

<script lang="ts" setup>
import { useFaceMesh } from "@depth/mediapipe"
import useFaceRotation from "~/composables/useFaceRotation"
import useSceneHelper from "~/composables/useSceneHelper"
import { loop3D } from "@depth/three.js"
import { Vector2 } from "three/src/math/Vector2"
import { LatheGeometry } from "three/src/geometries/LatheGeometry"
import { Color } from "three/src/math/Color"
import { Mesh } from "three/src/objects/Mesh"
import { Vector3 } from "three/src/math/Vector3"
import GradientMaterial from "~/3D/materials/GradientMaterial"
import WebcamPlayer from "~/components/video/WebcamPlayer.vue"

const { addForPage } = useSceneHelper()

const video = ref<HTMLVideoElement>() as Ref<HTMLVideoElement>
const setVideoReference = (element?: HTMLVideoElement) => set(video, element)
const streaming = ref(false)
const landmarks = ref<LandmarkList>()

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

// const fit = new Box3(new Vector3(-3, -2, -10), new Vector3(3, 2, -10))

// exec3D(({ cameraControls }) => {
//   cameraControls.fitToBox(fit, true)
//   cameraControls.setPosition(0, 1, -20, true)
// })

const { t } = useFaceMesh({
  video,
  streaming,
  handler: result => {
    lathe.setRotationFromQuaternion(q.value)
    set(landmarks, result.multiFaceLandmarks[0])
  },
})
const { q } = useFaceRotation(landmarks)
watch(streaming, isStreaming => (lathe.material.visible = isStreaming))

loop3D(({ deltaTime, cameraControls }) => {
  // if (!streaming.value) return
  lathe.quaternion.slerp(q.value, t.value * deltaTime * 100)

  const o = new Vector3()
  cameraControls.getPosition(o)
})

onBeforeUnmount(() => {
  geometry.dispose()
  material.dispose()
})
</script>
