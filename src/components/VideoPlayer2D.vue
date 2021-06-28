<template lang="pug">
video(
  loop
  muted
  playsinline
  ref="videoRef"
  controls="true"
  autoplay="false"
  poster="no-video.png"
  :class="{ visible: opts.showEl }")
  slot
</template>

<script lang="ts" setup>
import dat from "dat.gui"
import { Group } from "three"
import { defineProps, provide, inject, readonly, ref, reactive, toRef } from "vue"
import { useEventListener, useCssVar, useMediaControls, get, set } from "@vueuse/core"
import { scene } from "../composables/useThreeJs"
import { randomTitle, div } from "../misc/utils"

const props = defineProps({
  src: { type: String, required: false },
  srcObject: { type: Object as PropType<MediaStream>, required: false },
})

const name = randomTitle()
const opts = reactive({
  tickLoopRunning: true,
  showEl: true,
})

const gui = new dat.GUI({ name, closeOnTop: true })
const threeCtrlHook = inject<EventHook<ThreeCtrlEvent>>("threeCtrlHook")!
gui.add(opts, "tickLoopRunning").onChange(run => threeCtrlHook.trigger({ cmd: run ? "resume" : "pause" }))
gui.add(opts, "showEl")

const root = new Group()
scene.add(root)
provide<Group>("root", root)

const playerState = reactive<PlayerState>({
  name,
  videoRef: ref<HTMLVideoElement>(),
  videoWidth: 640,
  videoHeight: 480,
} as PlayerState)

const videoRef = toRef(playerState, "videoRef")

// @ts-ignore
playerState.playing = useMediaControls(videoRef, { src: props.src }).playing
provide<PlayerState>("playerState", readonly(playerState))

useEventListener<{ target: HTMLVideoElement }>(videoRef, "canplay", ({ target }) => {
  playerState.videoWidth = target.videoWidth
  playerState.videoHeight = target.videoHeight
})

const ratio = div(playerState.videoWidth, playerState.videoHeight)
const cssRatio = useCssVar("--ratio", videoRef)
set(cssRatio, String(ratio))
</script>
