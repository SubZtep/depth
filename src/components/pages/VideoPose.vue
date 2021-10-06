<template lang="pug">
Title Video Display Pose

.top-left.gap-6
  video.videoPlayer(
    ref="videoRef"
    :src="videoState.src"
    @error="loadError"
    @timeupdate="onTimeupdate"
    @loadedmetadata="setAttributes"
    v-css-aspect-ratio="`--video-aspect-ratio`"
    v-visible="state.showVideoTag"
    crossorigin="anonymous"
    controls
    muted)

  StepProgressBar(position="left" :items="progressItemsLeft")

.top-right.gap-6
  StepProgressBar(position="right" :items="progressItemsRight")
  StepProgressBar(position="right" :items="progressItemsRight")

StickmanNormalized(v-if="pose" :pose="pose" :position="[-2, 0, -10]")
</template>

<script lang="ts" setup>
import type { NormalizedLandmarkList } from "public/pose"
import type { VideoStatePose } from "~/stores/video"
import { useMediaControls } from "@vueuse/core"
import { useGuiFolder } from "~/packages/datGUI"
import { useFFmpeg } from "~/packages/FFmpeg"
import { useSupabase } from "~/packages/Supabase"
import { useMediapipePose } from "~/packages/PoseAI"
import { useThreeJSEventHook, pauseLoop, resumeLoop } from "~/packages/ThreeJS"
import { VALID_VIDEO_URL_FOR_FFMPEG } from "~/misc/regexp"
import { basename, sleep } from "~/misc/utils"
import { useVideoStore } from "~/stores/video"
import { storeToRefs } from "pinia"
import { useVideoHandlers } from "~/composables"
import CancellableEventToast from "~/components/toasts/CancellableEventToast.vue"

const toast = useToast()
const { progress, start, done } = useNProgress()
const threeJs = useThreeJSEventHook()
const { db } = useSupabase({ logger: toast })
const videoState = useVideoStore()

const { src } = storeToRefs(videoState) as { src: Ref<typeof videoState.src> }
const videoRef = ref() as Ref<HTMLVideoElement>
const playerTimeUpdated = ref(false)
const pose = ref<NormalizedLandmarkList>()

const state = reactive({
  showVideoTag: true,
})

const progressItemsLeft = ref([
  { label: "Load video", done: true },
  { label: "Get keyframes", done: true },
  { label: "Get poses", done: false },
])

const progressItemsRight = ref([
  { label: "Load video", done: false },
  { label: "Get keyframes", done: false },
  { label: "Get poses", done: false },
])

const { videoSelectOptions, loadError, setAttributes } = useVideoHandlers({ videoState }, toast)
const { playing, currentTime } = useMediaControls(videoRef)
const { results, estimatePose, detectorReady } = useMediapipePose({ video: videoRef, options: { modelComplexity: 2 } })

const videoIsReadyToProcess = and(detectorReady, src, toRef(videoState, "duration"))

whenever(videoIsReadyToProcess, async () => {
  const videoObj = ["src", "duration", "width", "height"].reduce((obj, key) => ({ ...obj, [key]: videoState[key] }), {}) as Db.Video

  videoState.id = await db.getVideoId(videoObj)
  if (videoState.id === undefined) {
    toast.info(`Insert video entry ${videoState.src} to the database`)
    videoState.id = await db.insertVideo(videoObj)
  }

  videoState.keyframes = await db.getKeyframes(videoState.id)
  if (!videoState.keyframes) {
    toast.info("Keyframe timestamps — via FFmpeg — to the database")

    const ff = await useFFmpeg({ src, options: { progress: ({ ratio }) => set(progress, ratio), log: false } })
    await ff.runKeyframes()
    videoState.keyframes = get(ff.keyframes)
    await db.insertKeyframes(videoState.id, videoState.keyframes)

    ff.exit()
    if (ff.ffmpeg.isLoaded()) {
      toast.warning(
        {
          component: CancellableEventToast,
          props: {
            message: "Unable to exit from FFmpeg, going to RELOAD the page to get back your memory!",
            event: () => location.reload(),
          },
        },
        { timeout: 10000 }
      )
      return
    }
  }

  videoState.poses = await db.getPoses(videoState.id)
  if (videoState.poses === undefined) {
    start()
    toast.info("Fetch and insert poses to the database")
    toast.warning("First frame estimation can be quite slow")
    threeJs.trigger(pauseLoop)
    await sleep(50)

    videoState.poses = []
    const poses: VideoStatePose[] = []
    for (const ts of videoState.keyframes!) {
      set(playerTimeUpdated, false)

      if (get(currentTime) !== ts) {
        set(currentTime, ts)
        await until(playerTimeUpdated).toBeTruthy()
      }

      await estimatePose()
      if (results.poseWorldLandmarks === undefined) continue
      poses.push({ ts, pose_normalized: results.poseWorldLandmarks })

      if (poses.length === 10) {
        await db.insertPoses(videoState.id, poses)
        videoState.poses.push(...poses)
        poses.length = 0
      }
    }

    if (poses.length > 0) {
      await db.insertPoses(videoState.id, poses)
      videoState.poses.push(...poses)
    }

    threeJs.trigger(resumeLoop)
    done()
  }
})

whenever(and(playing, toRef(videoState, "poses")), async () => {
  if (videoState.poses === undefined) return

  for (const p of videoState.poses) {
    // console.log("TS", p.ts)
    set(pose, p.pose_normalized)
    await sleep(30)
  }
})

const onTimeupdate = () => {
  set(playerTimeUpdated, true)
  // console.log("TU", e.target.currentTime)
}

useGuiFolder(folder => {
  folder.name = "📼 FFmpeg"
  folder.addReactiveSelect(videoState, "src", videoSelectOptions).name("Load video")
  folder
    .addTextInput({ filter: VALID_VIDEO_URL_FOR_FFMPEG, placeholder: "blur to add" })
    .name("Video URL")
    .onFinishChange(url => {
      get(videoSelectOptions)[basename(url)] = url
      videoState.src = url
    })
  folder.add(state, "showVideoTag").name("Show video")
})
</script>

<style>
.videoPlayer {
  @apply max-h-300px;
  aspect-ratio: var(--video-aspect-ratio);
  border: 4px ridge #964b00;
}
</style>
