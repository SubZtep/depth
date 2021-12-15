<template lang="pug">
Title Video

VideoPlayer(v-if="state.src" :src="state.src")

//- UseVirtualList.w-64.bg-white(v-if="memfsPics.length > 0" :list="memfsPics" :options="{ itemHeight: 66, overscan: 0 }" height="300px")
  template(#="{ data: filename }")
    ImgMemfs(:src="`${memfsDir}/${filename}`" :FS="ff.FS" :key="`${memfsDir}/${filename}`")
    | {{filename}}

</template>

<script lang="ts" setup>
import { UseVirtualList } from "@vueuse/components"
import VideoPlayer from "~/components/video/VideoPlayer.vue"
import ImgMemfs from "~/components/video/ImgMemfs"
import { useFFmpeg } from "@depth/video"

const toast = useToast()
const { progress } = useNProgress()

const memfsDir = "/depth"
const memfsFilename = "video.webm"

const state = reactive({
  src: "",
})

const { ff, files, generateThumbnails } = await useFFmpeg({
  src: toRef(state, "src"),
  memfsDir,
  memfsFilename,
  options: {
    progress: ({ ratio }) => set(progress, ratio),
    log: false,
  },
})

const memfsPics = computed(() => files.value.filter(filename => filename.endsWith(".png")))

const btns = {
  tumbnails: async () => {
    if (!ff || !ff.isLoaded()) {
      toast.warning("Please load video first")
    }
    generateThumbnails(66)
  },
}

addGuiFolder(folder => {
  folder.name = "Video Page"
  folder.add(state, "src", ["", "/videos/yoga2.webm", "/xxx/face_speak.webm"]).name("Source")
  folder.add(btns, "tumbnails").name("Generate Tumbnails")
})
</script>
