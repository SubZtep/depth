<template lang="pug">
Title Video Display Pose

teleport(to="#hud")
  Debug
    p {{videoStore.$state}}
    hr
    p {{ff.video}}

  VideoTimeline(
    :video="video"
    :ff="ff")
  //- v-if="ff.video.frameTimes"
  //- :frame-times="ff.video.frameTimes")

  MemfsCommander(:FS="ff.ffmpeg?.FS")
</template>

<script lang="ts" setup>
import { storeToRefs } from "pinia"
import { useGuiFolder } from "~/packages/datGUI"
import { useFFmpeg } from "~/packages/FFmpeg/useFFmpg"
import { useVideoDisplay } from "~/composables/useVideoDisplay"
import { useVideoFiles } from "~/composables/useVideoFiles"
import { updateVideoTime } from "~/misc/utils"
import VideoTimeline from "~/components/video-timeline/VideoTimeline.vue"
import { useVideoStore } from "~/stores/video"
import MemfsCommander from "~/components/memfs-commander/MemfsCommander.vue"

const toast = useToast()
const { progress } = useNProgress()
const videoStore = useVideoStore()

const FS = ref()

const props = defineProps({
  video: { type: Object as PropType<Ref<HTMLVideoElement>>, required: true },
})

useVideoDisplay({ video: props.video, src: storeToRefs(videoStore).src })

const ff = useFFmpeg({
  ffOpts: {
    progress: ({ ratio }) => set(progress, ratio),
    log: true,
  },
})

const deleteVideoFromMEMFS = () => {
  if (ff.video.memfsFilename) {
    toast.info(`Delete ${ff.video.memfsFilename} from MEMFS`)
    ff.memfs.delVideo()
  }
}

const writeVideoToMEMFS = async (src: string) => {
  if (src) {
    toast.info(`Write ${src} to MEMFS`)
    await ff.memfs.writeVideo(src)
  }
}

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
  folder.name = "📼 FFmpeg"
  folder.add(videoStore, "src", useVideoFiles().selectList()).name("Load Video").onChange(newSrc => {
    deleteVideoFromMEMFS()
    writeVideoToMEMFS(newSrc)
  })
  folder.add(buttons, "pts").name("Get Keyframes Timestamps")
  folder.add(buttons, "images").name("Get Keyframes Images")
  folder.add(buttons, "delImages").name("Omit Keyframes Images")
})
</script>
