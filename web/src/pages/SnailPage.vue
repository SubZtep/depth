<template lang="pug">
Title
  div
    .text-left.italic Snail, Snailer, Snalest
    .text-right — SO🐌

EntityPanel(title="Page gadgets")
  //- LensFlare(:position="[i, 4, 5]" v-for="i in [...Array(2).keys()]" :key="i")
  //- LensFlare(:position="[i - 1, 3, 5]" v-for="i in [...Array(3).keys()]" :key="i")
  //- LensFlare(:position="[i - 1, 2, 5]" v-for="i in [...Array(3).keys()]" :key="i")
  //- LensFlare(:position="[i, 1, 5]" v-for="i in [...Array(1).keys()]" :key="i")
  //- InfinitePlane(:color="0x000900")
  //- ThreeGlobe(:scale="0.01" :position="[0, 2, 2]")
  DirectionalLight(:link-camera-position="true")

//- LogarithmicShell(:position="[0, 2, 200]")
//- LogarithmicShell
  //- MeshOutline(v-if="hover" v-bind="{ mesh, position, dimensions }")

LogShell(:state="shellStore")
StatePanel(:state="shellStore")

//- pre.text-white {{ shellStore }}

</template>

<script lang="ts" setup>
// import { useCameraControls } from "@depth/controller"
// import LogarithmicShell from "~/components/3d/LogarithmicShell.vue"
import LogShell from "~/components/stateless3d/LogShell"
import * as crate from "~/3d/entities/woodCrate"
import { useScene } from "@depth/canvas"
import { useShellStore } from "~/stores/snail"
// import { useStorage } from "@vueuse/core"

const shellStore = useShellStore()
// const store = useStorage("snail:shell", shellStore)
// shellStore.$patch(store.value)

// shellStore.$subscribe((mutation, state) => {
//   // console.log([mutation, state])
//   // @ts-ignore
//   store.value = state
// })

// const cc = useCameraControls()
// cc.zoomTo(-10, false)
// setTimeout(() => cc.zoomTo(1, true), 3000)
// cc.dollyTo(10, true)

const scene = useScene()
scene.add(crate.mesh)

crate.rigidBody.setGravityScale(0.1, false)

const pushCrate = () => {
  crate.setPosition(0, 2, 2)
  crate.rigidBody.setLinvel({ x: 0, y: 0, z: 0 }, true)
  crate.rigidBody.applyImpulse({ x: 0, y: 0, z: 15 }, true)
}

addGuiFolder(folder => {
  folder.name = "♖ Playground"
  folder.add({ pushCrate }, "pushCrate")
})

</script>
