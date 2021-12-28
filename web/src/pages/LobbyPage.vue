<template lang="pug">
Title Metasnail Lobby

//- FloorPlane(:size="100")
//- Debug {{metaSnails.map(s => s.name)}}

UseGeolocation(v-slot="{ coords: { latitude, longitude } }")
  pre {{latitude}} x {{longitude}}

  ThreeGlobe(v-if="latitude && longitude" :scale="0.05" :position="[0, 0.01, -13]" :points="[{ lat: latitude, lng: longitude }]")

//-SnailShell.opacity-50(
  v-for="metaSnail in metaSnails"
  :key="metaSnail.uuid"
  :color="metaSnail.color"
  :wireframe="metaSnail.wireframe"
  :roughness="metaSnail.roughness"
  :position="metaSnail.position"
  :rotation="metaSnail.rotation")

ValidateUuid
  p Please enable UUID!
  p Press Okay for navigate to the player page.
</template>

<script lang="ts" setup>
import { UseGeolocation } from "@vueuse/components"
import ThreeGlobe from "~/components/3d/ThreeGlobe"
// import ThreeGlobe from "~/components/3d/ThreeGlobex.vue"
import SnailShell from "~/components/meta/SnailShell"
import ValidateUuid from "~/components/meta/ValidateUuid"
import { useMetaSnails } from "~/composables/useMetaSnails"
import { useEnvironmentStore } from "~/stores/environment"
import { usePlayerStore } from "~/stores/player"

const playerStore = usePlayerStore()
const environmentStore = useEnvironmentStore()
const { metaSnails, playerPosition, subscribe, unsubscribe } = await useMetaSnails()

environmentStore.distance = 0
environmentStore.skybox = 1
subscribe()

onBeforeUnmount(async () => {
  environmentStore.undo()
  await unsubscribe()
})
</script>
