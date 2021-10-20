<template lang="pug">
VideoPlayer(
  :controls="!isLoading"
  :src="state.src"
  v-visible="state.showVideoTag"
  @mounted="setVideoRef"
  @loaded="videoStore.replace")

transition(name="slide")
  .progressSteps(v-if="src")
    ItemProgress(:nr="1" :done="videoStore.hasId") Video in db
    ItemProgress(:nr="2" :done="videoStore.hasKeyframes") Has keyframes
    ItemProgress(:nr="3" :done="videoStore.hasPoses") Has poses
</template>

<script lang="ts" setup>
import { VIDEO_URL } from "~/misc/constants"
import { toSelectOptions, basename } from "~/misc/transformers"
import { useFFmpeg } from "~/packages/FFmpeg"
import { useThreeJSEventHook, pauseLoop, resumeLoop } from "~/packages/ThreeJS"
import { useMediapipePose } from "~/packages/PoseAI"
import settings from "~/../SETTINGS.toml"
import { round, compare } from "mathjs"

const { progress, start, done, isLoading } = useNProgress()
const toast = useToast()
const threeJs = useThreeJSEventHook()

const videoStore = useVideoStore()

const state = reactive({
  src: "",
  showVideoTag: true,
})

const emit = defineEmits<{
  (event: "pose", pose: LandmarkList): void
}>()

const { id, src, keyframes, poses } = storeToRefs(videoStore)

const videoRef = ref<HTMLVideoElement>()
const setVideoRef = (el?: HTMLVideoElement) => set(videoRef, el)
const { currentTime } = useMediaControls(videoRef)

const { pause, resume } = pausableWatch(
  currentTime,
  t => {
    const p = videoStore.closestPose(t)
    emit("pose", p.pose_normalized)
  },
  { immediate: false }
)
pause()
whenever(and(poses, not(isLoading)), () => resume())

// KEYFRAMES
whenever(and(id, src, not(keyframes)), () => {
  toast.info("Use FFmpeg")
  const {
    keyframes: kf,
    isActive,
    exit,
  } = useFFmpeg({
    src: src as Ref<string>,
    options: { progress: ({ ratio }) => set(progress, ratio), log: false },
  })
  watch(isActive, async active => {
    if (active) {
      await videoStore.setKeyframes(get(kf))
      exit()
    }
  })
})

// POSES
whenever(and(id, src, keyframes, not(poses)), () => {
  toast.info("Use pose AI")
  start()
  const kf: number[] = toRaw(get(keyframes)) as number[]
  let t: number | undefined

  const { estimatePose, detectorReady } = useMediapipePose({
    video: videoRef,
    options: { modelComplexity: 2 },
    handler: results => {
      videoStore.addPose(get(currentTime), results)
    },
  })

  const rollKeyframes = async () => {
    await estimatePose(get(currentTime))
    t = kf.shift()
    if (t === undefined) {
      threeJs.trigger(resumeLoop)
      done()
      return
    }
    set(currentTime, t)
  }

  useEventListener<VideoElementEvent>(videoRef, "timeupdate", async ({ target: { currentTime: ct } }) => {
    const isPoseTimeAndVideoTimeReallyDifferent = t && t !== ct && compare(round(t, 3), round(ct, 3)) !== 0
    if (isPoseTimeAndVideoTimeReallyDifferent) {
      throw new Error(`Video time update fail [${t} vs ${ct}]`)
    }
    await rollKeyframes()
  })

  whenever(detectorReady, async () => {
    threeJs.trigger(pauseLoop)
    await sleep(50)
    t = kf.shift()
    if (t === get(currentTime)) {
      await rollKeyframes()
    } else {
      set(currentTime, t)
    }
  })
})

// GUI

const videoOptions: Ref<SelectOptions> = ref(toSelectOptions(settings.video?.clips ?? []))

addGuiFolder(folder => {
  folder.name = "📼 Video Player"
  folder.add(state, "showVideoTag").name("Show video tag")
  folder.addReactiveSelect({ target: state, propName: "src", options: videoOptions }).name("Load video")
  folder
    .addTextInput({ filter: VIDEO_URL, placeholder: "blur to add" })
    .name("Video URL")
    .onFinishChange(url => {
      pause()
      get(videoOptions)[basename(url)] = url
      videoStore.$reset()
      state.src = url
    })
})
</script>
