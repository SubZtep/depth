<template lang="pug">
WebcamPlayer(:enabled="false" @mounted="setVideoReference" @streaming="isStreaming => streaming = isStreaming")
</template>

<script lang="ts" setup>
import { useStats } from "@depth/stats.js"
import { useFaceMesh } from "@depth/mediapipe"
import useFaceRotation from "~/composables/useFaceRotation"
import useSceneHelper from "~/composables/useSceneHelper"
import lathePyramid from "~/3D/meshes/lathe-pyramid"
import { exec3D, loop3D, useThreeJSEventHook } from "@depth/three.js"
import { Vector2 } from "three/src/math/Vector2"
import { LatheGeometry } from "three/src/geometries/LatheGeometry"
import { Color } from "three/src/math/Color"
import { Mesh } from "three/src/objects/Mesh"
import { Box3 } from "three/src/math/Box3"
import { Vector3 } from "three/src/math/Vector3"

import GradientMaterial from "~/3D/materials/GradientMaterial"

const { addForPage } = useSceneHelper()

const threeJs = useThreeJSEventHook()
threeJs.trigger({ cmd: "RenderFrames", param: "All" })

const video = ref<HTMLVideoElement>() as Ref<HTMLVideoElement>
const setVideoReference = (element?: HTMLVideoElement) => set(video, element)
const streaming = ref(false)
const landmarks = ref<LandmarkList>()

const lathe = lathePyramid()
const fit = new Box3(new Vector3(-3, -2, -10), new Vector3(3, 2, -10))

exec3D(({ cameraControls }) => {
  cameraControls.fitToBox(fit, true)
  cameraControls.setPosition(0, 1, -20, true)
})

const { t } = useFaceMesh({
  video,
  streaming,
  handler: result => {
    lathe.setRotationFromQuaternion(q.value)
    set(landmarks, result.multiFaceLandmarks[0])
  },
})
const { q, pos } = useFaceRotation(landmarks)
watch(streaming, isStreaming => (lathe.material.visible = isStreaming))

loop3D(({ deltaTime, cameraControls }) => {
  // if (!streaming.value) return
  lathe.quaternion.slerp(q.value, t.value * deltaTime * 100)

  const o = new Vector3()
  cameraControls.getPosition(o)
})
</script>
