<template lang="pug">
ParaPanel(title="Box Collider")
  div Helper
  InputBoolean(v-model="state.helper")

slot
</template>

<script lang="ts" setup>
import { useScene } from "@depth/canvas"
import { getWorld } from "@depth/physics"
import { ColliderDesc } from "@dimforge/rapier3d-compat"
import { PlaneGeometry } from "three/src/geometries/PlaneGeometry"
import { Box3Helper } from "three/src/helpers/Box3Helper"
import { Material } from "three/src/materials/Material"
import { Box3 } from "three/src/math/Box3"
import { Mesh } from "three/src/objects/Mesh"
import { useCameraFit } from "~/composables/useCameraFit"

const props = defineProps<{
  scale?: number
  dimensions: [number, number]
  position: [number, number, number]
}>()

const state = reactive({
  helper: false,
})

const world = getWorld()
const height = 0.1
const groundColliderDesc = ColliderDesc.cuboid(props.dimensions[0] / 2, height, props.dimensions[1] / 2)
const groundCollider = world.createCollider(groundColliderDesc)

const scene = useScene()
let helper: Box3Helper

watch(
  () => state.helper,
  show => {
    if (show) {
      const box = new Box3()
      box.setFromCenterAndSize(new Vector3(1, 1, 1), new Vector3(props.dimensions[0], height * 2, props.dimensions[0]))
      helper = new Box3Helper(box)
      scene.add(helper)
    } else {
      scene.remove(helper)
    }
  },
  { immediate: true }
)

// watch(
//   dimensions,
//   newDimensions => {
//     const helperPlane = new PlaneGeometry(...newDimensions)
//     mesh.geometry.copy(helperPlane)
//     helperPlane.dispose()
//   },
//   { immediate: true, deep: true }
// )

// watchEffect(() => {
//   mesh.scale.setScalar(props.scale ?? 1)
//   mesh.position.set(...props.position)
//   mesh.updateMatrix()
//   groundCollider.setTranslation({ x: props.position[0], y: props.position[1] - colliderHeight, z: props.position[2] })
// })

onScopeDispose(() => {
  world.removeCollider(groundCollider, false)
  scene.remove(helper)
})
</script>
