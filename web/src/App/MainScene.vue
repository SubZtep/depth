<template lang="pug">
Help

router-view(v-slot="{ Component }")
  component(:is="Component")
</template>

<script lang="ts" setup>
import { useGui } from "@depth/dat.gui"
import { useStats } from "@depth/stats.js"
import { loop3D, exec3D, setupBoundaries } from "@depth/three.js"
import Help from "~/components/preferences/Help.vue"
import { usePreferencesStore } from "~/stores/preferences"
import { useEnvironmentStore } from "~/stores/environment"
import { initPhysicsEngine } from "~/3D/entities/PhysicalWorld"
import { useSkybox, useInfiniteGrid, useLights } from "@depth/world"
import { Color } from "three/src/math/Color"
import useSystemRequirements from "~/composables/useSystemRequirements"
import { Fog } from "three/src/scenes/Fog"
import { DEG2RAD } from "three/src/math/MathUtils"

useGui().show()
const stats = useStats()
const { start, done } = useNProgress()
const preferences = usePreferencesStore()
const environment = useEnvironmentStore()

start()

await initPhysicsEngine()

useSystemRequirements()

useSkybox({
  nr: environment.skybox,
  compressed: environment.compressed,
})

for (let i = 0; i < 10; i += 0.5) {
  useInfiniteGrid({
    size: 100, //environment.size,
    color: new Color(environment.color),
    distance: 8, //environment.distance,
    position: [0, i, -10 * i],
  })
}

let stopStats: Fn
watch(
  () => preferences.showDebug,
  visible => {
    visible ? stopStats?.() : loop3D(() => stats.update())
    stats.dom.classList[visible ? "remove" : "add"]("!hidden")
  },
  { immediate: true }
)

exec3D(({ scene, cameraControls }) => {
  const { ambientLight, directionalLight } = useLights()

  // scene.fog = new Fog(new Color(environment.color), 8, 20)

  scene.add(ambientLight, directionalLight)
  setupBoundaries(cameraControls, preferences.horizontalLock ? "Full" : "Simple")

  // cameraControls.rotateAzimuthTo(-31)
})

// loop3D(({ cameraControls }) => {
//   cameraControls.camera.rotateZ(Math.PI * 2)
// })

done()
</script>
