<template lang="pug">
//- Title.filter.invert-100 Finish Flawless ~OR~ No Meta But Bad Choiced
Title Finish Flawless ~OR~ No Meta But Bad Choiced
//- .text-white {{pic}}

//- SkyBox(:nr="15")
//- InfiniteGrid(:size="1" :color="0x696969" :distance="69")
DirectionalLight(:link-camera-position="true")
//- FresnelShaderMaterial(v-slot="{ material }")
//- VoxelTerrain(:cell-size="10" :cell-height="1" v-bind="{ position: [0, 0, 10], material }")

//- {{text}}

//- ImagePlane(url="/story/2020.jpeg" :width="10" :height="10" :position="[0, 5, 0]" :ref="image" @loaded="async mesh => await fitCamera(mesh)")
//- ImagePlane(url="/story/2020.jpeg" :width="10" :height="10" :position="[0, 1, -1]" :ref="image" @loaded="fitCamera")


ImagePlane(:url="`/story/${src}`" v-for="(src, i) in pics" :key="src" :dimensions="[12, 12, 0]" :position="[points[i].x, 6, points[i].y]")
//- ImagePlane(:url="`/story/${src}`" v-for="(src, i) in picChain" :key="src" :dimensions="[1, 1, 0]" :position="points[i].position")
//- ImagePlane(:url="`/story/${src}`" v-for="(src, i) in picChain" :dimensions="[2, 2, 0.1]" :position="[0, 2, -(i * 10)]" :ref="image")

//- ImagePlane(:url="pic", :position="[0, 1, -2]")

//- SkyBox(:nr="15")
//- InfiniteGrid(:size="1" :color="0x696969" :distance="69")

//- Teleport(to="#editor > #hierarchy")
//-   EditorPanel
//-     h3 Page Entities
//-     AssetEntries(:assets-data="AssetsData" v-slot="{ entries }")
//-       .entity(v-for="{ assetComponent, name, category } in Object.fromEntries(entries)" :key="name")
//-         input(type="radio" name="activeComponent" :value="name")
//-         label
//-           | {{name}}
//-           .tags
//-             .tag(v-for="(cat in category" :key="cat") {{ cat }}

//-         component(:is="assetComponent")
</template>

<script lang="ts" setup>
import * as THREE from "three"
import picChain from "./blockstripstorychain.json"
import { useScene } from "@depth/canvas"
import SkyBox from "~/3d/components/SkyBox"
import InfiniteGrid from "~/components/3d/InfiniteGrid"
import { useCameraControls } from "@depth/controller"
import { nextTick } from "vue"
import { useTimeoutFn, useIntervalFn } from "@vueuse/core"

const image = ref()
const toast = useToast()

toast.error("Missing meta∞valid UUID!", { timeout: 3000 })

useTimeoutFn(() => toast.warning("Change  🦠🥶💦  to  🔥💝💩  starts with an unknown.", { timeout: 3000 }), 3000)
useTimeoutFn(
  () =>
    toast.info("Hope for ∞access∞! Find image sequences in my conniving order.", {
      timeout: 4500,
    }),
  10000
)

const pics = picChain.sort(() => 0.5 - Math.random()).slice(0, 10)

const scene = useScene()
scene.background = new THREE.Color(0x221100)

const cc = useCameraControls()
cc.infinityDolly = true

const curve = new THREE.ArcCurve(0, 0, 20, 0, Math.PI * 2, true)
curve.arcLengthDivisions = pics.length
const points = curve.getSpacedPoints(pics.length)

useIntervalFn(() => {
  cc.rotateAzimuthTo((0.5 - Math.random()) * (2 * Math.PI), true)
}, 4569)
</script>
