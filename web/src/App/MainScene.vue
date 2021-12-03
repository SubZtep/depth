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
import { toRef, getCurrentInstance } from "vue"
import Help from "~/components/preferences/Help.vue"
import { useEnvironmentStore } from "~/stores/environment"
import { usePreferencesStore } from "~/stores/preferences"

const instance = getCurrentInstance()
if (!instance) throw new Error("Not in Vue scope")

onMounted(() => {
  // START GAME LOOP
  instance.appContext.app.config.globalProperties.$looping.value = true
})

useGui().show()

const environment = useEnvironmentStore()
const preferences = usePreferencesStore()
const showDebug = toRef(preferences, "showDebug")

useStats().toggle(showDebug)

// await initPhysicsEngine()
// useSystemRequirements()
</script>
