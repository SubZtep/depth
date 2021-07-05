<template lang="pug">
MediaInput(
  v-if="opts.videoDeviceId"
  :videoDeviceId="opts.videoDeviceId"
  v-visible="opts.showHtmlPlayer"
  @dimensions="setDimensions"
  @updated="setPlayback")

VideoFileInput(
  v-if="opts.src"
  :src="opts.src"
  v-visible="opts.showHtmlPlayer"
  @dimensions="setDimensions"
  @updated="setPlayback")

PlaybackInScene(
  v-if="opts.scenePlayerOpacity > 0"
  :el="playbackRef"
  :videoWidth="videoWidth"
  :videoHeight="videoHeight"
  :width="opts.width"
  :opacity="opts.scenePlayerOpacity")

Stickman(
  v-if="opts.keypointLimit && (opts.videoDeviceId || opts.src)"
  :pose="pose"
  :videoWidth="videoWidth"
  :videoHeight="videoHeight"
  :scale="scale"
  :zMulti="opts.zMulti"
  :keypointLimit="opts.keypointLimit")
</template>

<script lang="ts" setup>
import type { Ref } from "vue"
import { Group } from "three"
import { reactive, inject, provide, ref, toRef, watch } from "vue"
import { useDevicesList, set, invoke, until, get } from "@vueuse/core"
import { useBlazePose } from "../../composables/useBlazePose"
import { div, selectableMedias } from "../../misc/utils"

const emit = defineEmits(["loaded"])
const playbackRef: Ref<HTMLVideoElement | undefined> = ref()
const setPlayback = (ref: Ref<HTMLVideoElement | undefined>) => set(playbackRef, ref.value)
const { videoInputs } = useDevicesList({ requestPermissions: true })
const { pose, ready, estimatePose } = useBlazePose({ el: playbackRef })
const videos = [
  "",
  "videos/happy.webm",
  "videos/mask.webm",
  "videos/yoga1.webm",
  "videos/yoga2.webm",
  "videos/26958781a.webm",
]

const gui = inject<dat.GUI>("gui")!
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
  .add(opts, "src", videos)
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

const videoWidth = ref(640)
const videoHeight = ref(480)
const scale = div(toRef(opts, "width"), videoWidth)

const setDimensions = (v: InputDimensions) => {
  set(videoWidth, v.videoWidth)
  set(videoHeight, v.videoHeight)
}

invoke(async () => {
  await until(ready).toBeTruthy()

  watch(
    playbackRef,
    elem => {
      if (elem === undefined) {
        tickFns.delete(estimatePose)
      } else {
        tickFns.add(estimatePose)
      }
    },
    { immediate: true }
  )

  emit("loaded")
})
</script>
