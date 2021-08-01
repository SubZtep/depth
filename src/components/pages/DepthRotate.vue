<template lang="pug">
Title Depth

</template>

<script lang="ts" setup>
import { useToast } from "vue-toastification"
import { useMediaControls, biSyncRef, useDevicesList } from "@vueuse/core"
import { useThreeJSEventHook, doRenderAllFrames } from "../../packages/ThreeJS"
import { PoseType, poseTypeOptions, closestPoseInTime, useBlazePose } from "../../packages/PoseAI"
// import { useStats } from "../../packages/Stats"
// import { useGui } from "../../packages/datGUI"

// const { videoInputs } = useDevicesList({ requestPermissions: true })
// const { estimatePose } = useBlazePose({
//   video
// })

// const toast = useToast()
// const { dlStats } = useStats()
// const threeJs = useThreeJSEventHook()
// threeJs.trigger(doRenderAllFrames)

// interface State {
//   poseType: PoseType
//   currentTime: number
//   showHtmlVideo: boolean
// }

// const state = reactive<State>({
//   poseType: PoseType.Normalized,
//   currentTime: 0,
//   showHtmlVideo: true,
// })

// const gui = useGui({ close: false })
// const folder = gui.addFolder("Playback recorded poses of video")
// // folder.add(state, "src", ["", ...videos.map(v => v.filename)]).name("Select video to load")
// // folder.add(state, "poseType", poseTypeOptions).name("Active pose type")
// // folder.add(state, "showHtmlVideo").name("Show HTML video")
// folder.open()

// onBeforeUnmount(() => {
//   gui.removeFolder(folder)
// })
</script>
