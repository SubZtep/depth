<template lang="pug">
Title Video Display Pose

Debug(v-if="!state.src") {{state}}

video(
  ref="video"
  :src="state.src"
  :class="$style.videoTag"
  v-visible="state.showVideoTag"
  v-css-aspect-ratio="`--video-aspect-ratio`"
  crossorigin="anonymous"
  controls
  muted)

VideoTimeline(
  v-if="state.src"
  v-model:estimatePose="state.estimatePose"
  :controls="controls"
  :ff="ff")

StickmanLandmarks(v-if="pose" :pose="pose")
</template>

<script lang="ts" setup>
import { useMediaControls } from "@vueuse/core"
import type { Results } from "public/pose"
import { useGuiFolder } from "~/packages/datGUI"
import { useFFmpeg } from "~/packages/FFmpeg/useFFmpeg"
import { useMediapipePose } from "~/packages/PoseAI"
import { useSupabase } from "~/packages/Supabase"
import { useVideoFiles } from "~/composables/useVideoFiles"
// import StickmanLandmarks from "../characters/StickmanLandmarks.vue"
import { pauseLoop, resumeLoop } from "~/packages/ThreeJS/constants"
import { useThreeJSEventHook } from "~/packages/ThreeJS/plugin"

const threeJs = useThreeJSEventHook()
const toast = useToast()
const { progress } = useNProgress()
const video = ref() as Ref<HTMLVideoElement>
const controls = useMediaControls(video)
const { db } = useSupabase()

const state = reactive({
  src: "",
  url: "",
  showVideoTag: false,
  estimatePose: false,
})

const ff = useFFmpeg({
  src: toRef(state, "src"),
  options: { progress: ({ ratio }) => set(progress, ratio), log: false },
  onKeypointsReady: () => void toast.info("Keypoints ready"),
})

const { estimatePose } = useMediapipePose({
  video,
  options: { modelComplexity: 2 },
  onDetectorReady: () => void toast.info("Pose detector ready"),
})

const pose = ref<Results>()

watchWithFilter(
  controls.currentTime,
  async () => {
    if (get(pose) === undefined) {
      toast.warning("First frame estimation can be quite slow")
      threeJs.trigger(pauseLoop)
      //FIXME: this is a hack to suspend three.js render for the first frame
      setTimeout(async () => {
        pose.value = await estimatePose()
        threeJs.trigger(resumeLoop)
      }, 50)
    } else {
      pose.value = await estimatePose()
    }
  },
  { eventFilter: invoke => state.estimatePose && invoke() }
)

whenever(toRef(state, "src"), async () => {
  const exists = await db.hasVideo(state.src)
  if (exists) {
    toast.info(`${state.src} exists in database`)
  } else {
    toast.warning(`${state.src} does not exist in database`)
  }
})

useGuiFolder(folder => {
  folder.name = "📼 FFmpeg"
  folder.add(state, "src", useVideoFiles().selectList()).name("Load video")
  folder.add(state, "url").name("Video URL")
  folder.add(state, "showVideoTag").name("Video tag")
})
</script>

<style module>
.videoTag {
  position: fixed;
  top: 0;
  right: 0;
  max-height: 40%;
  aspect-ratio: var(--video-aspect-ratio);
  border: 8px outset #964b00;
}
</style>
