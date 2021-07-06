<template lang="pug">
h1 PPP {{playbackRef}} x {{videoFilePlaying}}
//-MediaInput(
  v-if="opts.videoDeviceId"
  :videoDeviceId="opts.videoDeviceId"
  v-visible="opts.showHtmlPlayer"
  @dimensions="setDimensions"
  @updated="setPlayback")

//-VideoFileInput(
  v-if="opts.src"
  :src="opts.src"
  v-visible="opts.showHtmlPlayer"
  @dimensions="setDimensions"
  @updated="setPlayback")

VideoFileInput(
  :src="opts.src"
  @play="setPlaybackRef"
  @pause="videoFilePlaying = false"
  v-visible="opts.showHtmlPlayer")

//-VideoFileInput(
  v-if="opts.src"
  :src="opts.src"
  v-visible="opts.showHtmlPlayer"
  @playing="v => videoFilePlaying = v"
  )
  //- @playing="setPlayback")
  //- @init="setVideoFileRef"

//- PlaybackInScene(
//-   v-if="opts.scenePlayerOpacity > 0"
//-   :el="playbackRef"
//-   :videoWidth="videoWidth"
//-   :videoHeight="videoHeight"
//-   :width="opts.width"
//-   :opacity="opts.scenePlayerOpacity")
  :playing="!!playbackRef"

  //- :image="results.image"
//-CanvasInScene(
  v-if="ready && opts.scenePlayerOpacity > 0"
  :playing="playbackRef !== null"
  :results="results"
  :scale="opts.width"
  :opacity="opts.scenePlayerOpacity")
//-CanvasInScene(
  v-if="opts.scenePlayerOpacity > 0"
  :playing="playing"
  :results="results"
  :scale="opts.width"
  :opacity="opts.scenePlayerOpacity")

Stickman(
  v-if="opts.keypointLimit && (opts.videoDeviceId || opts.src)"
  :results="results"
  :playing="videoFilePlaying"
  :position="[3, 0, 3]"
  :width="opts.width"
  :zMulti="opts.zMulti"
  :keypointLimit="opts.keypointLimit")

//-Stickman(
  v-if="opts.keypointLimit && (opts.videoDeviceId || opts.src)"
  :results="results"
  :landmarks="results.poseLandmarks"
  :position="[-3, 0, -3]"
  :videoWidth="videoWidth"
  :videoHeight="videoHeight"
  :scale="scale"
  :width="opts.width"
  :zMulti="opts.zMulti"
  :keypointLimit="opts.keypointLimit")
</template>

<script lang="ts" setup>
import type { Ref } from "vue"
import type { UseMediaControlsReturn } from "@vueuse/core"
import { Group } from "three"
import { reactive, inject, provide, ref, toRef, watch } from "vue"
import { useDevicesList, set, invoke, until, get, unrefElement, and, or, useMediaControls } from "@vueuse/core"
import { useBlazePose } from "../../composables/useBlazePose"
import { div, selectableMedias } from "../../misc/utils"
// import { ResultsListener } from "public/pose"
// import type { ResultsListener } from "../../../public/pose/index.d"

const emit = defineEmits(["loaded"])

let playbackRef: Ref<HTMLVideoElement | undefined> = ref()
let videoFilePlaying = ref(false)
// let videoFileControls: UseMediaControlsReturn = {} as UseMediaControlsReturn
// const videoFilePlaying = ref(false)

const setPlaybackRef = (ref: Ref<HTMLVideoElement>) => {
  set(playbackRef, get(ref))
  set(videoFilePlaying, true)
}


// const setPlayback = (v: HTMLVideoElement | undefined) => {
//   set(playbackRef, v)
// }

// const videoFileRef = ref<HTMLVideoElement>()

// const setVideoFileRef = (ref: Ref<HTMLVideoElement>) => {
//   set(videoFileRef, ref.value)
// }


