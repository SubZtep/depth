<template lang="pug">
video(
  autoplay
  loop
  muted
  playsinline
  ref="videoRef"
  controls="true"
  poster="no-video.png"
  :class="{ visible: opts.showEl }")
  //- :visible="opts.showEl")

</template>

<script lang="ts" setup>
import dat from "dat.gui"
import { Group } from "three"
import { defineProps, provide, inject, readonly, ref, reactive, toRef } from "vue"
import { useEventListener, useCssVar, useMediaControls, set } from "@vueuse/core"
import { useNProgress } from "@vueuse/integrations/useNProgress"
import { scene } from "../composables/useThreeJs"
import { randomTitle, div } from "../misc/utils"
const { done } = useNProgress()

const props = defineProps({
  src: { type: String, required: false },
  srcObject: { type: Object as PropType<MediaStream>, required: false },
})

const root = new Group()
scene.add(root)
provide<Group>("root", root)


const name = randomTitle()
const opts = reactive({
  gameLoopRunning: true,
  showEl: true,
})

const threeCtrlHook = inject<EventHook<ThreeCtrlEvent>>("threeCtrlHook")!

const gui = new dat.GUI({ name, closeOnTop: true })
gui.add(opts, "gameLoopRunning").onChange(run => threeCtrlHook.trigger({ cmd: run ? "resume" : "pause" }))
gui.add(opts, "showEl")

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

// const listenBlazeAndKickOff = () => {
  // playerState.playing = true
  // opts.gameLoopRunning = true
  // gui.updateDisplay()
  threeCtrlHook.trigger({ cmd: "resume" })
  done()
//   threeCtrlHook.off(listenBlazeAndKickOff)
//   done()
// }
// threeCtrlHook.on(listenBlazeAndKickOff)
</script>
