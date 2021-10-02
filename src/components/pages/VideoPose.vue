<template lang="pug">
Title Video Display Pose

video(
  ref="video"
  :src="state.src"
  @error="onVideoError"
  :class="$style.videoTag"
  v-visible="state.showVideoTag"
  v-css-aspect-ratio="`--video-aspect-ratio`"
  crossorigin="anonymous"
  controls
  muted)

VideoTimeline(
  v-if="state.src && ff.ffmpeg.isLoaded()"
  v-model:estimatePose="state.estimatePose"
  :controls="controls"
  :ff="ff")

StickmanLandmarks(v-if="pose" :pose="pose")
</template>

<script lang="ts" setup>
import { useMediaControls } from "@vueuse/core"
import type { Results } from "public/pose"
import { useGuiFolder } from "~/packages/datGUI"
import { useFFmpeg } from "~/packages/FFmpeg"
import { useMediapipePose } from "~/packages/PoseAI"
import { useSupabase } from "~/packages/Supabase"
// import StickmanLandmarks from "../characters/StickmanLandmarks.vue"
import { pauseLoop, resumeLoop } from "~/packages/ThreeJS/constants"
import { useThreeJSEventHook } from "~/packages/ThreeJS/plugin"
import settings from "~/../SETTINGS.toml"
import { basename } from "~/misc/utils"

const threeJs = useThreeJSEventHook()
const toast = useToast()
const { progress } = useNProgress()
const video = ref() as Ref<HTMLVideoElement>
const controls = useMediaControls(video)
const { db } = useSupabase()

const videos = ref(Object.fromEntries(settings.video?.clips?.map(url => [basename(url, false), url]) ?? []))

const state = reactive({
  src: settings.video?.clips?.[0] ?? "",
  showVideoTag: true,
  estimatePose: false,
})

const onVideoError = () => {
  delete get(videos)[state.src]
  toast.error(`${state.src} load error`)
  const srcs = Object.values(get(videos))
  state.src = srcs.length > 0 ? srcs[0] : ""
}

const ff = await useFFmpeg({
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
  folder.addReactiveSelect(state, "src", videos).name("Load video")
  const url = folder.add({ url: "" }, "url").name("Video URL").onFinishChange(v => {
    if (v) {
      (get(videos))[basename(v, false)] = v
      url.setValue("")
      state.src = v
    }
  })
  url.domElement.querySelector("input")!.placeholder = "blur to add"
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
