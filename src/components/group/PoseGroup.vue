<template lang="pug">
MediaInput(v-if="opts.videoDeviceId" :videoDeviceId="opts.videoDeviceId" v-visible="opts.showDevice" @dimensions="setDimensions" @updated="setPlayback")
VideoFileInput(v-if="opts.src" :src="opts.src" v-visible="opts.showSrc" @dimensions="setDimensions" @updated="setPlayback")
PlaybackInScene(:el="playbackRef" :videoWidth="videoWidth" :videoHeight="videoHeight" :width="opts.width")

PoseDetector(v-if="opts.poseDetector" :el="playbackRef" :pose="pose" :immediate="false")
Stickman(:pose="pose" :videoWidth="videoWidth" :videoHeight="videoHeight" :scale="scale" :zMulti="opts.zMulti")
</template>

<script lang="ts" setup>
import type { Ref } from "vue"
import type { Pose } from "@tensorflow-models/pose-detection"
import { reactive, onMounted, inject, provide, ref, onErrorCaptured } from "vue"
import { useDevicesList, set } from "@vueuse/core"
import { Group } from "three"
import { scene } from "../../composables/useThreeJs"
import { div, selectableMedias } from "../../misc/utils"

const pose: Pose = reactive({ keypoints: [] })

const opts = reactive({
  videoDeviceId: "",
  showDevice: true,
  src: "",
  showSrc: true,
  poseDetector: false,
  width: 1,
  zMulti: 500,
})

const { videoInputs } = useDevicesList({ requestPermissions: true })

const folder = inject<dat.GUI>("gui")!.addFolder("Pose Group")
folder.addReactiveSelect(opts, "videoDeviceId", selectableMedias(videoInputs)).name("Video Device")
folder.add(opts, "showDevice").name("Show Device Input")
folder.add(opts, "src", ["", "happy.webm", "mask.webm"]).name("Video Device")
folder.add(opts, "showSrc").name("Show File Input")
folder.add(opts, "poseDetector").name("Pose Detector Active")
folder.add(opts, "width", 0.1, 10, 0.1).name("Scene Player Width")
folder.add(opts, "zMulti", 1, 1000, 1).name("Z-Axis Multiplier")

const root = new Group()
scene.add(root)
provide("root", root)

const videoWidth = ref(640)
const videoHeight = ref(480)
const scale = div(opts.width, videoWidth)

const playbackRef: Ref<HTMLVideoElement | undefined> = ref()
const setPlayback = (ref: Ref<HTMLVideoElement | undefined>) => set(playbackRef, ref.value)

const setDimensions = (v: InputDimensions) => {
  set(videoWidth, v.videoWidth)
  set(videoHeight, v.videoHeight)
}

onMounted(() => {
  folder.open()
})


// onErrorCaptured(e => {
//   console.log("EEE", e.message)
//   toast.error(e.message)
//   return false
// })
</script>
