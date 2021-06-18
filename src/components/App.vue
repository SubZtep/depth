<template lang="pug">
.loading(v-show="loading") Loading...

.videoGrid
  VideoPlayer(
    v-for="p in piles"
    :key="p.id"
    :pid="p.id"
    @pause="")
    //- @playing="setVideo"

canvas(ref="canvasRef")
</template>

<script lang="ts" setup>
import { onMounted, ref } from "vue"
import { useGlobalState } from "../store"
import { and, not, whenever, set } from "@vueuse/core"
import { useThreeJs } from "../composables/useThreeJs"
// import { useEstimations } from "../composables/useEstimations"
// import { usePose } from "../composables/usePose"

const canvasRef = ref<HTMLCanvasElement>()
const { onThreeReady, tickLoop, pauseTickLoop, resumeTickLoop } = useThreeJs(canvasRef)
const threeReady = ref(false)

const loading =  not(and(threeReady)) // not(and(detectorsReady, threeReady, stickmanReady))
// const { estimatePoses, ready: detectorsReady } = usePose()
// const { videos } = useGlobalState()
const { piles } = useGlobalState()

// const scene = ref<THREE.Scene>()
// const { stickmanReady, setPose, setVideo } = useEstimations({ threeReady, scene })

onThreeReady(({ scene: _sobj }) => {
  // set(scene, sobj)
  set(threeReady, true)
})

tickLoop(async () => {
  // console.log(piles)
  // await Promise.all(
  //   videos.filter(v => v.estimatePoses).map(async v => {
  //     const el = document.querySelector<HTMLVideoElement>(`#${v.id}`)!
  //     if (el.isPlaying) {
  //       const pose = await estimatePoses(el, v.model)
  //       setPose(v.id, pose)
  //     }
  //   })
  // )
})

whenever(loading, pauseTickLoop)
whenever(not(loading), resumeTickLoop)
</script>
