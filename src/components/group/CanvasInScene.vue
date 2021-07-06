<template></template>

<script lang="ts" setup>
import type { Results } from "../../../public/pose/index.d"
import type { PropType, WatchStopHandle } from "vue"
import { get, invoke, until, whenever } from "@vueuse/core"
import { Texture, MeshBasicMaterial, VideoTexture, PlaneBufferGeometry, Mesh, DoubleSide, Group } from "three"
import { inject, toRefs, watch, onBeforeUnmount, toRaw, watchEffect } from "vue"
import { useAssets } from "../../composables/useAssets"
import { div } from "../../misc/utils"

const props = defineProps({
  results: { type: Object as PropType<Results>, required: true },
  // image: { type: Object as PropType<HTMLCanvasElement>, required: true },
  // canvas: { type: Object as PropType<HTMLCanvasElement>, required: true },
  playing: { type: Boolean, required: true },
  scale: { type: Number, required: true },
  opacity: { type: Number, default: 1 },
})
// const results = props.results
// const { playing, scale, opacity } = toRefs(props)
// const { playing, scale, opacity } = toRefs(props)
// const { playing, opacity } = toRefs(props)
const { playing, opacity } = toRefs(props)

const { assets } = useAssets()
const root = inject<Group>("root")!

let stopWatch: WatchStopHandle
const canvasTexture = new Texture()
const videoMaterial = new MeshBasicMaterial({
  map: canvasTexture,
  side: DoubleSide,
  transparent: true,
  opacity: get(opacity),
})

const noVideoMaterial = assets.get("noVideoMaterial") as THREE.MeshBasicMaterial

const playerGeometry = new PlaneBufferGeometry()
const player = new Mesh(playerGeometry, noVideoMaterial)
root.add(player)

watchEffect(() => {
  player.material.opacity = get(opacity)
  player.material = playing ? videoMaterial : noVideoMaterial
})

whenever(playing, async () => {
  await until(props.results.image).not.toBeUndefined()
  canvasTexture.image = toRaw(props.results.image)
  canvasTexture.needsUpdate = true
})

// watch(() => props.results.image, img => {
//   console.log("CHANGED", img)
// })

// const updateTexture: TickFn = () => {
//   canvasTexture.needsUpdate = true
//   return Promise.resolve()
// }

// const tickFns = inject<Set<TickFn>>("tickFns")!

// // console.log("LALA", props.image)
// invoke(async () => {
//   await until(props.results.image).not.toBeUndefined()
//   // console.log(["LALA", get(image)])
//   // canvasTexture.image = get(image)
//   canvasTexture.image = toRaw(props.results.image)
//   canvasTexture.needsUpdate = true
//   root.add(player)

//   // watch(props.results.image, () => {
//   //   console.log("CHANGED")
//   // })

//   // watch(playing, isPlaying => {
//   //   if (isPlaying) {
//   //     tickFns.add(updateTexture)
//   //   } else {
//   //     tickFns.delete(updateTexture)
//   //   }
//   // })

// })



// onMounted(() => {
//   // await until(playing).toBe(true)
//   console.log("PLAYING", [get(playing), get(image).width, get(image).height])
//   // canvasTexture = new CanvasTexture(get(image))

//   // const noVideoMaterial = assets.get("noVideoMaterial") as THREE.MeshBasicMaterial
//   // let videoTexture: VideoTexture | undefined = undefined

//   // videoMaterial = new MeshBasicMaterial({
//   //   map: canvasTexture,
//   //   side: DoubleSide,
//   //   transparent: true,
//   //   opacity: get(opacity),
//   // })

//   // playerGeometry = new PlaneBufferGeometry()
//   // const player = new Mesh(playerGeometry, noVideoMaterial)
//   // const player = new Mesh(playerGeometry, noVideoMaterial)
//   // player = new Mesh(playerGeometry, videoMaterial)


//   // const ratio = div(get(image).width, get(image).height)
//   // const height = div(get(scale), ratio)

//   // watchEffect(() => {
//   //   player.scale.set(get(scale), get(height), 0)
//   //   player.position.set(get(scale) / 2, get(height) / 2, 0)
//   //   videoMaterial.opacity = get(opacity)
//   // })


//   // root.add(player)

//   // tickFns.add(updateTexture)

//   // stopWatch = watch(() => image.value.toDataURL, () => {
//   //   console.log("JUHUU")
//   //   canvasTexture.needsUpdate = true
//   // })
// })

// onBeforeUnmount(() => {
//   stopWatch()
//   // tickFns.delete(updateTexture)
//   // root.remove(player)
//   // canvasTexture?.dispose()
//   // videoMaterial?.dispose()
//   // playerGeometry?.dispose()
// })
</script>
