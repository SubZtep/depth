<template lang="pug">
Title Video Display Pose
.debug {{ff.video}}

VideoTimeline(
  v-if="ff.video.frameTimes"
  :frame-times="ff.video.frameTimes")
</template>

<script lang="ts" setup>
import { useGuiFolder } from "../../packages/datGUI"
import { useFFmpeg } from "../../packages/FFmpeg/useFFmpg"
import { useVideoDisplay } from "../../composables/useVideoDisplay"
import { useVideoFiles } from "../../composables/useVideoFiles"
import { updateVideoTime } from "../../misc/utils"
import VideoTimeline from "../timeline/VideoTimeline.vue"

const toast = useToast()
const { progress } = useNProgress()

const props = defineProps({
  video: { type: Object as PropType<Ref<HTMLVideoElement>>, required: true },
})

const state = reactive<VideoDisplayPoseState>({
  src: "",
})

const video = toRef(props, "video")
const src = toRef(state, "src")

useVideoDisplay({ video, src })

toast.info("Booting up FFmpeg")
const ff = useFFmpeg({
  progress: ({ ratio }) => set(progress, ratio),
  // log: true,
})

watch(src, async newSrc => {
  if (ff.video.memfsFilename) {
    toast.info(`Delete ${ff.video.memfsFilename} from MEMFS`)
    ff.memfs.delVideo()
  }
  if (newSrc) {
    toast.info(`Write ${newSrc} to MEMFS`)
    await ff.memfs.writeVideo(newSrc)
  }

  // await processFrameByFrame(newSrc, async pts => {
  //   await updateVideoTime(video, pts)
  // })
  // toast.success("Video frames processed")
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
  folder.add(state, "src", useVideoFiles().selectList()).name("Video source")
  folder.add(buttons, "pts").name("Get frame timestamps")
  folder.add(buttons, "images").name("Get frames as images")
  folder.add(buttons, "delImages").name("Delete frames images")
})
</script>
