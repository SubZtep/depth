<template lang="pug">
Title
  div
    .text-left.italic Snail, Snailer, Snalest
    .text-right — SO🐌

//- Teleport(to="#editor > #hierarchy")
  div(:className="panelStyle")
    .flex.justify-between.items-center
      h3 Page Entities
      i.fa-solid.fa-square-info.cursor-help.opacity-85(title="Radio select below for component details. (panel on the right side) -->>>")

template(v-for="{ assetComponent, name, category } in assets" :key="name")
  Teleport(to="#editor > #hierarchy > .panel")
    .entity
      input(type="radio" name="activeComponent" :value="name")
      label
        | {{name}}
        .flex.opacity-65.gap-1
          .tag(v-for="(cat in category" :key="cat") {{ cat }}

  component(:is="assetComponent")

//- HierarchyPanel(:hierarchy="sceneStore.hierarchy")

// component(:is="comp.value" v-for="[key, comp] in Object.entries(assets)" :key="key")

//- LogarithmicShell
  //- MeshOutline(v-if="hover" v-bind="{ mesh, position, dimensions }")

</template>

<script lang="ts" setup>
import type { DefineComponent } from "vue"

import { AssetsData } from "@depth/assets"
import * as THREE from "three"
import { css } from "@emotion/css"
import colors from "windicss/colors"
import { useScene } from "@depth/canvas"
import { defineAsyncComponent, shallowRef } from "vue"

// const panelStyle = css`
//   h3 {
//     font-size: 1.25rem;
//     line-height: 1.5;
//     font-weight: 500;
//     letter-spacing: 0.23px;
//     font-family: JuliaMono;
//   }
//   background-color: ${colors.teal[900]};
//   color: ${colors.white};
//   font-family: JuliaMono;
//   padding: 0.5rem 1rem;
//   border: 2px outset ${colors.teal[800]};
//   label:hover {
//     text-shadow: -2px 3px #000, 2px 2px #000;
//   }
//   input {
//     accent-color: ${colors.teal[800]};
//   }
// `

const scene = useScene()
scene.background = new THREE.Color(0x8a0303)

// const loadAsset = (name: string) =>
//   defineAsyncComponent(
//     () =>
//       new Promise<DefineComponent>((resolve, reject) => {
//         import("@depth/assets").then(pkg => {
//           if (pkg[name] === undefined) {
//             return reject(new Error(`Asset ${name} not found`))
//           }
//           return resolve(pkg[name] as DefineComponent)
//         })
//       })
//   )

// const comps = ["HeatmapTerrain", "LogarithmicShell"]

// const assets = Object.fromEntries(comps.map(name => [name, shallowRef(loadAsset(name))]))

// const loader = loadAssets("@depth/assets")
// const assets = loader(AssetsData.map(({ file }) => file))
// const loader = loadAssets("@depth/assets")
// const assets = loader(AssetsData.map(({ file }) => file))

// const files: string[] = AssetsData.map(({ file }) => file)

// const assets: Record<string, ShallowRef> = {

// const pkg = await import("@depth/assets")
// console.log("FWEWEF", pkg)
// defineAsyncComponent(() => {})

const assetEntries = AssetsData.map(dataWithID => {
  const { id, ...data } = dataWithID

  const assetComponent = defineAsyncComponent(
    () =>
      new Promise<DefineComponent>((resolve, reject) => {
        import("@depth/assets").then(pkg => {
          if (pkg[id] === undefined) {
            return reject(new Error(`Asset ${id} not found`))
          }
          return resolve(pkg[id] as DefineComponent)
        })
      })
  )

  return [id, { assetComponent, ...data }]
})

// const assetEntries = AssetsData.map(dataWithID => {
//   const { id, ...data } = dataWithID

//   const assetComponent = defineAsyncComponent(
//     () =>
//       new Promise<DefineComponent>((resolve, reject) => {
//         if (pkg[data.name] === undefined) {
//           return reject(new Error(`Asset ${data.name} not found`))
//         }
//         return resolve(pkg[data.name] as DefineComponent)
//       })
//   )

//   return [id, { assetComponent, ...data }]
// })

const assets: Record<string, any> = {
  ...Object.fromEntries(assetEntries),
}

console.log(assets)

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
