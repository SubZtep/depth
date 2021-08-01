<template lang="pug">
Title Depth

MathHead(:keypoints="keypoints" :position="[0, 5, 0]" :width="10")
</template>

<script lang="ts" setup>
import type { PropType } from "vue"
import type { LandmarkList } from "../../../public/pose"
import { useDevicesList, useUserMedia, get, set, whenever, and, not, useIntervalFn, until } from "@vueuse/core"
import { BLAZEPOSE_KEYPOINTS } from "../../misc/constants"
import { useBlazePose } from "../../packages/PoseAI"
import { selectableMedias } from "../../misc/utils"
import { useGui } from "../../packages/datGUI"

interface State {
  videoDeviceId: string
}

const state = reactive<State>({
  videoDeviceId: "",
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
    const res = await estimatePose()
    if (res.poseLandmarks) {
      const horizontalFlippedHeadOnly = res.poseLandmarks.slice(BLAZEPOSE_KEYPOINTS.indexOf("nose"), BLAZEPOSE_KEYPOINTS.indexOf("mouth_right")).map(v => ({ ...v, y: 1 - v.y }))
      set(keypoints, horizontalFlippedHeadOnly)
    }
  },
  60,
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

onMounted(async () => {
  await until(video).not.toBeNull()
  watchEffect(() => (get(video).srcObject = media.stream.value || null))
})

onBeforeUnmount(() => {
  gui.removeFolder(folder)
})
</script>
