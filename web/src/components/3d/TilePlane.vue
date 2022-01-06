<template lang="pug">
ParaPanel(title="Tile Plane")
  div Dimensions
  InputXY(v-model="dimensions" :labels="['Width', 'Height']")
slot(:mesh="mesh" :dimensions="dimensions")
</template>

<script lang="ts" setup>
import { useScene } from "@depth/canvas"
import { getWorld } from "@depth/physics"
import { ColliderDesc } from "@dimforge/rapier3d-compat"
import { PlaneGeometry } from "three/src/geometries/PlaneGeometry"
import { Material } from "three/src/materials/Material"
import { Mesh } from "three/src/objects/Mesh"
import { useCameraFit } from "~/composables/useCameraFit"

const props = defineProps<{
  scale?: number
  dimensions?: [number, number]
  position: [number, number, number]
  material?: Material
  collider?: boolean
}>()

const scene = useScene()
const dimensions = ref(props.dimensions ?? [1, 1])
const geometry = new PlaneGeometry()
const mesh = new Mesh(geometry, props.material)
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
    const helperPlane = new PlaneGeometry(...newDimensions)
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
