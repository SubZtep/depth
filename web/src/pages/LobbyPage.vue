<template lang="pug">
Title Metasnail Lobby

FloorPlane(:size="100")

Debug {{metaSnails}}

SnailShell(
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
import FloorPlane from "~/components/3d/FloorPlane"
import SnailShell from "~/components/meta/SnailShell"
import ValidateUuid from "~/components/meta/ValidateUuid"
import { useMetaSnails } from "~/composables/useMetaSnails"
import { usePlayerStore } from "~/stores/player"

const playerStore = usePlayerStore()
const { metaSnails, playerPosition, subscribe, unsubscribe } = await useMetaSnails()

onMounted(() => subscribe())
onBeforeUnmount(async () => await unsubscribe())
</script>
