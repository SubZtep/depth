<template lang="pug">
Title Playback pose

//- .debug(v-if="state.keypoints") {{state.keypoints}}

StickmanSimple(:keypoints="state.keypoints" :width="5")

.grid
  video.player(ref="videoRef" :src="videos[0].filename" preload="auto" controls v-visible="state.showHtmlVideo")

  .time ⌚ {{state.currentTime}}s
  Timeline(
    @time="t => state.currentTime = t"
    :duration="video?.duration || 0")

  PoseSlotHeader(:poses="state.poses" :poseType="state.poseType")
  PoseSlot(:poses="state.poses" :poseType="state.poseType")
</template>

<script lang="ts" setup>
import { useToast } from "vue-toastification"
import { useMediaControls, biSyncRef } from "@vueuse/core"
import { useThreeJSEventHook, doRenderAllFrames } from "../../packages/ThreeJS"
import { useSupabase } from "../../packages/Supabase"
import { PoseType, poseTypeOptions, closestPoseInTime } from "../../packages/PoseAI"
import { useStats } from "../../packages/Stats"
import { useGui } from "../../packages/datGUI"

const toast = useToast()
const { db } = useSupabase({ logger: toast })
const { dlStats } = useStats()
const threeJs = useThreeJSEventHook()
threeJs.trigger(doRenderAllFrames)
const videos = await db.getVideos()
const video = videos.find(v => v.filename === videos[0].filename)

interface State {
  poses: SBPose[]
  keypoints?: Keypoint[]
  currentTime: number
  poseType: PoseType
  showHtmlVideo: boolean
}

const state = reactive<State>({
  // src: videos[0].filename,
  poses: await db.getPoses(video?.id, PoseType.Normalized),
  currentTime: 0,
  poseType: PoseType.Normalized,
  showHtmlVideo: true,
})

const videoRef = ref()
const { currentTime } = useMediaControls(videoRef)
biSyncRef(currentTime, toRef(state, "currentTime"))

const gui = useGui({ close: true })
const folder = gui.addFolder("Playback recorded poses of video")
// folder.add(state, "src", ["", ...videos.map(v => v.filename)]).name("Select video to load")
folder.add(state, "poseType", poseTypeOptions).name("Active pose type")
folder.add(state, "showHtmlVideo").name("Show HTML video")
folder.open()

watch(
  () => state.currentTime,
  async t => {
    const pose = closestPoseInTime(state.poses, t)
    try {
      await dlStats(async () => {
        state.keypoints = await db.getKeypoints(pose.id)
      })
    } catch (e) {
      state.keypoints = undefined
      toast.error(e.message)
      // console.error(e)
    }
  }
)

onBeforeUnmount(() => {
  gui.removeFolder(folder)
})
</script>

<style scoped>
.grid {
  position: fixed;
  inset: 2rem 1.5rem;
  display: grid;
  gap: 2px;
  overflow: hidden;

  grid-template-columns: 100px 1fr;
  grid-template-rows: 1fr 39px min-content;
  grid-auto-flow: row;
}

.player {
  place-self: center;
  grid-column: 1 / 3;
  min-height: 100px;
  max-height: calc(100vh - 350px);
  /* aspect-ratio: var(--ratio, 1); */
}

.time {
  color: #f7f2e7;
  background-color: #3a3b3b;
  text-align: center;
  line-height: 38px;
  letter-spacing: 1px;
}

.grid > *:nth-child(n + 4) {
  height: 100px;
}
</style>
