<template lang="pug">
Help

SkyBox(:nr="environment.skybox")
InfiniteGrid(:size="environment.size" :color="environment.color" :distance="environment.distance")
DefaultLights

router-view(v-slot="{ Component }")
  component(:is="Component")
</template>

<script lang="ts" setup>
import { useGui } from "@depth/hud"
import { useStats } from "@depth/stats"
import type { Fn } from "@vueuse/core"
import { getCurrentInstance, onMounted, watch } from "vue"
import Help from "~/components/preferences/Help.vue"
import { loop3D } from "../../../packages/canvas/src/useLoopInject"
import { useEnvironmentStore } from "../stores/environment"
import { usePreferencesStore } from "../stores/preferences"
// import { useEnvironmentStore } from "~/stores/environment"

const instance = getCurrentInstance()
if (!instance) {
  throw new Error("Not in Vue scope")
}

onMounted(() => {
  instance.appContext.app.config.globalProperties.$looping.value = true
})

// import { initPhysicsEngine } from "~/3D/entities/PhysicalWorld"
// import { useLights } from "@depth/world"
// import { Color } from "three/src/math/Color"
// import useSystemRequirements from "~/composables/useSystemRequirements"
// import { Fog } from "three/src/scenes/Fog"
// import { DEG2RAD } from "three/src/math/MathUtils"

useGui().show()
// const { stats } = useStats()
// const { start, done } = useNProgress()
const preferences = usePreferencesStore()
const environment = useEnvironmentStore()

// start()

// await initPhysicsEngine()

// useSystemRequirements()

// useSkybox({
//   nr: environment.skybox,
//   compressed: environment.compressed,
// })

// for (let i = 0; i < 10; i += 0.5) {
//   useInfiniteGrid({
//     size: 100, //environment.size,
//     color: new Color(environment.color),
//     distance: 8, //environment.distance,
//     position: [0, i, -10 * i],
//   })
// }
//


// loop3D(() => {
//   console.log("qqq")
// })

// let stopStats: Fn
// watch(
//   () => preferences.showDebug,
//   visible => {
//     visible ? stopStats?.() : loop3D(() => stats.update())
//     stats.dom.classList.toggle("!hidden")
//   },
// )

// exec3D(({ scene, cameraControls }) => {
//   // const { ambientLight, directionalLight } = useLights()

//   // scene.fog = new Fog(new Color(environment.color), 8, 20)

//   // scene.add(ambientLight, directionalLight)
//   setupBoundaries(cameraControls, preferences.horizontalLock ? "Full" : "Simple")

//   // cameraControls.rotateAzimuthTo(-31)
// })

// loop3D(({ cameraControls }) => {
//   cameraControls.camera.rotateZ(Math.PI * 2)
// })

// done()
</script>
