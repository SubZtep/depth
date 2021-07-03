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
  v-if="opts.showScenePlayer"
  :el="playbackRef"
  :videoWidth="videoWidth"
  :videoHeight="videoHeight"
  :width="opts.width")

Stickman(
  :pose="pose"
  :videoWidth="videoWidth"
  :videoHeight="videoHeight"
  :scale="scale"
  :zMulti="opts.zMulti")
</template>

<script lang="ts" setup>
import type { Ref } from "vue"
import { reactive, inject, provide, ref, toRef } from "vue"
import { useDevicesList, set, invoke, until } from "@vueuse/core"
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
  videoDeviceId: "",
  src: "",
  showHtmlPlayer: true,
  showScenePlayer: true,
  width: 1,
  zMulti: 500,
})

const folder = inject<dat.GUI>("gui")!.addFolder("Pose Group")
folder.addReactiveSelect(opts, "videoDeviceId", selectableMedias(videoInputs)).name("Device Input")
folder.add(opts, "src", ["", "happy.webm", "mask.webm"]).name("File Input")
folder.add(opts, "showHtmlPlayer").name("Show HTML Player")
folder.add(opts, "showScenePlayer").name("Show Scene Player")
folder.add(opts, "width", 0.1, 10, 0.1).name("Width (metre)")
folder.add(opts, "zMulti", 1, 1000, 1).name("Z-Axis Multiplier")
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
