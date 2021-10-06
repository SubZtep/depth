<template lang="pug">
Title Video Display Pose

video.left-0(
  ref="videoRef"
  :src="video.src"
  :class="$style.video"
  @error="onVideoError"
  @timeupdate="onTimeupdate"
  @loadedmetadata="onVideoMetadata"
  v-css-aspect-ratio="`--video-aspect-ratio`"
  v-visible="state.showVideoTag"
  crossorigin="anonymous"
  controls
  muted)

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
import settings from "~/../SETTINGS.toml"
import { storeToRefs } from "pinia"

const toast = useToast()
const { progress, start, done } = useNProgress()
const threeJs = useThreeJSEventHook()
const { db } = useSupabase({ logger: toast })
const video = useVideoStore()

const { src } = storeToRefs(video) as { src: Ref<typeof video.src> }
const videoRef = ref() as Ref<HTMLVideoElement>
const playerTimeUpdated = ref(false)
const pose = ref<NormalizedLandmarkList>()

const state = reactive({
  showVideoTag: true,
})

const {
  playing,
  currentTime,
} = useMediaControls(videoRef)

const {
  results,
  estimatePose,
  detectorReady,
} = useMediapipePose({ video: videoRef, options: { modelComplexity: 2 } })

whenever(and(detectorReady, src, toRef(video, "duration")), async () => {
  const videoObj = ["src", "duration", "width", "height"].reduce((obj, key) => ({ ...obj, [key]: video[key] }), {}) as Db.Video

  video.id = await db.getVideoId(videoObj)
  if (video.id === undefined) {
    toast.info(`Insert video entry ${video.src} to the database`)
    video.id = await db.insertVideo(videoObj)
  }

  video.keyframes = await db.getKeyframes(video.id)
  if (video.keyframes === undefined) {
    toast.info("Fetch and insert keyframes to the database")

    const {
      exit,
      ffmpeg,
      keyframes,
      runKeyframes,
    } = await useFFmpeg({
      src,
      options: { progress: ({ ratio }) => set(progress, ratio), log: false },
    })

    await runKeyframes()
    video.keyframes = get(keyframes)
    await db.insertKeyframes(video.id, video.keyframes)

    exit()
    if (ffmpeg.isLoaded()) {
      toast.warning("Unable to exit from FFmpeg, please reload the page to get back your memory!", { timeout: 10000 })
      return
    }
  }

  video.poses = await db.getPoses(video.id)
  if (video.poses === undefined) {
    start()
    toast.info("Fetch and insert poses to the database")
    toast.warning("First frame estimation can be quite slow")
    threeJs.trigger(pauseLoop)
    await sleep(50)

    video.poses = []
    const poses: VideoStatePose[] = []
    for (const ts of video.keyframes!) {
      set(playerTimeUpdated, false)

      if (get(currentTime) !== ts) {
        set(currentTime, ts)
        await until(playerTimeUpdated).toBeTruthy()
      }

      await estimatePose()
      if (results.poseWorldLandmarks === undefined) continue
      poses.push({ ts, pose_normalized: results.poseWorldLandmarks })

      if (poses.length === 10) {
        await db.insertPoses(video.id, poses)
        video.poses.push(...poses)
        poses.length = 0
      }
    }

    if (poses.length > 0) {
      await db.insertPoses(video.id, poses)
      video.poses.push(...poses)
    }

    threeJs.trigger(resumeLoop)
    done()
  }
})

whenever(
  and(playing, toRef(video, "poses")),
  async () => {
    if (video.poses === undefined) return

    for (const p of video.poses) {
      // console.log("TS", p.ts)
      set(pose, p.pose_normalized)
      await sleep(30)
    }
  }
)

const onTimeupdate = () => {
  set(playerTimeUpdated, true)
  // console.log("TU", e.target.currentTime)
}

const videoOptions = ref(settings.video?.clips?.reduce((obj, url) => ({ ...obj, [basename(url)]: url }), {})) as Ref<Record<string, string>>

const onVideoMetadata = ({ target }: Event) => {
  const { videoWidth, videoHeight, duration } = target as HTMLVideoElement
  video.width = videoWidth
  video.height = videoHeight
  video.duration = duration
}

const onVideoError = () => {
  const videoEl = get(videoRef)
  delete get(videoOptions)[videoEl.src]
  videoEl.src = ""
  //TODO: implenent error codes: https://developer.mozilla.org/en-US/docs/Web/API/MediaError
  toast.error(`Unable to load ${src}.\n${videoEl.error?.message}`)
}

useGuiFolder(folder => {
  folder.name = "📼 FFmpeg"
  folder.addReactiveSelect(video, "src", videoOptions).name("Load video")
  folder
    .addTextInput(VALID_VIDEO_URL_FOR_FFMPEG, "blur to add")
    .name("Video URL")
    .onFinishChange(url => {
      get(videoOptions)[basename(url)] = url
      video.src = url
    })
  folder.add(state, "showVideoTag").name("Show video")
})
</script>

<style module>
.video {
  @apply fixed top-0 max-h-300px;
  aspect-ratio: var(--video-aspect-ratio);
  border: 4px ridge #964b00;
}
</style>
