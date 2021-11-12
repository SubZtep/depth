<template lang="pug">
Help

router-view(v-slot="{ Component }")
  component(:is="Component")
</template>

<script lang="ts" setup>
import { useGui } from "@depth/dat.gui"
import { useStats } from "@depth/stats.js"
import { useSkybox, loop3D, exec3D, setupBoundaries } from "@depth/three.js"
import { usePreferencesStore } from "~/stores/preferences"

useGui().show()

const stats = useStats()

loop3D(() => {
  stats.update()
})

// Sync preferences store to refs
const preferences = usePreferencesStore()

const { nr } = useSkybox()
syncRef(toRef(preferences, "skybox"), nr)

const guiScaleCss = useCssVar("--gui-scale")
syncRef(toRef(preferences, "guiScale"), guiScaleCss)

exec3D(({ cameraControls }) => {
  setupBoundaries(cameraControls, preferences.horizontalLock ? "Full" : "Simple")
})
</script>
