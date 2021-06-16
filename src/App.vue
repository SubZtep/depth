<template lang="pug">
.loading(v-show="loading") Loading...

VideoPlayer(
  v-for="vs in state.videos"
  :key="vs.id"
  :id="vs.id"
  @playing="onVideoPlaying"
  @pause="onVideoPause")
canvas(ref="canvasRef")
</template>

<script lang="ts" setup>
import { ref } from "vue"
import { useThreeJs } from "./composables/useThreeJs"
import { useMediaPipePose } from "./composables/useMediaPipePose"
import { useGlobalState } from "./store"
import { Stickman } from "./models/stickman"

const stickmans = new Map<string, Stickman>()

const videos = new Set<HTMLVideoElement>()

function onVideoPlaying(el: HTMLVideoElement) {
  videos.add(el)
  stickmans.get(el.id)?.setVideo(el)
}

function onVideoPause(el: HTMLVideoElement) {
  videos.delete(el)
}

const loading = ref(false)
const canvasRef = ref<HTMLCanvasElement>()
const state = useGlobalState()
const { onThreeReady, tickLoop } = useThreeJs(canvasRef)
const { estPoses } = useMediaPipePose()

tickLoop(() => {
  videos.forEach(async video => {
    const pose = await estPoses(video)
    stickmans.get(video.id)!.update(pose)
  })
})

onThreeReady(({ scene, resume }) => {
  state.videos.forEach(({ id }, i) => {
    stickmans.set(id, new Stickman(scene, i === 0 ? "yellow" : "blue"))
  })

  resume()
})
</script>
