<template lang="pug">
</template>

<script lang="ts" setup>
import type { Results } from "../../../public/pose/index.d"
import type { PropType, Ref } from "vue"
import { get, until } from "@vueuse/core"
import { Texture, MeshBasicMaterial, PlaneBufferGeometry, Mesh, DoubleSide, Group, Object3D } from "three"
import { toRef, toRefs, onBeforeUnmount } from "vue"
import { useAssets } from "../../packages/ThreeJS/useAssets"
import { transformables } from "../../packages/ThreeJS/useTransformControls"
import { singleFns, loopFns } from "../../packages/ThreeJS/useRenderLoop"

const props = defineProps({
  results: { type: Object as PropType<Results>, required: true },
  playing: { type: Boolean, required: true },
  scale: { type: Number, default: 1 },
  opacity: { type: Number, default: 1 },
  parent: { type: Object as PropType<Object3D>, required: false },
})

// eslint-disable-next-line vue/no-setup-props-destructure
const results = props.results
const image = toRef(results, "image") as Ref<HTMLCanvasElement>
const { playing, opacity } = toRefs(props)
const { assets } = useAssets()

const videoMaterial = new MeshBasicMaterial({
  side: DoubleSide,
  transparent: true,
  opacity: get(opacity),
})

const noVideoMaterial = assets.get("noVideoMaterial") as THREE.MeshBasicMaterial

const playerGeometry = new PlaneBufferGeometry()
const player = new Mesh(playerGeometry, noVideoMaterial)
// console.log({ player })
// player.name = "canvasInScene"
// root.add(player)

if (props.parent !== undefined) {
  props.parent.add(player)
} else {
  singleFns.add(({ scene }) => scene.add(player))
}

transformables.push(player.name)

let canvasTexture: Texture | undefined

const updateTexture: LoopFn = () => {
  if (canvasTexture) {
    canvasTexture.needsUpdate = true
  }
}

watch(playing, async isPlaying => {
  if (isPlaying) {
    await until(image).not.toBeUndefined()
    canvasTexture = new Texture(get(image))
    videoMaterial.map = canvasTexture
    player.material = videoMaterial
    loopFns.add(updateTexture)
  } else {
    loopFns.delete(updateTexture)
    canvasTexture?.dispose()
    player.material = noVideoMaterial
    player.material.needsUpdate = true
  }
})

onBeforeUnmount(() => {
  loopFns.delete(updateTexture)
  if (props.parent !== undefined) {
    props.parent.remove(player)
  } else {
    singleFns.add(({ scene }) => scene.remove(player))
  }
  canvasTexture?.dispose()
  videoMaterial.dispose()
  playerGeometry.dispose()
})
</script>
