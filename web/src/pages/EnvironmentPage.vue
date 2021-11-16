<template lang="pug">
Title Environment
</template>

<script lang="ts" setup>
import { addGuiFolder } from "@depth/dat.gui"
import { Color } from "three/src/Three"
import useResources from "~/composables/useResources"
import { useEnvironmentStore } from "~/stores/environment"
import { infiniteGrid } from "@depth/environment"

const resources = useResources()
const environment = useEnvironmentStore()

const grid: any = resources.get("InfiniteGrid")
// const grid = resources.get<ReturnType<typeof infiniteGrid>>("InfiniteGrid")

addGuiFolder(folder => {
  folder.name = "⚙ Skybox"
  folder.add(environment, "skybox", 1, 15, 1)
  folder.add(environment, "compressed")
  folder.close()
})

addGuiFolder(folder => {
  folder.name = "⚙ Grid"
  folder.add(environment, "size1", 1, 15, 1)
  folder.add(environment, "size2", 1, 15, 1)
  folder.addColor(environment, "color")
  folder.add(environment, "distance", 1, 9_000, 10)
})

syncRef(toRef(environment, "size1"), grid.size1)
syncRef(toRef(environment, "size2"), grid.size2)
syncRef(toRef(environment, "color"), grid.color)
syncRef(toRef(environment, "distance"), grid.distance)
</script>
