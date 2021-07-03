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

//- Skeleton(
  :pose="pose"
  :videoWidth="videoWidth"
  :videoHeight="videoHeight"
  :scale="scale"
  :zMulti="opts.zMulti")
</template>

<script lang="ts" setup>
import type { Ref } from "vue"
import { reactive, inject, provide, ref, toRef } from "vue"
import { useDevicesList, set, invoke, until, get } from "@vueuse/core"
import { Group } from "three"
import { scene } from "../../composables/useThreeJs"
import { useBlazePose } from "../../composables/useBlazePose"
import { div, selectableMedias } from "../../misc/utils"

const emit = defineEmits(["loaded"])
const playbackRef: Ref<HTMLVideoElement | undefined> = ref()
const setPlayback = (ref: Ref<HTMLVideoElement | undefined>) => set(playbackRef, ref.value)
const { videoInputs } = useDevicesList({ requestPermissions: true })
const { pose, ready } = useBlazePose({ el: playbackRef })

const opts = reactive({
  videoDeviceId: "", //get<MediaDeviceInfo[]>(videoInputs)[0]?.deviceId ?? "",
  src: "",
  showHtmlPlayer: false,
  scenePlayerOpacity: .69,
  width: 4,
  zMulti: 250,
  keypointLimit: 33,
})

const folder = inject<dat.GUI>("gui")!.addFolder("Pose group")
folder.addReactiveSelect(opts, "videoDeviceId", selectableMedias(videoInputs)).name("Device input")
folder.add(opts, "src", ["", "happy.webm", "mask.webm", "yoga1.webm", "yoga2.webm", "ph/26958781a.webm"]).name("File input")
folder.add(opts, "showHtmlPlayer").name("Show ⍃video⍄")
folder.add(opts, "scenePlayerOpacity", 0, 1, 0.01).name("Scene player opacity")
folder.add(opts, "width", 0.1, 10, 0.1).name("Width (metre)")
folder.add(opts, "zMulti", 1, 1000, 1).name("Z-Axis multiplier")
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
  emit("loaded")
})
</script>
