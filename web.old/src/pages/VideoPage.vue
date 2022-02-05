<template lang="pug">
Title Video

VideoPlayer(:src="state.src" :key="state.src || 'none'" :play="state.showVideo" v-visible="state.showVideo")

UseVirtualList.bg-gray-200.w-64.resize-x(v-if="memfsPics.length > 0" :list="memfsPics" :options="{ itemHeight: state.thumbHeight, overscan: 0 }" height="300px")
  template(#="{ data: filename }")
    ImgMemfs(:src="`${memfsDirectory}/${filename}`" :FS="ff.FS" :key="`${memfsDirectory}/${filename}`" :height="state.thumbHeight")
    | {{filename}}

</template>

<script lang="ts" setup>
import { UseVirtualList } from "@vueuse/components"
import VideoPlayer from "~/components/video/VideoPlayer.vue"
import ImgMemfs from "~/components/video/ImgMemfs"
import { useFFmpeg } from "@depth/video"

const toast = useToast()
const { progress } = useNProgress()

const memfsDirectory = "/depth"
const memfsFilename = "video.webm"

const state = reactive({
  src: "",
  showVideo: true,
  thumbHeight: 128,
})

const src = toRef(state, "src")

const { ff, files, generateThumbnails } = await useFFmpeg({
  src,
  memfsDirectory,
  memfsFilename,
  options: {
    progress: ({ ratio }) => set(progress, ratio),
    log: false,
  },
})

const memfsPics = computed(() => files.value.filter(filename => filename.endsWith(".png")))

const btns = {
  tumbnails: async () => {
    if (!get(src) || !ff || !ff.isLoaded()) {
      toast.warning("Please load a video first.")
      return
    }
    generateThumbnails(state.thumbHeight)
  },
}

addGuiFolder(folder => {
  folder.name = "Video Page"
  folder.add(state, "src", ["", "/videos/yoga2.webm", "/videos/extended_leg_pistol_squats.webm"]).name("Source")
  folder.add(state, "showVideo").name("Video tag")
  folder.add(state, "thumbHeight", 8, 512, 8).name("Video tag")
  folder.add(btns, "tumbnails").name("Generate Tumbnails")
})
</script>
