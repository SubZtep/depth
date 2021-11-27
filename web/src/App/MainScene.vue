<template lang="pug">
SystemRequirements
Help

router-view(v-slot="{ Component }")
  component(:is="Component")
</template>

<script lang="ts" setup>
import { useGui } from "@depth/dat.gui"
import { useStats } from "@depth/stats.js"
import { Color } from "three/src/math/Color"
import { loop3D, exec3D, setupBoundaries } from "@depth/three.js"
import { useSkybox, useInfiniteGrid, useLights } from "@depth/world"
import SystemRequirements from "~/components/preferences/SystemRequirements"
import Help from "~/components/preferences/Help.vue"
import { usePreferencesStore } from "~/stores/preferences"
import { useEnvironmentStore } from "~/stores/environment"

useGui().show()
const stats = useStats()
const preferences = usePreferencesStore()
const environment = useEnvironmentStore()

let stopStats: Fn
watch(
  () => preferences.showDebug,
  visible => {
    visible ? stopStats?.() : loop3D(() => stats.update())
    stats.dom.classList[visible ? "remove" : "add"]("!hidden")
  },
  { immediate: true }
)

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
