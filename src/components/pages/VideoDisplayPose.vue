<template lang="pug">
Title Video Display Pose
Debug
  p {{videoStore.$state}}
  hr
  p {{ff.video}}

VideoTimeline(
  v-if="ff.video.frameTimes"
  :video="video"
  :frame-times="ff.video.frameTimes")
</template>

<script lang="ts" setup>
import { storeToRefs } from "pinia"
import { useGuiFolder } from "~/packages/datGUI"
import { useFFmpeg } from "~/packages/FFmpeg/useFFmpg"
import { useVideoDisplay } from "~/composables/useVideoDisplay"
import { useVideoFiles } from "~/composables/useVideoFiles"
import { updateVideoTime } from "~/misc/utils"
import VideoTimeline from "~/components/timeline/VideoTimeline.vue"
import { useVideoStore } from "~/stores/video"

const toast = useToast()
const { progress } = useNProgress()
const videoStore = useVideoStore()

const props = defineProps({
  video: { type: Object as PropType<Ref<HTMLVideoElement>>, required: true },
})

const video = toRef(props, "video")
const src = storeToRefs(videoStore).src

useVideoDisplay({ video, src })

toast.info("Booting up FFmpeg")
const ff = useFFmpeg({
  progress: ({ ratio }) => set(progress, ratio),
  // log: true,
})

videoStore.$subscribe(async ({ events }) => {
  if (!Array.isArray(events)) events = [events]

  const evs = events.filter(({ key }) => key === "src")
  if (evs.length === 0) return

  if (ff.video.memfsFilename) {
    toast.info(`Delete ${ff.video.memfsFilename} from MEMFS`)
    ff.memfs.delVideo()
  }

  const newSrc = evs.at(-1)!.newValue
  if (newSrc) {
    toast.info(`Write ${newSrc} to MEMFS`)
    await ff.memfs.writeVideo(newSrc)
  }
})

const buttons = {
  async pts() {
    toast.info("Get video frame timestamps")
    await ff.frameTimestamps()
    ff.video.frameTimes || toast.error("Couldn't get the timestamps")
  },
  async images() {
    toast.info("Get video frame images")
    await ff.frameImages()
    ff.video.imageMemfsFilenames || toast.error("Couldn't get the images")
  },
  delImages() {
    ff.memfs.delImages()
    !ff.video.imageMemfsFilenames || toast.error("Couldn't delete the images")
  },
}

useGuiFolder(folder => {
  folder.name = "Video Display"
  folder.add(videoStore, "src", useVideoFiles().selectList()).name("Video file")
  folder.add(buttons, "pts").name("Get frame timestamps")
  folder.add(buttons, "images").name("Get frame images")
  folder.add(buttons, "delImages").name("Omit frames images")
})
</script>
