<template lang="pug">
ParaPanel(v-if="!loaded" title="Tile 1 Material")
  div Repeat
  InputXY(v-model="state.repeat")

  div shininess
  input(type="range" min="0" max="50" v-model="state.shininess")
  div bump scale
  input(type="range" min="0" max="50" v-model="state.bumpScale")

slot(:material="material")
</template>

<script lang="ts">
let material: MeshPhongMaterial | undefined
</script>

<script lang="ts" setup>
import { useScene } from "@depth/canvas"
import { getWorld } from "@depth/physics"
import { ColliderDesc } from "@dimforge/rapier3d-compat"
import { FrontSide, LinearFilter, LinearMipmapLinearFilter, NearestFilter, RepeatWrapping, sRGBEncoding } from "three/src/constants"
import { PlaneGeometry } from "three/src/geometries/PlaneGeometry"
import { LoadingManager } from "three/src/loaders/LoadingManager"
import { TextureLoader } from "three/src/loaders/TextureLoader"
import { MeshPhongMaterial } from "three/src/materials/MeshPhongMaterial"

const props = defineProps<{
  repeat?: [number, number],
}>()

const state = reactive({
  repeat: props.repeat ?? [2, 2] as [number, number],
  shininess: 15,
  bumpScale: 15,
})

const loadManager = new LoadingManager()

const loader = new TextureLoader(loadManager).setPath("/textures/terrain/Tiles_045_SD/")

loadManager.onProgress = (url, loaded, total) => {
  console.log(`${url}: ${loaded}/${total}`)
}

// const material = new MeshStandardMaterial({
//   aoMap: loader.load("Tiles_045_ambientOcclusion.webp"),
//   map: loader.load("Tiles_045_basecolor.webp"),
//   bumpMap: loader.load("Tiles_045_height.webp"),
//   normalMap: loader.load("Tiles_045_normal.webp"),
//   roughnessMap: loader.load("Tiles_045_roughness.webp"),
//   side: FrontSide,
//   bumpScale: 10,
//   // roughness: 15,
//   // metalness: 5,
//   // depthTest: true,
// })

const loaded = ref(!!material)

if (!material) {
  material = new MeshPhongMaterial({
    aoMap: loader.load("Tiles_045_ambientOcclusion.webp"),
    map: loader.load("Tiles_045_basecolor.webp"),
    bumpMap: loader.load("Tiles_045_height.webp"),
    normalMap: loader.load("Tiles_045_normal.webp"),
    // roughnessMap: loader.load("Tiles_045_roughness.webp"),
    // side: FrontSide,
    // bumpScale: 15,
    // shininess: 15,
    // roughness: 15,
    // metalness: 5,
    // depthTest: true,
  })
  material.map!.encoding = sRGBEncoding
  // material.map!.minFilter = LinearMipmapLinearFilter
  // material.map!.repeat.set(2, 2)
  material.map!.wrapS = RepeatWrapping
  material.map!.wrapT = RepeatWrapping
}

watchEffect(() => {
  material!.map!.repeat.set(state.repeat[0], state.repeat[1])
  material!.shininess = state.shininess
  material!.bumpScale = state.bumpScale
  // material.needsUpdate = true
})
</script>
