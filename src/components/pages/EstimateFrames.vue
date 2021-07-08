<template lang="pug">
VideoFileInput(
  v-if="opts.src"
  :src="opts.src"
  @play="setPlaybackRef"
  @pause="playing = false"
  v-visible="opts.showHtmlPlayer")
</template>

<script lang="ts" setup>
import type { Ref } from "vue"
import { onBeforeUnmount, reactive, ref } from "vue"
import { useGui } from "../../plugins/datGUI"
import { VIDEOS } from "../../misc/constants"
import { set, get } from "@vueuse/core"

let playbackRef: Ref<HTMLVideoElement | undefined> = ref()
let playing = ref(false)

const setPlaybackRef = (ref: Ref<HTMLVideoElement>) => {
  set(playbackRef, get(ref))
  set(playing, true)
}

const opts = reactive({
  src: "",
  showHtmlPlayer: true,
})

const gui = useGui()
const folder = gui.addFolder("Estimate frame by frame")
folder.add(opts, "src", ["", ...VIDEOS]).name("File input")
folder.add(opts, "showHtmlPlayer").name("Show ⍃video⍄")
folder.open()

onBeforeUnmount(() => {
  gui.removeFolder(folder)
})
</script>
