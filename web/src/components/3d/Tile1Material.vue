<template lang="pug">
ParaPanel(v-if="!loaded" title="Tile 1 Material")
  div Repeat
  InputXY(v-model="state.repeat" :max="1000" :hover="props.hover === true")

  div shininess
  InputNumber(:min="0" :max="50" v-model="state.shininess" :hover="props.hover === true")

  div bump scale
  InputNumber(:min="0" :max="50" v-model="state.bumpScale" :hover="props.hover === true")

slot(:material="material")
</template>

<script lang="ts">
let material: MeshBasicMaterial | MeshPhongMaterial | undefined
</script>

<script lang="ts" setup>
import { RepeatWrapping, sRGBEncoding } from "three/src/constants"
import { LoadingManager } from "three/src/loaders/LoadingManager"
import { TextureLoader } from "three/src/loaders/TextureLoader"
import { MeshBasicMaterial } from "three/src/materials/MeshBasicMaterial"
import { MeshPhongMaterial } from "three/src/materials/MeshPhongMaterial"

const props = defineProps<{
  repeat?: [number, number]
  hover?: boolean
}>()

const state = reactive({
  repeat: props.repeat ?? ([2, 2] as [number, number]),
  shininess: 15,
  bumpScale: 15,
})

const loadManager = new LoadingManager()

const loader = new TextureLoader(loadManager).setPath("/textures/terrain/Tiles_045_SD/")

// loadManager.onProgress = (url, loaded, total) => {
//   console.log(`${url}: ${loaded}/${total}`)
// }

const loaded = ref(!!material)

if (!material) {
  material = new MeshBasicMaterial({
    aoMap: loader.load("Tiles_045_ambientOcclusion.webp"),
    map: loader.load("Tiles_045_basecolor.webp"),
    envMap: loader.load("Tiles_045_height.webp"),
    specularMap: loader.load("Tiles_045_roughness.webp"),
  })
  // material = new MeshPhongMaterial({
  //   aoMap: loader.load("Tiles_045_ambientOcclusion.webp"),
  //   map: loader.load("Tiles_045_basecolor.webp"),
  //   bumpMap: loader.load("Tiles_045_height.webp"),
  //   normalMap: loader.load("Tiles_045_normal.webp"),
  //   // roughnessMap: loader.load("Tiles_045_roughness.webp"),
  //   // side: FrontSide,
  //   // bumpScale: 15,
  //   // shininess: 15,
  //   // roughness: 15,
  //   // metalness: 5,
  //   // depthTest: true,
  // })
  material.map!.encoding = sRGBEncoding
  // material.map!.minFilter = LinearMipmapLinearFilter
  // material.map!.repeat.set(2, 2)
  material.map!.wrapS = RepeatWrapping
  material.map!.wrapT = RepeatWrapping
}

watchEffect(() => {
  material!.map!.repeat.set(state.repeat[0], state.repeat[1])
  // material!.shininess = state.shininess
  // material!.bumpScale = state.bumpScale
  material!.needsUpdate = true
})
</script>
