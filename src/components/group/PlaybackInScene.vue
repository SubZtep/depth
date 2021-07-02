<template></template>

<script lang="ts" setup>
import type { PropType } from "vue"
import { MeshBasicMaterial, VideoTexture, PlaneBufferGeometry, Mesh, DoubleSide, Group } from "three"
import { inject, ref, watch, onBeforeUnmount } from "vue"
import { useAssets } from "../../composables/useAssets"

const props = defineProps({
  el: { type: Object as PropType<HTMLVideoElement>, required: false },
})

const { assets } = useAssets()
const root = inject<Group>("root")!

const playerGeometry = new PlaneBufferGeometry()
const noVideoMaterial = assets.get("noVideoMaterial") as THREE.MeshBasicMaterial
let videoTexture: VideoTexture | undefined = undefined
const videoMaterial = new MeshBasicMaterial({ side: DoubleSide })
const player = new Mesh(playerGeometry, videoMaterial)
root.add(player)

watch(
  () => props.el,
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

const width = ref(4)
const height = ref(2)

playerGeometry.scale(width.value, height.value, 0)

onBeforeUnmount(() => {
  root.remove(player)
  videoTexture?.dispose()
  videoMaterial.dispose()
  playerGeometry.dispose()
})
</script>
