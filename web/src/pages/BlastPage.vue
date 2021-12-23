<template lang="pug">
Title Blast

FloorPlane(:width="6" :height="6" :color="0x006900")

PlayerSnail
</template>

<script lang="ts" setup>
import { useScene } from "@depth/canvas"
import { useEnvironmentStore } from "~/stores/environment"
import PlayerSnail from "~/components/meta/PlayerSnail.vue"

const environment = useEnvironmentStore()
environment.$patch({
  skybox: 13,
  distance: 333,
  color: 0x001300,
  size: 1,
} as any)

const scene = useScene()
</script>
