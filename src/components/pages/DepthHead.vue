<template lang="pug">
Title Depth

MathHead(
  :keypoints="keypoints"
  :position-y="state.positionY"
  :scale="state.scale"
  :z-multi="state.zMulti"
  :rotation-y="state.rotationY")
</template>

<script lang="ts" setup>
import type { PropType } from "vue"
import type { LandmarkList } from "../../../public/pose"
import { useDevicesList, useUserMedia, get, set, whenever, and, not, useIntervalFn, until } from "@vueuse/core"
import { useBlazePose } from "../../packages/PoseAI"
import { selectableMedias, flipHorizontal, headOnly } from "../../misc/utils"
import { useGui } from "../../packages/datGUI"

const state = reactive<DepthHeadState>({
  videoDeviceId: "",
  positionY: 5,
  scale: 10,
  zMulti: 1,
  rotationY: 0,
  detectionFps: 30,
})

const videoDeviceId = toRef(state, "videoDeviceId")
const { videoInputs } = useDevicesList({ requestPermissions: true })
const media = useUserMedia({ videoDeviceId, audioDeviceId: false, autoSwitch: true, enabled: false })
const props = defineProps({ video: { type: Object as PropType<Ref<HTMLVideoElement>>, required: true } })
const { video } = toRefs(props)
const { estimatePose, detectorReady } = useBlazePose({ video, options: { modelComplexity: 2 } })
const keypoints = ref<LandmarkList>([])

const { pause, resume } = useIntervalFn(
  async () => {
    console.log("TIME", Date.now())
    // const res = await estimatePose()
    // if (res.poseLandmarks) {
    //   set(keypoints, headOnly(res.poseLandmarks).map(flipHorizontal))
    // }
  },
  Math.round(1000 / state.detectionFps),
  { immediate: false }
)

whenever(and(detectorReady, media.enabled), () => resume())
whenever(not(media.enabled), () => pause())

const gui = useGui()
const folder = gui.addFolder("Depth")
folder.open()
folder.addReactiveSelect(state, "videoDeviceId", selectableMedias(videoInputs)).name("Device input")
folder.add(media, "start").name("Start camera")
folder.add(media, "stop").name("Stop camera")
folder.add(state, "positionY", 0, 30, 0.1).name("Y position")
folder.add(state, "scale", 0, 20, 0.01).name("Scale distance")
folder.add(state, "zMulti", 0, 5, 0.01).name("Z multiplier")
folder.add(state, "rotationY", 0, 2 * Math.PI, 0.01).name("Y rotation")
folder.add(state, "detectionFps", 0, 60, 1).name("Detection FPS")


onMounted(async () => {
  await until(video).not.toBeNull()
  watchEffect(() => (get(video).srcObject = media.stream.value || null))
})

onBeforeUnmount(() => {
  gui.removeFolder(folder)
})
</script>
