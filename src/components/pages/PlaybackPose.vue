<template lang="pug">
Title Playback pose

.debug.miniScrollbar(v-if="state.showDebug")
  div Video: {{state.video}}
  div Normalized poses: {{state.poses.get(PoseType.Normalized)}}

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
import { useThreeJSEventHook, pauseLoop, resumeLoop } from "../../packages/ThreeJS"
import { useSupabase, PoseType } from "../../packages/Supabase"
import { useStats } from "../../packages/Stats"
import { useGui } from "../../packages/datGUI"
import { updateVideoTime } from "../../misc/utils"

const toast = useToast()
const { db } = useSupabase({ logger: toast })
useStats({ mosaic: false }).showPanel(2)
const threeJs = useThreeJSEventHook()
threeJs.trigger(pauseLoop)
toast.info("3D background paused due to heavy calculations on this page")
const videos = await db.getVideos()

interface State {
  /** loaded video url or empty string */
  src: string

  video?: SBVideo

  poses: Map<PoseType, SBPose[]>

  currentTime: number

  showDebug: boolean
}

const state = reactive<State>({
  src: videos[0].filename,
  showDebug: false,
  poses: new Map(),
  currentTime: 0,
})

const video = ref()

const gui = useGui()
gui.close()
const folder = gui.addFolder("Playback recorded poses of video")
folder.add(state, "src", ["", ...videos.map(v => v.filename)]).name("Select video to load")
folder.add(state, "showDebug").name("Show raw state values")
folder.open()

const loadPosesFromDb = async (src: string) => {
  state.video = videos.find(v => v.filename === src)
  if (state.video === undefined) return
  state.poses.set(PoseType.Normalized, await db.getPoses(state.video.id, PoseType.Normalized))
  state.poses.set(PoseType.Raw, await db.getPoses(state.video.id, PoseType.Raw))
  if (state.poses.get(PoseType.Normalized)?.length || 0 > 0 || state.poses.get(PoseType.Raw)?.length || 0 > 0) {
    toast.success("Video poses loaded")
  }
}

watch(
  () => state.src,
  async src => await loadPosesFromDb(src),
  { immediate: true }
)

watch(
  () => state.currentTime,
  async t => updateVideoTime(video, t)
)

onBeforeUnmount(() => {
  gui.removeFolder(folder)
  threeJs.trigger(resumeLoop)
})
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

.guiGrid > *:nth-child(n+4) {
  height: 100px;
}
</style>
