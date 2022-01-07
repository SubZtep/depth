<template lang="pug">
SkyBox(:nr="environment.skybox")
InfiniteGrid(:size="environment.size" :color="environment.color" :distance="environment.distance")

//- EntityPanel(title="Default lights")
  AmbientLight(color="#ffffff" :intensity="1")
  DirectionalLight(color="#ffffff" :intensity="0.8" :position="[8, 10, 2]" :target="[0, 2, 0]")

MemoryInfo(v-if="edit")

router-view(v-slot="{ Component }")
  component(:is="Component")
</template>

<script lang="ts" setup>
import { getCurrentInstance } from "vue"
import SkyBox from "~/3d/components/SkyBox"
import InfiniteGrid from "~/components/3d/InfiniteGrid"
import { useEnvironmentStore } from "~/stores/environment"
import MemoryInfo from "~/components/ui/MemoryInfo.vue"
// import { usePreferencesStore } from "~/stores/preferences"
// import { storeToRefs } from "pinia"
// import AmbientLight from "~/components/_canvas/AmbientLight.vue"
// import DirectionalLight from "~/components/_canvas/DirectionalLight.vue"

const instance = getCurrentInstance()
if (!instance) throw new Error("Not in Vue scope")

onMounted(() => {
  // START GAME LOOP
  instance.appContext.app.config.globalProperties.$looping.value = true
})

const environment = useEnvironmentStore()
// const preferences = usePreferencesStore()
// const { showDebug } = storeToRefs(preferences)

const edit = inject("edit") as Ref<boolean>
const panel = document.querySelector("#panel") as HTMLDivElement
const stats = document.querySelector(".Stats") as HTMLDivElement
watchEffect(() => {
  panel.style.display = edit.value ? "block" : "none"
  stats.style.display = edit.value ? "block" : "none"
})
// useSystemRequirements()
</script>
