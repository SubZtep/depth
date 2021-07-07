<template lang="pug">
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
  :results="results")

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
import { Group } from "three"
import { onBeforeUnmount, reactive, inject, provide, ref, watch } from "vue"
import { useDevicesList, set, invoke, until, get } from "@vueuse/core"
import { useBlazePose } from "../../composables/useBlazePose"
import { selectableMedias } from "../../misc/utils"
import { VIDEOS } from "../../misc/constants"
import { useGui } from "../../plugins/datGUI"

let playbackRef: Ref<HTMLVideoElement | undefined> = ref()
let playing = ref(false)

const setPlaybackRef = (ref: Ref<HTMLVideoElement>) => {
  set(playbackRef, get(ref))
  set(playing, true)
}

const { videoInputs } = useDevicesList({ requestPermissions: true })
const { results, ready, estimatePose } = useBlazePose(playbackRef)

const gui = useGui()
const scene = inject<THREE.Scene>("scene")!
const tickFns = inject<Set<TickFn>>("tickFns")!

const opts = reactive({
  videoDeviceId: "",
  src: "",
  showHtmlPlayer: false,
  scenePlayerOpacity: 0.69,
  width: 4,
  zMulti: 250,
  keypointLimit: 33,
})

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
scene.add(root)
provide("root", root)

invoke(async () => {
  await until(ready).toBeTruthy()

  watch(
    playing,
    isPlaying => {
      if (isPlaying) {
        tickFns.add(estimatePose)
      } else {
        tickFns.delete(estimatePose)
      }
    },
    { immediate: true }
  )
})

onBeforeUnmount(() => {
  tickFns.delete(estimatePose)
  gui.removeFolder(folder)
})
</script>
