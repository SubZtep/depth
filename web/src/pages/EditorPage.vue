<template lang="pug">
Title
  div
    .text-left.italic Snail, Snailer, Snalest
    .text-right — SO🐌

//-Teleport(to="#hierarchy")
  HierarchyPanel(:hierarchy="sceneStore.hierarchy")

//- EditorPanel
  p q

//- EntityPanel(title="Page gadgets")
  //- LensFlare(:position="[i, 4, 5]" v-for="i in [...Array(2).keys()]" :key="i")
  //- LensFlare(:position="[i - 1, 3, 5]" v-for="i in [...Array(3).keys()]" :key="i")
  //- LensFlare(:position="[i - 1, 2, 5]" v-for="i in [...Array(3).keys()]" :key="i")
  //- LensFlare(:position="[i, 1, 5]" v-for="i in [...Array(1).keys()]" :key="i")
  //- InfinitePlane(:color="0x000900")
  //- ThreeGlobe(:scale="0.01" :position="[0, 2, 2]")
  DirectionalLight(:link-camera-position="true")

//- component(:is="LogarithmicShell" :position="[0, 2, 200]")
//- component(:is="comp" :position="[0, 2, 200]")
//- component(:is="comp" :position="[0, 2, 2]")

//- component(:is="comp.value" v-for="[key, comp] in Object.entries(assets)" :key="key")

LogarithmicShell

//- LogarithmicShell(:position="[0, 2, 200]")
//- LogarithmicShell
  //- MeshOutline(v-if="hover" v-bind="{ mesh, position, dimensions }")

//- LogShell(:state="shellStore")
//- StatePanel(:state="shellStore")
//- pre.text-white {{ shellStore }}

//- HeatmapTerrain
</template>

<script lang="ts" setup>
import * as THREE from "three"
import type { DefineComponent, ShallowRef } from "vue"
import { shallowRef, defineAsyncComponent } from "vue"
import { LogarithmicShell } from "@depth/assets"
import { useScene } from "@depth/canvas/dist/lib/helpers"
// import HeatmapTerrain from "@depth/assets"
// import { defineAsyncComponent } from "vue/dist/vue.esm-browser.js"
// import { createApp, defineAsyncComponent } from "./vue.esm-browser";
const comps = ["HeatmapTerrain", "LogarithmicShell"]
// const comps = ["HeatmapTerrain"]

// const acomp = name => defineAsyncComponent(() => import("@depth/assets"))
// const acomp = name => defineAsyncComponent(() => import("@depth/assets")[name])
// const acomp = name => defineAsyncComponent(() => import(`../components/3d/${name}.vue`))
// const acomp = name => defineAsyncComponent(() => import(`./src/components/3d/${name}.vue`))

// const compis = shallowRef([] as any[])
// const compis = ref([] as any[])
// const loadAsset = (name: string) => defineAsyncComponent(() => import("@depth/assets/"+name+".js"))
// const loadAsset = (name: string) => defineAsyncComponent(() => import("@depth/assets"))[name]()

// const loadAsset = (name: string) => defineAsyncComponent(async () => {
//   const module = await import("@depth/assets")
//   return module[name]
// })
const loadAsset = (name: string) =>
  defineAsyncComponent(
    () =>
      new Promise<DefineComponent>((resolve, reject) => {
        import("@depth/assets").then(package_ => {
          if (typeof package_[name] !== "undefined") {
            return resolve(package_[name] as DefineComponent)
          }
          reject()
        })
      })
  )

const assets = {
  HeatmapTerrain: shallowRef(loadAsset("HeatmapTerrain")),
  LogarithmicShell: shallowRef(loadAsset("LogarithmicShell")),
  // HeatmapTerrain: shallowRef(loadAsset("HeatmapTerrain")),
  // HeatmapTerrain: loadAsset("HeatmapTerrain"),
}

// const sceneStore = useSceneStore()
// const shellStore = useShellStore()
// // const store = useStorage("snail:shell", shellStore)
// // shellStore.$patch(store.value)

// // shellStore.$subscribe((mutation, state) => {
// //   // console.log([mutation, state])
// //   // @ts-ignore
// //   store.value = state
// // })

// // const cc = useCameraControls()
// // cc.zoomTo(-10, false)
// // setTimeout(() => cc.zoomTo(1, true), 3000)
// // cc.dollyTo(10, true)

const scene = useScene()
scene.background = new THREE.Color(0x8a0303)
// scene.add(crate.mesh)

// crate.rigidBody.setGravityScale(0.1, false)

// const pushCrate = () => {
//   crate.setPosition(0, 2, 2)
//   crate.rigidBody.setLinvel({ x: 0, y: 0, z: 0 }, true)
//   crate.rigidBody.applyImpulse({ x: 0, y: 0, z: 15 }, true)
// }

// addGuiFolder(folder => {
//   folder.name = "♖ Playground"
//   folder.add({ pushCrate }, "pushCrate")
// })
</script>
