<template lang="pug">
Title Pose group
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

Stickman(
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
import { onBeforeUnmount } from "vue"
import { Group } from "three"
import { useDevicesList, set, invoke, until, get } from "@vueuse/core"
import { useBlazePose } from "../../packages/PoseAI/useBlazePose"
import { selectableMedias } from "../../misc/utils"
import { VIDEOS } from "../../misc/constants"
import { useGui } from "../../packages/datGUI/plugin"
import { loopFnPrs, singleFns } from "../../packages/ThreeJS/useRenderLoop"
import { useThreeJSEventHook } from "../../packages/ThreeJS/plugin"

const threeJsHook = useThreeJSEventHook()
let playbackRef: Ref<HTMLVideoElement | undefined> = ref()
let playing = ref(false)

const setPlaybackRef = (ref: Ref<HTMLVideoElement>) => {
  set(playbackRef, get(ref))
  set(playing, true)
}

const { videoInputs } = useDevicesList({ requestPermissions: true })
const { results, ready, estimatePose } = useBlazePose(playbackRef)

const opts = reactive({
  videoDeviceId: "",
  src: "",
  width: 4,
  zMulti: 250,
  keypointLimit: 33,
  showHtmlPlayer: false,
  scenePlayerOpacity: 0.69,
})

const gui = useGui()
const folder = gui.addFolder("Pose group")
folder
  .addReactiveSelect(opts, "videoDeviceId", selectableMedias(videoInputs))
  .name("Device input")
  .onChange(() => {
    opts.src = ""
    folder.updateDisplay()
  })
folder
  .add(opts, "src", ["", ...VIDEOS])
  .name("File input")
  .onChange(() => {
    opts.videoDeviceId = ""
    folder.updateDisplay()
  })
folder.add(opts, "showHtmlPlayer").name("Show ⍃video⍄")
folder.add(opts, "scenePlayerOpacity", 0, 1, 0.01).name("Scene player opacity")
folder.add(opts, "width", 0.1, 10, 0.1).name("Width (metre)")
folder.add(opts, "zMulti", 1, 1000, 1).name("Z-axis multiplier")
folder.add(opts, "keypointLimit", 0, 33, 1).name("Visible keypoints")
folder.open()

const root = new Group()

singleFns.add(({ scene }) => scene.add(root))

provide("root", root)

invoke(async () => {
  threeJsHook.trigger({ cmd: "pauseLoop" })
  await until(ready).toBeTruthy()
  threeJsHook.trigger({ cmd: "resumeLoop" })

  watch(
    playing,
    isPlaying => {
      if (isPlaying) {
        loopFnPrs.add(estimatePose.call)
      } else {
        loopFnPrs.delete(estimatePose.call)
      }
    },
    { immediate: true }
  )
})

onBeforeUnmount(() => {
  loopFnPrs.delete(estimatePose.call)
  singleFns.add(({ scene }) => scene.remove(root))
  gui.removeFolder(folder)
})
</script>
