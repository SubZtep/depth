<template></template>

<script lang="ts" setup>
import type { Results } from "../../../public/pose/index.d"
import type { PropType, Ref } from "vue"
import { get, until } from "@vueuse/core"
import { Texture, MeshBasicMaterial, PlaneBufferGeometry, Mesh, DoubleSide, Group } from "three"
import { inject, toRef, toRefs, watch, onBeforeUnmount } from "vue"
import { useAssets } from "../../packages/ThreeJS/useAssets"
import { transformables } from "../../packages/ThreeJS/useTransformControls"
import { useThreeJSAlterEventHook } from "../../packages/threeJs/plugin"

const threeJsHook = useThreeJSAlterEventHook()
const props = defineProps({
  results: { type: Object as PropType<Results>, required: true },
  playing: { type: Boolean, required: true },
  scale: { type: Number, default: 1 },
  opacity: { type: Number, default: 1 },
})

const results = props.results
const image = toRef(results, "image") as Ref<HTMLCanvasElement>
const { playing, opacity } = toRefs(props)
const { assets } = useAssets()
// const root = inject<Group>("root")!

const videoMaterial = new MeshBasicMaterial({
  side: DoubleSide,
  transparent: true,
  opacity: get(opacity),
})

const noVideoMaterial = assets.get("noVideoMaterial") as THREE.MeshBasicMaterial

const playerGeometry = new PlaneBufferGeometry()
const player = new Mesh(playerGeometry, noVideoMaterial)
console.log({ player })
// player.name = "canvasInScene"
// root.add(player)
threeJsHook.trigger({ cmd: "addToScene", payload: player })
transformables.push(player.name)

let canvasTexture: Texture | undefined

const updateTexture: TickFn = () => {
  if (canvasTexture) {
    canvasTexture.needsUpdate = true
  }
  return Promise.resolve()
}

// const tickFns = inject<Set<TickFn>>("tickFns")!

watch(playing, async isPlaying => {
  if (isPlaying) {
    await until(image).not.toBeUndefined()
    canvasTexture = new Texture(get(image))
    videoMaterial.map = canvasTexture
    player.material = videoMaterial

    threeJsHook.trigger({ cmd: "addToScene" })
    tickFns.add(updateTexture)

    threeJsHook.trigger({ cmd: "addToTickFn", payload: updateTexture })
  } else {
    tickFns.delete(updateTexture)
    canvasTexture?.dispose()
    player.material = noVideoMaterial
    player.material.needsUpdate = true
  }
})

onBeforeUnmount(() => {
  tickFns.delete(updateTexture)
  root.remove(player)
  canvasTexture?.dispose()
  videoMaterial.dispose()
  playerGeometry.dispose()
})
</script>
