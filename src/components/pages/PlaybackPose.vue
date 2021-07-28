<template lang="pug">
Title Playback pose

.debug.miniScrollbar(v-if="state.showDebug")
  div Video: {{state.video}}
  div Normalized poses: {{state.poses.get(PoseType.Normalized)}}

.guiGrid
  video.player(
    ref="video"
    height="100"
    :src="state.src"
    controls)

  Timeline.tracks(
    v-if="state.video"
    :duration="state.video.duration"
    @time="t => updateVideoTime(video, t)")
    //- Poseline(
      v-if="state.poses.has(PoseType.Normalized)"
      :poses="state.poses.get(PoseType.Normalized)")

</template>

<script lang="ts" setup>
import { useToast } from "vue-toastification"
import { useSupabase } from "../../packages/Supabase/plugin"
import { useGui } from "../../packages/datGUI"
import { useStats } from "../../packages/Stats"
import { useThreeJSEventHook, pauseLoop, resumeLoop } from "../../packages/ThreeJS"
import { updateVideoTime } from "../../misc/utils"
import { PoseType } from "../../packages/Supabase"

const toast = useToast()
const { db } = useSupabase({ logger: toast })
useStats({ mosaic: false }).showPanel(2)
const threeJs = useThreeJSEventHook()
threeJs.trigger(pauseLoop)
// toast.info("3D background paused due to heavy calculations on this page")
const videos = await db.getVideos()

interface State {
  /** loaded video url or empty string */
  src: string

  showDebug: boolean

  video?: SBVideo

  poses: Map<PoseType, SBPose[]>
}

const state = reactive<State>({
  src: videos[0].filename,
  showDebug: false,
  poses: new Map(),
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
    // toast.success("Video poses loaded")
  }
}

watch(
  () => state.src,
  async src => await loadPosesFromDb(src),
  { immediate: true }
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
  gap: 4px;
  grid-template-areas:
    "player"
    "timeline";
}

.player {
  place-self: center;
}

.tracks {
  grid-area: timeline;
  align-self: end;
}
</style>
.