// const setPlayback = (ref: Ref<HTMLVideoElement | undefined>) => {
//   set(playbackRef, ref.value)
//   useBlazePose({ el: playbackRef })
// }


// const poseResults: ResultsListener = results => {
//   console.log("RES", results)
// }


const { videoInputs } = useDevicesList({ requestPermissions: true })

// const { ready, estimatePose } = useBlazePose({ el: playbackRef, results: poseResults })
const { results, ready, estimatePose } = useBlazePose(playbackRef)
// const { results, ready, estimatePose } = useBlazePose(videoFileRef)

const videos = [
  "",
  "videos/happy.webm",
  "videos/mask.webm",
  "videos/yoga1.webm",
  "videos/yoga2.webm",
  "videos/26958781a.webm",
]

const gui = inject<dat.GUI>("gui")!
const scene = inject<THREE.Scene>("scene")!
const tickFns = inject<Set<TickFn>>("tickFns")!

const opts = reactive({
  videoDeviceId: "",
  src: "",
  showHtmlPlayer: false,
  scenePlayerOpacity: 0.69,
  width: 4,
  zMulti: 250,
  keypointLimit: 33,
})

// const playing = ref(false)

// watch(() => get(or(opts.src, opts.videoDeviceId)), hasSource => set(playing, hasSource))

const folder = gui.addFolder("Pose group")
folder
  .addReactiveSelect(opts, "videoDeviceId", selectableMedias(videoInputs))
  .name("Device input")
  .onChange(() => {
    opts.src = ""
    folder.updateDisplay()
  })
folder
  .add(opts, "src", videos)
  .name("File input")
  .onChange(() => {
    opts.videoDeviceId = ""
    folder.updateDisplay()
  })
folder.add(opts, "showHtmlPlayer").name("Show ⍃video⍄")
folder.add(opts, "scenePlayerOpacity", 0, 1, 0.01).name("Scene player opacity")
folder.add(opts, "width", 0.1, 10, 0.1).name("Width (metre)")
folder.add(opts, "zMulti", 1, 1000, 1).name("Z-axis multiplier")
folder.add(opts, "keypointLimit", 0, 33, 1).name("Visible keypoints")
folder.open()

const root = new Group()
scene.add(root)
provide("root", root)


// const initVideoFile = (params: { videoRef: Ref<HTMLVideoElement>, controls: UseMediaControlsReturn }) => {
// const initVideoFile = ({ videoRef, controls }: { videoRef: Ref<HTMLVideoElement>, controls: UseMediaControlsReturn }) => {
// const initVideoFile = ({ videoRef, controls }: { videoRef: Ref<HTMLVideoElement>, controls: UseMediaControlsReturn }) => {
// const initVideoFile = (videoRef, playing) => {
// const initVideoFile = (playing) => {
//   // set(playbackRef, get(videoRef))
//   // set(videoFilePlaying, get(params.controls.playing))
//   videoFilePlaying = playing
//   // videoFileControls = params.controls
// }


// const videoControls = useMediaControls(playbackRef, { src: opts.src })

// const videoWidth = ref(640)
// const videoHeight = ref(480)
// const scale = div(toRef(opts, "width"), videoWidth)

// const setDimensions = (v: InputDimensions) => {
//   set(videoWidth, v.videoWidth)
//   set(videoHeight, v.videoHeight)

//   // console.log("JUGUUU", unrefElement(playbackRef))
//   // console.log("JUGUUU", unrefElement(playbackRef))
//   // @ts-ignore
//   // await until(playbackRef.value.loadeddata).toBe(4)
//   // setTimeout(() => {
//   //   useBlazePose({ el: playbackRef })
//   // }, 1000)
// }

invoke(async () => {
  await until(ready).toBeTruthy()

  watch(
    videoFilePlaying,
    isPlaying => {
      if (isPlaying) {
        tickFns.add(estimatePose)
      } else {
        tickFns.delete(estimatePose)
      }
    },
    { immediate: true }
  )

  emit("loaded")
})
</script>
