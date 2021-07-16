<template lang="pug">
Title Pose group

//- pre OPTS {{opts}}

MediaInput(
  v-if="opts.videoDeviceId"
  :videoDeviceId="opts.videoDeviceId"
  @play="setPlaybackRef"
  @pause="playing = false"
  v-visible="opts.showHtmlPlayer")

VideoFileInput(
  v-if="opts.src"
  :src="opts.src"
  @play="setPlaybackRef"
  @pause="playing = false"
  v-visible="opts.showHtmlPlayer")

CanvasInScene(
  :playing="playing"
  :results="results"
  :parent="root")

//- Stickman(
  v-if="opts.keypointLimit && (opts.videoDeviceId || opts.src)"
  :results="results"
  :playing="playing"
  :position="[3, 0, 3]"
  :width="opts.width"
  :zMulti="opts.zMulti"
  :keypointLimit="opts.keypointLimit")
</template>

<script lang="ts" setup>
import type { Ref } from "vue"
import { Group } from "three"
import { useDevicesList, set, invoke, until, get } from "@vueuse/core"
import { useBlazePose } from "../../packages/PoseAI/useBlazePose"
import { selectableMedias, selectableVideos } from "../../misc/utils"
import { useGui } from "../../packages/datGUI/plugin"
import { loopFnPrs, singleFns } from "../../packages/ThreeJS/useRenderLoop"
import { useThreeJSEventHook } from "../../packages/ThreeJS/plugin"
import { useLocalGroup } from "../../packages/ThreeJS/useLocalGroup"
import { pauseLoop, resumeLoop, doRenderAllFrames, dontRenderAllFrames } from "../../packages/ThreeJS/constants"

const threeJs = useThreeJSEventHook()
let playbackRef: Ref<HTMLVideoElement | undefined> = ref()
let playing = ref(false)

const setPlaybackRef = (ref: Ref<HTMLVideoElement>) => {
  set(playbackRef, get(ref))
  set(playing, true)
}

const { videoInputs } = useDevicesList({ requestPermissions: true })
const { results, detectorReady, estimatePose } = useBlazePose(playbackRef)

const opts = reactive({
  videoDeviceId: "",
  src: "",
  width: 4,
  zMulti: 250,
  keypointLimit: 33,
  showHtmlPlayer: false,
  scenePlayerOpacity: 0.69,
})

const btns = {
  record() {
    console.log("RECORD")
  },
  realTime() {
    console.log("REALTIME")
  },
}

const gui = useGui()
const folder = gui.addFolder("Pose group")
const resetDevice = () => (opts.videoDeviceId = "" && folder.updateDisplay())
const resetFile = () => (opts.src = "" && folder.updateDisplay())
folder.addReactiveSelect(opts, "videoDeviceId", selectableMedias(videoInputs)).name("Device input").onChange(resetFile)
folder.add(opts, "src", selectableVideos()).name("File input").onChange(resetDevice)
folder.add(opts, "showHtmlPlayer").name("Show ⍃video⍄")

folder.add(btns, "record").name("✍ Record")
folder.add(btns, "realTime").name("👣 Real Time")

folder.add(opts, "scenePlayerOpacity", 0, 1, 0.01).name("Scene player opacity")
folder.add(opts, "width", 0.1, 10, 0.1).name("Width (metre)")
folder.add(opts, "zMulti", 1, 1000, 1).name("Z-axis multiplier")
folder.add(opts, "keypointLimit", 0, 33, 1).name("Visible keypoints")
folder.open()

const root = useLocalGroup()

invoke(async () => {
  threeJs.trigger(pauseLoop)
  await until(detectorReady).toBe(true)
  threeJs.trigger(resumeLoop)

  // watch(
  //   playing,
  //   isPlaying => {
  //     if (isPlaying) {
  //       loopFnPrs.add(estimatePose)
  //       threeJs.trigger(doRenderAllFrames)
  //     } else {
  //       threeJs.trigger(dontRenderAllFrames)
  //       loopFnPrs.delete(estimatePose)
  //     }
  //   },
  //   { immediate: true }
  // )
})

onBeforeUnmount(() => {
  loopFnPrs.delete(estimatePose)
  gui.removeFolder(folder)
})
</script>
