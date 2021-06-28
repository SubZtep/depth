<template>
</template>

<script lang="ts" setup>
import { TextureLoader, MeshBasicMaterial, VideoTexture, PlaneBufferGeometry, Mesh, DoubleSide, Group } from "three"
import { get, invoke, set, tryOnMounted, until, useEventListener } from "@vueuse/core"
import { div } from "../misc/utils"
import { defineProps, useContext, inject, onBeforeUnmount, ref, unref, watchEffect, toRef, onMounted } from "vue"

import { scene } from "../composables/useThreeJs"

const playerState = inject<PlayerState>("playerState")!
const parent = inject<Group>("root")!
const videoRef = toRef(playerState, "videoRef")

// console.log("3D", useContext())

// invoke(() => {
//   until(playerState.playing).toBeTruthy()
//   console.log("fasza")
// })

let noVideoMaterial: THREE.MeshBasicMaterial | undefined = undefined
let videoTexture: THREE.VideoTexture | undefined = undefined
let videoMaterial: THREE.MeshBasicMaterial | undefined = undefined
let player: VideoPlayerMesh | undefined = undefined

const width = ref(2)
const scale = div(width, playerState.videoWidth)
const ratio = div(playerState.videoWidth, playerState.videoHeight)

const playerGeometry = new PlaneBufferGeometry()
const height = div(width, ratio)

const loader = new TextureLoader()

// const playing = ref(false)
// useEventListener(videoRef, "play", () => set(playing, true))
// useEventListener(videoRef, "emptied", () => set(playing, false))

onMounted(() => {
  videoTexture = new VideoTexture(unref(videoRef)!)
  videoMaterial = new MeshBasicMaterial({ map: videoTexture, side: DoubleSide })

  loader.load("no-video.png", map => {
    noVideoMaterial = new MeshBasicMaterial({ map, transparent: true, side: DoubleSide })
    player = new Mesh(playerGeometry, noVideoMaterial)
    parent.add(player)

    watchEffect(() => {
      // player!.visible = get(showObj)
      player!.visible = true
      player!.scale.set(get(width), get(height), 1)
      player!.position.set(get(width) / 2, get(height) / 2, 0)
      player!.material = get(playerState.playing) ? videoMaterial! : noVideoMaterial!
    })
  })
})

onBeforeUnmount(() => {
  player && parent.remove(player)
  videoTexture?.dispose()
  videoMaterial?.dispose()
  playerGeometry.dispose()
})


// setInterval(() => {
//   // console.log(playerState.videoHeight)
// }, 1000)

// const props = defineProps({
//   // opts: { type: Object as PropType<InputGroupBase>, required: true },
//   src: { type: String, required: false },
//   srcObject: { type: Object as PropType<MediaStream>, required: false },
// })

</script>
