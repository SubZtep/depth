<template></template>

<script lang="ts" setup>
import type { PropType } from "vue"
import { get } from "@vueuse/core"
import { MeshBasicMaterial, VideoTexture, PlaneBufferGeometry, Mesh, DoubleSide, Group } from "three"
import { inject, toRefs, watch, onBeforeUnmount, watchEffect } from "vue"
import { useAssets } from "../../composables/useAssets"
import { div } from "../../misc/utils"

const props = defineProps({
  el: { type: Object as PropType<HTMLVideoElement | undefined>, required: false },
  videoWidth: { type: Number, required: true },
  videoHeight: { type: Number, required: true },
  width: { type: Number, required: true },
})
const { el, videoWidth, videoHeight, width } = toRefs(props)

const { assets } = useAssets()
const root = inject<Group>("root")!

const noVideoMaterial = assets.get("noVideoMaterial") as THREE.MeshBasicMaterial
let videoTexture: VideoTexture | undefined = undefined
const videoMaterial = new MeshBasicMaterial({ side: DoubleSide })
const playerGeometry = new PlaneBufferGeometry()
const player = new Mesh(playerGeometry, noVideoMaterial)
root.add(player)

const stopWatch = watch(
  el!,
  videoEl => {
    if (videoTexture !== undefined) {
      videoTexture.dispose()
      videoTexture = undefined
    }

    if (videoEl === undefined) {
      player.material = noVideoMaterial
    } else {
      videoTexture = new VideoTexture(videoEl)
      videoMaterial.map = videoTexture
      player.material = videoMaterial
    }
  },
  { immediate: true }
)

const ratio = div(videoWidth, videoHeight)
const height = div(width, ratio)

watchEffect(() => {
  player.scale.set(get(width), get(height), 0)
  player.position.set(get(width) / 2, get(height) / 2, 0)
})

onBeforeUnmount(() => {
  stopWatch()
  root.remove(player)
  videoTexture?.dispose()
  videoMaterial.dispose()
  playerGeometry.dispose()
})
</script>
