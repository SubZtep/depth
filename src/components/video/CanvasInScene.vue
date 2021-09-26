<template lang="pug">
</template>

<script lang="ts" setup>
import type { GpuBuffer } from "public/pose"
import { CanvasTexture, MeshBasicMaterial, PlaneBufferGeometry, Mesh, DoubleSide } from "three"
import { singleFns, loopFns } from "~/packages/ThreeJS/useRenderLoop"

const props = defineProps({
  image: { type: Object as PropType<GpuBuffer>, required: true },
  scale: { type: Number, default: 1 },
  opacity: { type: Number, default: 1 },
})

const canvasTexture = new CanvasTexture(get(props.image))
const videoMaterial = new MeshBasicMaterial({
  side: DoubleSide,
  transparent: true,
  opacity: props.opacity,
  map: canvasTexture,
})

const playerGeometry = new PlaneBufferGeometry(1, 1)
const player = new Mesh(playerGeometry, videoMaterial)
const aspectRatio = useCssVar("--video-aspect-ratio")

singleFns.add(({ scene }) => scene.add(player))

const updateTexture: LoopFn = () => {
  canvasTexture.needsUpdate = true
}

loopFns.add(updateTexture)

watch(() => props.scale, scale => {
  const width = scale * +get(aspectRatio)
  player.scale.set(width, scale, 1)
  player.position.set(width / 2, scale / 2, 0)
}, { immediate: true })

watch(() => props.opacity, opacity => {
  videoMaterial.opacity = opacity
})

onBeforeUnmount(() => {
  loopFns.delete(updateTexture)
  singleFns.add(({ scene }) => scene.remove(player))
  canvasTexture.dispose()
  videoMaterial.dispose()
  playerGeometry.dispose()
})
</script>
