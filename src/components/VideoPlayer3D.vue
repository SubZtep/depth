<template>
</template>

<script lang="ts" setup>
import { TextureLoader, MeshBasicMaterial, VideoTexture, PlaneBufferGeometry, Mesh, DoubleSide, Group } from "three"
import { inject, onBeforeUnmount, ref, unref, watchEffect, toRef, onMounted } from "vue"
import { get } from "@vueuse/core"
import { div } from "../misc/utils"

const playerState = inject<PlayerState>("playerState")!
const parent = inject<Group>("root")!
const videoRef = toRef(playerState, "videoRef")

let noVideoMaterial: THREE.MeshBasicMaterial | undefined = undefined
let videoTexture: THREE.VideoTexture | undefined = undefined
let videoMaterial: THREE.MeshBasicMaterial | undefined = undefined
let player: VideoPlayerMesh | undefined = undefined

const playerGeometry = new PlaneBufferGeometry()
const loader = new TextureLoader()

const ratio = div(playerState.videoWidth, playerState.videoHeight)
const width = ref(2)
const height = div(width, ratio)

onMounted(() => {
  videoTexture = new VideoTexture(unref(videoRef)!)
  videoMaterial = new MeshBasicMaterial({ map: videoTexture, side: DoubleSide })

  loader.load("no-video.png", map => {
    noVideoMaterial = new MeshBasicMaterial({ map, transparent: true, side: DoubleSide })
    player = new Mesh(playerGeometry, noVideoMaterial)
    parent.add(player)

    watchEffect(() => {
      player!.visible = true
      player!.scale.set(get(width), get(height), 0)
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
</script>
