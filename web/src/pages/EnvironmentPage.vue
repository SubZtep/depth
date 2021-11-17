<template lang="pug">
Title Environment
</template>

<script lang="ts" setup>
import { addGuiFolder } from "@depth/dat.gui"
import { useEnvironmentStore } from "~/stores/environment"
import useSingleton from "~/composables/useSingleton"

const singleton = useSingleton()
const environment = useEnvironmentStore()

const skybox = singleton.get("SkyboxRefs")
const grid = singleton.get("InfiniteGridRefs")

addGuiFolder(folder => {
  folder.name = "⚙ Skybox"
  folder.add(environment, "skybox", 1, 15, 1)
  folder.add(environment, "compressed")
})

syncRef(toRef(environment, "skybox"), skybox.nr)
syncRef(toRef(environment, "compressed"), skybox.compressed)

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
