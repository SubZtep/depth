<template lang="pug">
Title(v-if="hasUuid") Your UUID: {{uuid}}
Title(v-else) Meta
InfinitePlane(:color="0x000900" :pos-y="-10")

ValidateHappiness(v-if="!hasUuid" v-slot="{ uuid }")
  p Are you happy to keep Your generated ID in local your storage?
  p This is required for connect and meta.
  p
  p {{uuid}}

EntityPanel(title="Voxel terrain" :position="[0, 0, 0]" v-slot="{ hover, position }" :open="true")
  FresnelShaderMaterial(v-bind="{ hover }" v-slot="{ material }")
    VoxelTerrain(:cell-size="10" :cell-height="1" v-bind="{ hover, position, material }" v-slot="{ mesh }")
      MeshOutline(v-if="hover" v-bind="{ mesh, position }")

</template>

<script lang="ts" setup>
import { storeToRefs } from "pinia"
import { usePlayerStore } from "~/stores/player"
import ValidateHappiness from "~/components/meta/ValidateHappiness"
import { useEnvironmentStore } from "~/stores/environment"

const toast = useToast()
const { uuid } = storeToRefs(usePlayerStore())
const hasUuid = computed(() => !!uuid.value)

useEnvironmentStore().$patch({
  skybox: 3,
  color: 0xffff00,
  distance: 100,
  size: 1,
} as any)

</script>
