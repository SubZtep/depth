<template lang="pug">
Help

router-view(v-slot="{ Component }")
  component(:is="Component")
</template>

<script lang="ts" setup>
import { useGui } from "@depth/dat.gui"
import { useStats } from "@depth/stats.js"
import { loop3D, exec3D, setupBoundaries } from "@depth/three.js"
import { useSkybox, useInfiniteGrid, useLights } from "@depth/world"
import { usePreferencesStore } from "~/stores/preferences"
import { useEnvironmentStore } from "~/stores/environment"
import { Color } from "three/src/math/Color"

useGui().show()

const stats = useStats()

loop3D(() => {
  stats.update()
})

const preferences = usePreferencesStore()
const environment = useEnvironmentStore()

useSkybox({
  nr: environment.skybox,
  compressed: environment.compressed,
})

useInfiniteGrid({
  size: environment.size,
  color: new Color(environment.color),
  distance: environment.distance,
})

const { ambientLight, directionalLight } = useLights()

exec3D(({ scene, cameraControls }) => {
  scene.add(ambientLight, directionalLight)
  setupBoundaries(cameraControls, preferences.horizontalLock ? "Full" : "Simple")
})
</script>
