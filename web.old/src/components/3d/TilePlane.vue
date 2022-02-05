<template lang="pug">
ParaPanel(title="Tile Plane")
  div Dimensions
  InputXY(v-model="dimensions" :labels="['Width', 'Height']" :hover="props.hover")

slot(v-bind="{ mesh, dimensions, position }")
</template>

<script lang="ts" setup>
import { useScene } from "@depth/canvas"
import { getWorld } from "@depth/physics"
import { ColliderDesc } from "@dimforge/rapier3d-compat"
import { useCameraFit } from "~/composables/useCameraFit"

const scene = useScene()

const props = defineProps<{
  scale?: number
  dimensions?: [number, number]
  position: [number, number, number]
  material?: THREE.Material
  collider?: boolean
  hover?: boolean
}>()

const dimensions = ref(props.dimensions ?? [1, 1])

const geometry = new THREE.PlaneGeometry()
const mesh = new THREE.Mesh(geometry, props.material)
mesh.material.needsUpdate = true
mesh.receiveShadow = true
mesh.matrixAutoUpdate = false
mesh.rotateX(-Math.PI / 2)
scene.add(mesh)

useCameraFit().add(mesh)

const world = getWorld()
const colliderHeight = 0.1
const groundColliderDesc = ColliderDesc.cuboid(dimensions[0] * 2, colliderHeight, dimensions[1] * 2)
const groundCollider = world.createCollider(groundColliderDesc)

watch(
  dimensions,
  newDimensions => {
    const helperPlane = new THREE.PlaneGeometry(...newDimensions)
    mesh.geometry.copy(helperPlane)
    helperPlane.dispose()
  },
  { immediate: true, deep: true }
)

watchEffect(() => {
  mesh.scale.setScalar(props.scale ?? 1)
  mesh.position.set(...props.position)
  mesh.updateMatrix()
  groundCollider.setTranslation({ x: props.position[0], y: props.position[1] - colliderHeight, z: props.position[2] })
})

onScopeDispose(() => {
  scene.remove(mesh)
  geometry.dispose()
  world.removeCollider(groundCollider, false)
})
</script>
