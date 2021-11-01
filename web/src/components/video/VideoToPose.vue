<template lang="pug">
VideoPlayer(
  :controls="!isLoading"
  :src="state.src"
  v-visible="state.showVideoTag"
  @mounted="setVideoRef"
  @loaded="videoStore.replace"
  @error="src => (delete videoOptions[basename(src)])")

transition(name="slide")
  .progressSteps(v-if="videoStore.src")
    ItemProgress(:nr="1" :done="hasId") Video in db
    ItemProgress(:nr="2" :done="hasKeyframes") Has keyframes
    ItemProgress(:nr="3" :done="hasPoses") Has poses
</template>

<script lang="ts" setup>
import { addGuiFolder } from "@depth/dat.gui"
import { toSelectOptions } from "~/misc/transformers"
import { useFFmpeg } from "@depth/ffmpeg"
import { useThreeJSEventHook } from "@depth/three.js"
import { useMediapipePose } from "@depth/mediapipe"
import type { LandmarkList } from "@depth/mediapipe"
import { round, compare } from "mathjs"
import { useVideoStore } from "~/stores/video"
import { sleep, basename } from "@depth/misc"
import { useGui } from "@depth/dat.gui"

const { progress, start, done, isLoading } = useNProgress()
const toast = useToast()
const threeJs = useThreeJSEventHook()

const videoStore = useVideoStore()
const { hasId, hasKeyframes, hasPoses } = storeToRefs(videoStore)

const gui = useGui()

const state = reactive({
  src: "",
  showVideoTag: true,
})

const emit = defineEmits<{
  (event: "pose", pose: LandmarkList): void
}>()

const videoRef = ref<HTMLVideoElement>()
const setVideoRef = (el?: HTMLVideoElement) => set(videoRef, el)

const { currentTime } = useMediaControls(videoRef)

watchWithFilter(
  currentTime,
  t => {
    const p = videoStore.closestPose(t)
    emit("pose", p.pose_normalized)
  },
  {
    eventFilter: invoke => get(hasPoses) && not(isLoading) && invoke(),
  }
)

whenever(hasId, async () => {
  toast.info("Video in DB")

  if (!get(hasKeyframes)) {
    toast.info("Use FFmpeg")
    gui.hide()
    const timestamps = await grabKeyframes(videoStore.src)
    await videoStore.setKeyframes(timestamps)
    gui.show()
  }

  if (!get(hasPoses)) {
    toast.info("Use pose AI")
    gui.hide()
    start()
    const kf: number[] = toRaw(get(videoStore.keyframes)) as number[]
    let t: number | undefined

    const { estimatePose, detectorReady } = useMediapipePose({
      video: videoRef,
      options: { modelComplexity: 2 },
      handler: results => {
        videoStore.addPose(get(currentTime), results)
      },
    })

    const rollKeyframes = async () => {
      try {
        await estimatePose(get(currentTime))
      } catch (e: any) {
        toast.error(e.message)
      }
      t = kf.shift()
      if (t === undefined) {
        threeJs.trigger({ cmd: "Resume" })
        done()
        gui.show()
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
      threeJs.trigger({ cmd: "Pause" })
      await sleep(50)
      t = kf.shift()
      if (t === get(currentTime)) {
        await rollKeyframes()
      } else {
        set(currentTime, t)
      }
    })
  }
})

const videoOptions = ref(toSelectOptions(["/videos/extended_leg_pistol_squats.webm", "/videos/yoga2.webm"], basename))

addGuiFolder(folder => {
  folder.name = "📼 Video Player"
  folder.add(state, "showVideoTag").name("Show video tag")
  folder.add(state, "src", videoOptions).name("Load video")
  folder
    .addTextInput({ filter: /^\S+\.webm|mkv|mp4|avi|ogv$/, placeholder: "blur to add" })
    .name("Video URL")
    .onFinishChange(url => {
      get(videoOptions)[basename(url)] = url
      videoStore.$reset()
      state.src = url
    })
})
</script>

<script lang="ts">
import type { Ref } from "vue"

async function grabKeyframes(src: Ref<string>): Promise<number[]> {
  return new Promise(resolve => {
    const { keyframes, isActive, exit } = useFFmpeg({
      src,
      options: { progress: ({ ratio }) => set(progress, ratio), log: false },
    })
    const stop = whenever(isActive, () => {
      stop()
      exit()
      return resolve(get(keyframes))
    })
  })
}
</script>
