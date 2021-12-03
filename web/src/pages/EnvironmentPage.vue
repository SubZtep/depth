<template lang="pug">
Title Environment
//- h1 LOLOLOL
</template>

<script lang="ts" setup>
import { addGuiFolder } from "@depth/dat.gui"
import { useEnvironmentStore } from "~/stores/environment"
// import { useInfiniteGrid, useSkybox } from "@depth/world"
// import { useThreeJSEventHook } from "@depth/three.js"

// const threeJs = useThreeJSEventHook()
// threeJs.trigger({ cmd: "RenderFrames", param: "All" })
const environment = useEnvironmentStore()

// const skybox = useSkybox()

addGuiFolder(folder => {
  folder.name = "⚙ Skybox"
  folder.add(environment, "skybox", 1, 15, 1)
  // folder.add(environment, "compressed")
})

// syncRef(toRef(environment, "skybox"), skybox.nr)
// syncRef(toRef(environment, "compressed"), skybox.compressed)

// const grid = useInfiniteGrid()

addGuiFolder(folder => {
  folder.name = "⚙ Grid"
  folder.add(environment, "size", 1, 15, 1)
  folder.addColor(environment, "color")
  folder.add(environment, "distance", 1, 9_000, 10)
})

// syncRef(toRef(environment, "size"), grid.size)
// watch(
//   () => environment.color,
//   col => grid.color.value.set(col)
// )
// syncRef(toRef(environment, "distance"), grid.distance)
</script>
