<template lang="pug">
Title Video Display Pose

Debug {{pose}}

video(:src="state.src" crossorigin="anonymous" muted ref="video" controls v-visible="state.showVideoTag")

VideoTimeline(:video="video" :ff="ff" :controls="controls")

StickmanSimple(:keypoints="pose?.poseLandmarks" :width="3")
</template>

<script lang="ts" setup>
import { useMediaControls } from "@vueuse/core"
import type { Results } from "public/pose"
import { useGuiFolder } from "~/packages/datGUI"
import { useFFmpeg } from "~/packages/FFmpeg/useFF"
import { useMediapipePose } from "~/packages/PoseAI"
import { useSupabase } from "~/packages/Supabase"
import { useVideoFiles } from "~/composables/useVideoFiles"

const toast = useToast()
const { progress } = useNProgress()
const video = ref() as Ref<HTMLVideoElement>
const controls = useMediaControls(video)
const { db } = useSupabase()

const state = reactive({
  src: "",
  showVideoTag: false,
})

const ff = useFFmpeg({
  src: toRef(state, "src"),
  options: { progress: ({ ratio }) => set(progress, ratio), log: true },
  onKeypointsReady: () => void toast.info("Keypoints ready"),
})

const { estimatePose } = useMediapipePose({
  video,
  options: { modelComplexity: 2 },
  onDetectorReady: () => void toast.info("Pose detector ready")
})

const pose = ref<Results>()

watch(controls.currentTime, async () => {
  pose.value = await estimatePose()
})

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
  folder.add(state, "showVideoTag").name("Show video")
})
</script>

<style scoped>
video {
  position: fixed;
  top: 0;
  right: 0;
  max-width: 40%;
  max-height: 40%;
  border: 8px outset #964b00;
}
</style>
