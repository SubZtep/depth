<template lang="pug">
WebcamPlayer(@mounted="setVideoRef" @streaming="isStreaming => streaming = isStreaming")

Debug {{q}}
</template>

<script lang="ts" setup>
import type { FaceMeshResults, FaceMeshResultsListener } from "@depth/mediapipe"
import { useStats } from "@depth/stats.js"
import { useFaceMesh } from "@depth/mediapipe"
import { addGuiFolder } from "@depth/dat.gui"
import useFaceRotation from "~/composables/useFaceRotation"
import useObjectFactory from "~/composables/useObjectFactory"
import { exec3D } from "@depth/three.js"

const video = ref<HTMLVideoElement>()
const setVideoRef = (el?: HTMLVideoElement) => set(video, el)
const streaming = ref(false)
const landmarks = ref<FaceMeshResults["multiFaceLandmarks"]>()

const factory = useObjectFactory()
const cube = factory.cube()

exec3D(({ scene }) => scene.add(cube))

const handler: FaceMeshResultsListener = res => {
  set(landmarks, res.multiFaceLandmarks)
}

await useFaceMesh({ video, streaming, handler, stats: useStats() })
const q = useFaceRotation(landmarks)

watchEffect(() => {
  if (q.value) {
    cube.setRotationFromQuaternion(q.value)
  }
})

addGuiFolder(folder => {
  folder.name = "⚝ Depth"
})

onBeforeUnmount(() => {
  exec3D(({ scene }) => scene.remove(cube))
})
</script>
