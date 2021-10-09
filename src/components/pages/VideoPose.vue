<template lang="pug">
Title Video Display Pose

.top-left.gap-6
  VideoPlayer(
    :src="state.src"
    :controls="hasPoses"
    @loaded="el => videoRef = el"
    @error="src => (delete videoSelectOptions[basename(src)])"
    @timeupdated="videoTimeUpdated = true"
    v-visible="state.showVideoTag")

  transition(name="slide")
    StepProgressBar(v-if="!!state.src" :items="progressItemsLeft")

//-.top-right.gap-6.bg-white
  pre {{videoTimeUpdated}} {{pose}}

StickmanNormalized(v-if="hasPoses" :pose="pose" :position="[-2, 0, -10]")
</template>

<script lang="ts" setup>
import type { VideoStatePose } from "~/stores/video"
import { useGuiFolder } from "~/packages/datGUI"
import { useFFmpeg } from "~/packages/FFmpeg"
import { useMediapipePose } from "~/packages/PoseAI"
import { useThreeJSEventHook, pauseLoop, resumeLoop } from "~/packages/ThreeJS"
import { VIDEO_URL } from "~/misc/regexp"
import { useVideoStore } from "~/stores/video"
import CancellableEventToast from "~/components/toasts/CancellableEventToast.vue"
import { toSelectOptions } from "~/misc/utils"
import VideoPlayer from "~/components/video/VideoPlayer.vue"
import settings from "~/../SETTINGS.toml"

const toast = useToast()
const { progress, done } = useNProgress()
const threeJs = useThreeJSEventHook()

const videoStore = useVideoStore()
const videoRef = ref<HTMLVideoElement>()
const { playing, currentTime } = useMediaControls(videoRef)
const videoSelectOptions: Ref<SelectOptions> = ref(toSelectOptions(settings.video?.clips ?? []))
const videoTimeUpdated = ref(false)

const { hasId, hasKeyframes, hasPoses } = storeToRefs(videoStore)
const pose = ref<NormalizedLandmarkList>()
const poses: VideoStatePose[] = []
const keyframes: number[] = []

const state = reactive({
  showVideoTag: true,
  src: "",
})

const progressItemsLeft = [
  { label: "Video in db", done: hasId },
  { label: "Has keyframes", done: hasKeyframes },
  { label: "Has poses", done: hasPoses },
]

const { estimatePose, detectorReady } = useMediapipePose({
  video: videoRef,
  options: { modelComplexity: 2 },
  handler: async results => {
    poses.push({
      ts: get(currentTime) ?? 0,
      pose_normalized: results.poseLandmarks ?? [],
    })
    if (keyframes.length === 0) {
      await videoStore.setPoses(poses)
      threeJs.trigger(resumeLoop)
    }
  },
})

whenever(and(hasId, not(hasKeyframes)), async () => {
  const ff = await useFFmpeg({
    src: toRef(state, "src"),
    options: { progress: ({ ratio }) => set(progress, ratio), log: false },
  })
  await ff.runKeyframes()
  await videoStore.setKeyframes(get(ff.keyframes))
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
      { timeout: 10000, position: POSITION.BOTTOM_CENTER }
    )
    return
  }
})

whenever(and(detectorReady, videoRef, hasId, hasKeyframes, not(hasPoses)), async () => {
  threeJs.trigger(pauseLoop)
  await sleep(50)

  set(videoTimeUpdated, false)
  poses.length = 0
  keyframes.length = 0
  keyframes.push(...get(videoStore.keyframes!))

  const t = keyframes.shift()
  if (get(currentTime) === t) {
    set(videoTimeUpdated, true)
  } else {
    set(currentTime!, t)
  }
})

whenever(and(videoTimeUpdated, not(hasPoses)), async () => {
  const ts = get(currentTime)
  set(progress, ts / videoStore.duration!)
  await estimatePose(ts)

  set(videoTimeUpdated, false)
  const t = keyframes.shift()
  if (t !== undefined) {
    set(currentTime!, t)
  } else {
    done()
  }
})

// gagyi playback
whenever(and(playing, hasPoses), async () => {
  console.log("start pose playback")
  if (videoStore.poses === undefined) return
  for (const p of videoStore.poses) {
    console.log("TS", p.ts)
    set(pose, p.pose_normalized)
    await sleep(30)
  }
})

useGuiFolder(folder => {
  folder.name = "📼 FFmpeg"
  folder.addReactiveSelect({ target: state, propName: "src", options: videoSelectOptions }).name("Load video")
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
