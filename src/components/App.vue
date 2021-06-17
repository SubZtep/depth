<template lang="pug">
.loading(v-show="loading")
  | Loading...
  //- div detector: {{detectorsReady}}
  //- div three: {{threeReady}}
  //- div stickman: {{stickmanReady}}

.videoGrid
  VideoPlayer(
    v-for="vs in videos"
    :key="vs.id"
    :id="vs.id"
    @playing="setVideo"
    @pause="")

canvas(ref="canvasRef")
</template>

<script lang="ts" setup>
import { ref } from "vue"
import { and, not, whenever, set } from "@vueuse/core"
import { useEstimations } from "../composables/useEstimations"
import { useThreeJs } from "../composables/useThreeJs"
import { usePose } from "../composables/usePose"
import { useGlobalState } from "../store"

const canvasRef = ref<HTMLCanvasElement>()
const { onThreeReady, tickLoop, pauseTickLoop, resumeTickLoop } = useThreeJs(canvasRef)
const { estimatePoses, ready: detectorsReady } = usePose()
const { videos } = useGlobalState()

const threeReady = ref(false)
const scene = ref<THREE.Scene>()
const { stickmanReady, setPose, setVideo } = useEstimations({ threeReady, scene })
const loading = not(and(detectorsReady, threeReady, stickmanReady))

onThreeReady(({ scene: sobj }) => {
  set(scene, sobj)
  set(threeReady, true)
})

tickLoop(async () => {
  await Promise.all(
    videos.map(async v => {
      const el = document.querySelector<HTMLVideoElement>(`#${v.id}`)!
      if (el.isPlaying && v.estimatePoses) {
        const pose = await estimatePoses(el, v.model)
        setPose(v.id, pose)
      }
    })
  )
})

whenever(loading, pauseTickLoop)
whenever(not(loading), resumeTickLoop)
</script>
