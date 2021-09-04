<template lang="pug">
Title Playback pose

//- .debug(v-if="state.keypoints") {{state.keypoints}}
StickmanSimple(:keypoints="state.keypoints" :width="5")

.grid
  video.player(
    ref="videoRef"
    :src="localFilename(state.src)"
    v-visible="state.showHtmlVideo"
    preload="auto"
    controls
    muted)

  //- .time ⌚ {{state.currentTime}}s
  .time
    font-awesome-icon(:icon="['fat', 'timer']")
    | {{state.currentTime}}s
  Timeline(
    @time="t => state.currentTime = t"
    :duration="state.video?.duration || 0")

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
import { localFilename } from "../../misc/videos"

const toast = useToast()
const { db } = useSupabase({ logger: toast })
const { dlStats } = useStats()
const threeJs = useThreeJSEventHook()
threeJs.trigger(doRenderAllFrames)

const videos = await db.getVideos()

interface State {
  src: string
  poseType: PoseType
  video?: SBVideo
  poses?: SBPose[]
  keypoints?: Keypoint[]
  currentTime: number
  showHtmlVideo: boolean
}

const state = reactive<State>({
  src: "", // videos[0].filename,
  poseType: PoseType.Normalized,
  currentTime: 0,
  showHtmlVideo: true,
})

const videoRef = ref()
const { currentTime } = useMediaControls(videoRef)
biSyncRef(currentTime, toRef(state, "currentTime"))

const gui = useGui({ close: false })
const folder = gui.addFolder("Playback recorded poses of video")
folder.add(state, "src", ["", ...videos.map(v => v.filename)]).name("Select video to load")
folder.add(state, "poseType", poseTypeOptions).name("Active pose type")
folder.add(state, "showHtmlVideo").name("Show HTML video")
folder.open()

// function

watchEffect(async () => {
  state.video = undefined
  state.poses = undefined
  state.keypoints = undefined
  if (state.src !== "") {
    state.video = videos.find(v => v.filename === state.src)
    if (state.video !== undefined) {
      try {
        state.poses = await db.getPoses(state.video.id, state.poseType)
      } catch (e) {
        // @ts-ignore
        toast.warning(e.message)
        return
      }
      state.currentTime = -1
      state.currentTime = 0
    }
  }
})

watch(
  () => state.currentTime,
  async t => {
    if (t < 0 || state.poses === undefined) return

    const pose = closestPoseInTime(state.poses, t)
    try {
      await dlStats(async () => {
        state.keypoints = await db.getKeypoints(pose.id)
      })
    } catch (e) {
      state.keypoints = undefined
      // @ts-ignore
      toast.error(e.message)
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
  inset: 0;
  /* inset: 2rem 1.5rem; */
  display: grid;
  gap: 2px;
  overflow: hidden;

  grid-template-columns: 100px 1fr;
  grid-template-rows: 1fr 39px min-content;
  grid-auto-flow: row;
}

.player {
  /* place-self: center; */
  align-self: end;
  grid-column: 1 / 3;
  min-height: 100px;
  max-height: calc(100vh - 350px);
  /* aspect-ratio: var(--ratio, 1); */
}

.time {
  color: #f7f2e7;
  background-color: #3a3b3b;
  /* text-align: center; */
  line-height: 38px;
  letter-spacing: 1px;
}

.time svg {
  margin: 0 8px;
}

.grid > *:nth-child(n + 4) {
  height: 100px;
}
</style>
