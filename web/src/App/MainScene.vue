<template lang="pug">
Help

SkyBox(:nr="environment.skybox")
InfiniteGrid(:size="environment.size" :color="environment.color" :distance="environment.distance")
DefaultLights

MemoryInfo(v-if="showDebug")

router-view(v-slot="{ Component }")
  component(:is="Component")
</template>

<script lang="ts" setup>
import { getCurrentInstance } from "vue"
import Help from "~/components/preferences/Help.vue"
import SkyBox from "~/3d/components/SkyBox"
import InfiniteGrid from "~/components/3d/InfiniteGrid"
import DefaultLights from "~/components/3d/DefaultLights"
import { useEnvironmentStore } from "~/stores/environment"
import MemoryInfo from "~/components/ui/MemoryInfo.vue"
import { usePreferencesStore } from "~/stores/preferences"
import { storeToRefs } from "pinia"

const instance = getCurrentInstance()
if (!instance) throw new Error("Not in Vue scope")

onMounted(() => {
  // START GAME LOOP
  instance.appContext.app.config.globalProperties.$looping.value = true
})

const environment = useEnvironmentStore()
const preferences = usePreferencesStore()
const { showDebug } = storeToRefs(preferences)

// useSystemRequirements()
</script>
