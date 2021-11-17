<template lang="pug">
Help

router-view(v-slot="{ Component }")
  component(:is="Component")
</template>

<script lang="ts" setup>
import { useGui } from "@depth/dat.gui"
import { useStats } from "@depth/stats.js"
import { loop3D, exec3D, setupBoundaries } from "@depth/three.js"
import { useSkybox, infiniteGrid } from "@depth/environment"
import { usePreferencesStore } from "~/stores/preferences"
import { useEnvironmentStore } from "~/stores/environment"
import useResources from "~/composables/useResources"
import useSingleton from "~/composables/useSingleton"

useGui().show()

const stats = useStats()

loop3D(() => {
  stats.update()
})

const resources = useResources()
const singleton = useSingleton()
const preferences = usePreferencesStore()
const environment = useEnvironmentStore()

const guiScaleCss = useCssVar("--gui-scale")
syncRef(toRef(preferences, "guiScale"), guiScaleCss)

const { texture: skyboxTexture, ...skybox } = useSkybox()
resources.set("Skybox", skyboxTexture)
singleton.set("SkyboxRefs", skybox)

const { mesh: gridMesh, ...grid } = infiniteGrid({
  size1: environment.size1,
  size2: environment.size2,
  color: environment.color,
  distance: environment.distance,
})

resources.set("InfiniteGrid", gridMesh)
singleton.set("InfiniteGridRefs", grid)

exec3D(({ cameraControls, scene }) => {
  scene.add(gridMesh)
  setupBoundaries(cameraControls, preferences.horizontalLock ? "Full" : "Simple")
})
</script>
