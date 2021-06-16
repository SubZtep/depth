<template lang="pug">
.loading(v-show="loading") Loading...

.videoGrid
  VideoPlayer(
    v-for="vs in state.videos"
    :key="vs.id"
    :id="vs.id"
    @playing="onVideoPlaying"
    @pause="onVideoPause")

canvas(ref="canvasRef")
</template>

<script lang="ts" setup>
import { ref, watch } from "vue"
import { useThreeJs } from "./composables/useThreeJs"
import { usePose, ready as detectorsReady } from "./composables/usePose"
import { useGlobalState } from "./store"
import { Stickman } from "./models/stickman"
import { and, not, whenever, set, until } from "@vueuse/core"

const stickmans = new Map<string, Stickman>()
const videos = new Set<HTMLVideoElement>()

function onVideoPlaying(el: HTMLVideoElement) {
  videos.add(el)
  stickmans.get(el.id)?.setVideo(el)
}

function onVideoPause(el: HTMLVideoElement) {
  videos.delete(el)
}

const canvasRef = ref<HTMLCanvasElement>()
const state = useGlobalState()
const { ready: threeReady, onThreeReady, tickLoop, pauseTickLoop, resumeTickLoop } = useThreeJs(canvasRef)
const { estPoses } = usePose()

const stickmanReady = ref(false)
const loading = not(and(detectorsReady, threeReady, stickmanReady))
let scene: THREE.Scene | null = null

tickLoop(async () => {
  await Promise.all(
    state.videos.map(async v => {
      const el = document.querySelector<HTMLVideoElement>(`#${v.id}`)!
      if (el.isPlaying) {
        const pose = await estPoses(el!, v.model)
        stickmans.get(v.id)!.update(pose)
      }
    })
  )
})


watch(
  () => state.videos.map(v => v.model),
  async () => {
    set(stickmanReady, false)
    pauseTickLoop()
    await until(threeReady).toBeTruthy()

    for (const { id, model } of state.videos) {
      let stickman: Stickman
      if (stickmans.has(id)) {
        stickman = stickmans.get(id)!
      } else {
        stickman = new Stickman(scene!)
        stickmans.set(id, stickman)
      }
      // stickman.setKeypoints(model as SupportedModels.MoveNet | SupportedModels.BlazePose)
      stickman.setKeypoints(model)
    }

    set(stickmanReady, true)
  },
  { immediate: true }
)

onThreeReady(({ scene: sobj }) => (scene = sobj))
whenever(and(detectorsReady, threeReady, stickmanReady), resumeTickLoop)
</script>
