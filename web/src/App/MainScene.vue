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

const resources = useResources()

useGui().show()

const stats = useStats()

loop3D(() => {
  stats.update()
})

// Sync preferences store to refs
const preferences = usePreferencesStore()
const environment = useEnvironmentStore()

const { texture, nr, compressed } = useSkybox()
syncRef(toRef(environment, "skybox"), nr)
syncRef(toRef(environment, "compressed"), compressed)

const guiScaleCss = useCssVar("--gui-scale")
syncRef(toRef(preferences, "guiScale"), guiScaleCss)

const grid = infiniteGrid({
  size1: environment.size1,
  size2: environment.size2,
  color: environment.color,
  distance: environment.distance,
})
console.log(grid)
resources.set("InfiniteGrid", grid)

exec3D(({ cameraControls, scene }) => {
  scene.add(grid.mesh)
  setupBoundaries(cameraControls, preferences.horizontalLock ? "Full" : "Simple")
})

watch(texture, txt => {
  exec3D(({ scene }) => {
    scene.background = txt
  })
})
</script>
