<template lang="pug">
//- ParaPanel(title="Tile Plane" @hover="v => panelHovered = v")
  div Dimensions
  InputXY(v-model="dimensions" :labels="['Width', 'Height']")

slot
</template>

<script lang="ts" setup>
import { useCameraControls } from "@depth/controller"
import { debouncedWatch } from "@vueuse/core"
import * as THREE from "three"

const props = defineProps<{
  mesh: THREE.Mesh
  position: PositionTuple
  bounding: number[]
  scale: number
}>()

const cc = useCameraControls()

debouncedWatch(
  [() => props.bounding, () => props.position, () => props.scale],
  () => {
    const box = new THREE.Box3().setFromObject(props.mesh)
    cc.setBoundary(box)
  },
  { immediate: true, deep: true, flush: "post", debounce: 500 }
)
</script>
