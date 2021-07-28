<template lang="pug">
Title Playback pose

.debug(v-if="state.activeKeypoints") {{state.activeKeypoints}}

.guiGrid
  video.player(
    ref="video"
    :src="state.src"
    preload="auto"
    controls)

  .time {{state.currentTime}}s
  Timeline(
    @time="t => state.currentTime = t"
    :duration="state.video?.duration || 0")

  template(v-for="[poseType, poses] in state.poses.entries()" :key="poseType")
    PoseSlotHeader(:poses="poses" :poseType="poseType")
    PoseSlot(:poses="poses" :poseType="poseType")
</template>

<script lang="ts" setup>
import { useToast } from "vue-toastification"
import { useMediaControls, biSyncRef } from "@vueuse/core"
import { useThreeJSEventHook, pauseLoop, resumeLoop } from "../../packages/ThreeJS"
import { useSupabase } from "../../packages/Supabase"
import { PoseType, poseTypeName } from "../../packages/PoseAI"
import { useStats } from "../../packages/Stats"
import { useGui } from "../../packages/datGUI"
// import { updateVideoTime } from "../../misc/utils"
import { useNProgress } from "@vueuse/integrations/useNProgress"
// import Stats from "stats.js"

// const stats = useStats()
// let dstat = stats.addPanel(new Stats.Panel("dl/pose", "#ffff00", "#000000"))



const { start, done } = useNProgress()
const toast = useToast()
const { db } = useSupabase({ logger: toast })
useStats({ mosaic: false }).showPanel(2)
const threeJs = useThreeJSEventHook()
// threeJs.trigger(pauseLoop)
// toast.info("3D background paused due to heavy calculations on this page")
const videos = await db.getVideos()

interface State {
  /** loaded video url or empty string */
  src: string

  video?: SBVideo

  poses: Map<PoseType, SBPose[]>

  /** keypoints by pose id */
  keypoints: Map<number, Keypoint[]>

  activeKeypoints?: Keypoint[]

  currentTime: number

  poseType: PoseType
}

const state = reactive<State>({
  src: videos[0].filename,
  video: videos.find(v => v.filename === videos[0].filename),
  poses: new Map(),
  keypoints: new Map(),
  currentTime: 0,
  poseType: PoseType.Normalized
})

const video = ref()
const { currentTime } = useMediaControls(video)
biSyncRef(currentTime, toRef(state, "currentTime"))

const gui = useGui()
// gui.close()
const folder = gui.addFolder("Playback recorded poses of video")
folder.add(state, "src", ["", ...videos.map(v => v.filename)]).name("Select video to load")
folder.add(state, "poseType", poseTypeOptions).name("Active pose type")
folder.open()

const loadPosesFromDb = async (src: string) => {
  start()
  state.video = videos.find(v => v.filename === src)
  if (state.video === undefined) return

  // TODO: check why lot of keypoints are missing, memory issue?
  // let poses: SBPose[]
  // let keypoints: Keypoint[]
  // for (const poseType of [PoseType.Normalized, PoseType.Raw]) {
  //   poses = await db.getPoses(state.video.id, poseType)
  //   // poses.sort((a, b) => a.time - b.time)
  //   // keypoints = await db.getKeypoints(poses.map(v => v.id))
  //   // poses.forEach(({ id }) => {
  //   //   // console.log("WWERWEWERWEWERWERWREWRE", keypoints.filter(v => v.pose_id === id))
  //   //   state.keypoints.set(
  //   //     id,
  //   //     keypoints.filter(v => v.pose_id === id)
  //   //   )
  //   // })
  //   state.poses.set(poseType, poses)
  // }
  done()
  //toast.success("Video poses loaded")
}

watch(
  () => state.poseType,
  async type => {
    if (state.video && !state.poses.has(type)) {
      state.poses.set(type, await db.getPoses(state.video.id, type))
    }
  },
  { immediate: true }
)

watch(
  () => state.src,
  async src => await loadPosesFromDb(src),
  { immediate: true }
)

watch(
  () => state.currentTime,
  async t => {

    // @ts-ignore
    // dstat?.begin()

    const closestPose = state.poses.get(state.poseType)?.reduce(closestTimeReducer(state), { time: 0 }) as SBPose
    console.log("QQQ", [closestPose, state.poses])

    try {
      state.activeKeypoints = await db.getKeypoints(closestPose.id)
    } catch (e) {
      state.activeKeypoints = undefined
      console.error(e)
    }

    // @ts-ignore
    // dstat.end()

    // await updateVideoTime(video, t) // no need until bisyncref is present
  }
)

onBeforeUnmount(() => {
  gui.removeFolder(folder)
  threeJs.trigger(resumeLoop)
})
</script>

<script lang="ts">
type PoseForTime = Pick<SBPose, "time">
const closestTimeReducer = (state: State) => (prev: PoseForTime, curr: PoseForTime) => (Math.abs(curr.time - state.currentTime) < Math.abs(prev.time - state.currentTime) ? curr : prev)

const poseTypeOptions = { [poseTypeName(PoseType.Normalized)]: PoseType.Normalized, [poseTypeName(PoseType.Raw)]: PoseType.Raw }
</script>

<style scoped>
.guiGrid {
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

.guiGrid > *:nth-child(n + 4) {
  height: 100px;
}
</style>
