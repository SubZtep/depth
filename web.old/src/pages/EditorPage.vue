<template lang="pug">
Title
  div
    .text-left.italic Snail, Snailer, Snalest
    .text-right — SO🐌

SkyBox(:nr="15")
InfiniteGrid(:size="1" :color="0x696969" :distance="69")

Teleport(to="#editor > #hierarchy")
  EditorPanel
    h3 Page Entities
    AssetEntries(:assets-data="AssetsData" v-slot="{ entries }")
      .entity(v-for="{ assetComponent, name, category } in Object.fromEntries(entries)" :key="name")
        input(type="radio" name="activeComponent" :value="name")
        label
          | {{name}}
          .tags
            .tag(v-for="(cat in category" :key="cat") {{ cat }}

        component(:is="assetComponent")
</template>

<script lang="ts" setup>
import { AssetsData } from "@depth/assets"
import SkyBox from "~/3d/components/SkyBox"
import InfiniteGrid from "~/components/3d/InfiniteGrid"

// const scene = useScene()
// scene.background = new THREE.Color(0x8a0303)

// const loadAsset = (name: string) =>
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
