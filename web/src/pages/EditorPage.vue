<template lang="pug">
Title
  div
    .text-left.italic Snail, Snailer, Snalest
    .text-right — SO🐌

Teleport(to="#editor > #hierarchy")
  //- .bg-teal-900.text-white.font-mono.px-2.py-1.border-3.border-teal-500.border-double
  div(:className="panelStyle")
    .flex.justify-between.items-center
      h3 Page Entities
      i.fa-solid.fa-square-info.cursor-help.opacity-85(title="Radio select below for component details. (panel on the right side) -->>>")
    label.block.my-1.cursor-pointer(v-for="cmp in comps" :key="cmp")
      input.mr-2(type="radio" name="activeComponent" :value="cmp")
      | {{cmp}}
  //- HierarchyPanel(:hierarchy="sceneStore.hierarchy")

component(:is="comp.value" v-for="[key, comp] in Object.entries(assets)" :key="key")

//- LogarithmicShell
  //- MeshOutline(v-if="hover" v-bind="{ mesh, position, dimensions }")

</template>

<script lang="ts" setup>
import * as THREE from "three"
import { css } from "@emotion/css"
import colors from "windicss/colors"
import type { DefineComponent } from "vue"
import { shallowRef, defineAsyncComponent } from "vue"
import { useScene } from "@depth/canvas/dist/lib/helpers"

const panelStyle = css`
  h3 {
    font-size: 1.25rem;
    line-height: 1.5;
    font-weight: 500;
    letter-spacing: 0.23px;
    font-family: JuliaMono;
  }
  background-color: ${colors.teal[900]};
  color: ${colors.white};
  font-family: JuliaMono;
  padding: 0.5rem 1rem;
  border: 2px outset ${colors.teal[800]};
  label:hover {
    text-shadow: -2px 3px #000, 2px 2px #000;
  }
  input {
    accent-color: ${colors.teal[800]};
  }
`

const scene = useScene()
scene.background = new THREE.Color(0x8a0303)

const loadAsset = (name: string) =>
  defineAsyncComponent(
    () =>
      new Promise<DefineComponent>((resolve, reject) => {
        import("@depth/assets").then(pkg => {
          if (pkg[name] === undefined) {
            return reject(new Error(`Asset ${name} not found`))
          }
          return resolve(pkg[name] as DefineComponent)
        })
      })
  )

const comps = ["HeatmapTerrain", "LogarithmicShell"]
const assets = Object.fromEntries(comps.map(name => [name, shallowRef(loadAsset(name))]))

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
