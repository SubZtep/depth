<template lang="pug">
Title Video Display Pose

.top-left.gap-6
  video.videoPlayer(
    ref="videoRef"
    @error="loadError"
    @timeupdate="playerTimeUpdater"
    @loadedmetadata="videoToStore"
    v-css-aspect-ratio="`--video-aspect-ratio`"
    v-visible="state.showVideoTag"
    crossorigin="anonymous"
    :controls="!!state.src.length"
    muted)

  transition(name="slide")
    StepProgressBar(v-if="videoIsReadyToProcess" :items="progressItemsLeft")

.top-right.gap-6.bg-white
  pre {{state}}
  pre {{videoStore}}

StickmanNormalized(v-if="pose" :pose="pose" :position="[-2, 0, -10]")
</template>

<script lang="ts" setup>
import type { VideoStatePose } from "~/stores/video"
import { useGuiFolder } from "~/packages/datGUI"
import { useFFmpeg } from "~/packages/FFmpeg"
import { useSupabase } from "~/packages/Supabase"
import { useMediapipePose } from "~/packages/PoseAI"
import { useThreeJSEventHook, pauseLoop, resumeLoop } from "~/packages/ThreeJS"
import { VIDEO_URL } from "~/misc/regexp"
import { basename, sleep } from "~/misc/utils"
import { useVideoStore } from "~/stores/video"
import { useVideoHandlers } from "~/composables"
import CancellableEventToast from "~/components/toasts/CancellableEventToast.vue"
import { videoClipSelectOptions } from "~/misc/constants"

const toast = useToast()
const { progress, start, done } = useNProgress()
const threeJs = useThreeJSEventHook()
const { db } = useSupabase({ logger: toast })
const videoStore = useVideoStore()

const state = reactive({
  src: "",
  showVideoTag: true,
})

const { id, src, hasId, hasKeyframes, hasPoses, isProcessable } = storeToRefs(videoStore)

const videoRef = ref() as Ref<HTMLVideoElement>
const pose = ref<NormalizedLandmarkList>()

const progressItemsLeft = [
  { label: "Load video", done: hasId },
  { label: "Get keyframes", done: hasKeyframes },
  { label: "Get poses", done: hasPoses },
]

const videoSelectOptions: Ref<SelectOptions> = ref(videoClipSelectOptions)

const {
  playing,
  currentTime,
} = useMediaControls(videoRef)

const {
  loadError,
  setAttributes,
  playerTimeUpdater,
  playerTimeUpdated,
} = useVideoHandlers({
      onError: src => (delete get(videoSelectOptions)[basename(src)]),
      logger: toast,
    })

const videoToStore = async ({ target }: VideoElementEvent) => {
  start()
  await videoStore.replace({
    src: state.src,
    duration: target.duration,
    width: target.videoWidth,
    height: target.videoHeight,
  })
  done()
}

// const {
//   results,
//   estimatePose,
//   detectorReady,
// } = useMediapipePose({
//       video: videoRef,
//       options: { modelComplexity: 2 }
//     })


// whenever(videoStore.hasId, () => {
// whenever(and(videoStore.hasId, videoS#), () => {
whenever(and(hasId, not(hasKeyframes)), () => {
  console.log("NOOOOOO", get(id))
})

const videoIsReadyToProcess = isProcessable
// const videoIsReadyToProcess = and(detectorReady, isProcessable)
// videoStore.replace("qqq")
whenever(videoIsReadyToProcess, async () => {
  // const videoObj = ["src", "duration", "width", "height"].reduce((obj, key) => Object.assign(obj, { [key]: videoStore[key] }), {}) as Db.Video

  // videoStore.id = await db.getVideoId(videoObj)

  // if (videoStore.id === undefined) {
  //   toast.info(`Insert video entry ${videoStore.src} to the database`)
  //   videoStore.id = await db.insertVideo(videoObj)
  // }

  // videoStore.keyframes = await db.getKeyframes(videoStore.id)
  // if (!videoStore.keyframes) {
  //   toast.info("Keyframe timestamps — via FFmpeg — to the database")

  //   const ff = await useFFmpeg({ src, options: { progress: ({ ratio }) => set(progress, ratio), log: false } })
  //   await ff.runKeyframes()
  //   videoStore.keyframes = get(ff.keyframes)
  //   await db.insertKeyframes(videoStore.id, videoStore.keyframes)

  //   ff.exit()
  //   if (ff.ffmpeg.isLoaded()) {
  //     toast.warning(
  //       {
  //         component: CancellableEventToast,
  //         props: {
  //           message: "Unable to exit from FFmpeg, going to RELOAD the page to get back your memory!",
  //           event: () => location.reload(),
  //         },
  //       },
  //       { timeout: 10000, position: POSITION.BOTTOM_CENTER }
  //     )
  //     return
  //   }
  // }

  // videoStore.poses = await db.getPoses(videoStore.id)
  // if (videoStore.poses === undefined) {
  //   start()
  //   toast.info("Fetch and insert poses to the database")
  //   toast.warning("First frame estimation can be quite slow")
  //   threeJs.trigger(pauseLoop)
  //   await sleep(50)

  //   videoStore.poses = []
  //   const poses: VideoStatePose[] = []
  //   for (const ts of videoStore.keyframes!) {
  //     set(playerTimeUpdated, false)

  //     if (get(currentTime) !== ts) {
  //       set(currentTime, ts)
  //       await until(playerTimeUpdated).toBeTruthy()
  //     }

  //     await estimatePose()
  //     if (results.poseWorldLandmarks === undefined) continue
  //     poses.push({ ts, pose_normalized: results.poseWorldLandmarks })

  //     if (poses.length === 10) {
  //       await db.insertPoses(videoStore.id, poses)
  //       videoStore.poses.push(...poses)
  //       poses.length = 0
  //     }
  //   }

  //   if (poses.length > 0) {
  //     await db.insertPoses(videoStore.id, poses)
  //     videoStore.poses.push(...poses)
  //   }

  //   threeJs.trigger(resumeLoop)
  //   done()
  // }
})

// gagyi playback
whenever(and(playing, hasPoses), async () => {
  console.log("start pose playback")
  if (videoStore.poses === undefined) return
  for (const p of videoStore.poses) {
    // console.log("TS", p.ts)
    set(pose, p.pose_normalized)
    await sleep(30)
  }
})


watch(() => state.src, v => {
  const el = get(videoRef)
  if (v) {
    el.setAttribute("src", v)
  } else {
    el.removeAttribute("src")
  }
  // videoStore.replace(v)
  // console.log("CCC0", v)
})

useGuiFolder(folder => {
  folder.name = "📼 FFmpeg"
  folder.addReactiveSelect(state, "src", videoSelectOptions).name("Load video")
  folder
    .addTextInput({ filter: VIDEO_URL, placeholder: "blur to add" })
    .name("Video URL")
    .onFinishChange(url => {
      get(videoSelectOptions)[basename(url)] = url
      state.src = url
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

.slide-enter-active,
.slide-leave-active {
  transition: transform 500ms ease;
}

.slide-enter-from,
.slide-leave-to {
  transform: translateX(-100%);
}
</style>
