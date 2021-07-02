<template lang="pug">
MediaInput(v-if="opts.videoDeviceId" :videoDeviceId="opts.videoDeviceId" v-visible="opts.showDevice" @updated="setPlayback")
VideoFileInput(v-if="opts.src" :src="opts.src" v-visible="opts.showSrc" @updated="setPlayback")
PlaybackInScene(:el="playbackRef")

PoseDetector(:el="playbackRef" :pose="pose")
Stickman(:pose="pose")
</template>

<script lang="ts" setup>
import type { Ref } from "vue"
import type { Pose } from "@tensorflow-models/pose-detection"
import { reactive, onMounted, inject, provide, ref } from "vue"
import { useDevicesList, set } from "@vueuse/core"
import { Group } from "three"
import { scene } from "../../composables/useThreeJs"
import { selectableMedias } from "../../misc/utils"

const pose: Pose = reactive({ keypoints: [] })

const opts = reactive({
  videoDeviceId: "",
  showDevice: true,
  src: "",
  showSrc: true,
})

const { videoInputs } = useDevicesList({ requestPermissions: true })

const folder = inject<dat.GUI>("gui")!.addFolder("Pose Group")
folder.addReactiveSelect(opts, "videoDeviceId", selectableMedias(videoInputs)).name("Video Device")
folder.add(opts, "showDevice").name("Show Device Input")
folder.add(opts, "src", ["", "happy.webm", "mask.webm"]).name("Video Device")
folder.add(opts, "showSrc").name("Show File Input")

const root = new Group()
scene.add(root)
provide("root", root)

const playbackRef: Ref<HTMLVideoElement | undefined> = ref()
const setPlayback = (ref: Ref<HTMLVideoElement | undefined>) => set(playbackRef, ref.value)

onMounted(() => {
  folder.open()
})
</script>
