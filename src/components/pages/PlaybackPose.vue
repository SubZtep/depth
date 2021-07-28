<template lang="pug">
Title Playback pose

.debug.miniScrollbar(v-if="opts.showDebug")
  div Video: {{state.video}}
  div Normalized poses: {{state.poses.get(PoseType.Normalized)}}

div(:class="$style.grid")
  video(
    ref="video"
    :src="opts.src"
    :class="$style.player")

  Timeline(
    v-if="state.video"
    :class="$style.timeline"
    :length="state.video.duration"
    @time="t => updateVideoTime(video, t)")
    Poseline(
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

interface State {
  video?: Required<Pick<Video, "id" | "filename" | "width" | "height" | "duration">>
  poses: Map<PoseType, Required<Pick<Pose, "id" | "time">[]>>
}

const state = reactive<State>({
  poses: new Map()
})

const threeJs = useThreeJSEventHook()
threeJs.trigger(pauseLoop)

useStats({ mosaic: false }).showPanel(2)

const toast = useToast()
const { db } = useSupabase({ logger: toast })

const videos = await db.getVideos()
const opts = reactive({
  src: "",
  showDebug: true,
})

const gui = useGui()
const folder = gui.addFolder("🧼☭ Video pose")
folder.add(opts, "src", ["", ...videos.map(v => v.filename)]).name("File input")
folder.add(opts, "showDebug").name("Show state debug")
folder.open()


const video = ref()

onMounted(() => {
  opts.src = videos[0].filename
  gui.updateDisplay()
})

watch(
  () => opts.src,
  async src => {
    state.video = videos.find(v => v.filename === src)
    if (state.video) {
      state.poses.set(PoseType.Normalized, await db.getPoses(state.video.id, PoseType.Normalized))
    }
  },
  { immediate: true }
)

onBeforeUnmount(() => {
  gui.removeFolder(folder)
  threeJs.trigger(resumeLoop)
})
</script>

<style module>
.grid {
  position: fixed;
  inset: 2rem 1.5rem;
  border: 3px double #6913;
  display: grid;
  grid-template-rows: 1fr 130px;
  grid-template-areas:
    "player"
    "timeline";
}

.player {
  grid-area: player;
  align-self: center;
  justify-self: center;
}

.timeline {
  grid-area: timeline;
  align-self: end;
}
</style>
