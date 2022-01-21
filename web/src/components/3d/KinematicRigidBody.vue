<template lang="pug">
//- ParaPanel(title="Mesh Outline" @hover="toggleOutline")
//-   div Width
//-   InputNumber(v-model="state.width" :min="1" :max="10")
//-   div Height
//-   InputNumber(v-model="state.height" :min="1" :max="10")

//-   div Position
//-   InputXYZ(v-model="state.position")

//- pre.text-white XYZ {{props.mesh.geometry}}
//- pre.text-white qqq {{props.mesh.geometry.getAttribute('width')}}

//- slot(:mesh="mesh")
</template>

<script lang="ts" setup>
import { getWorld } from "@depth/physics"
import { Collider, ColliderDesc, RigidBodyDesc, RigidBodyType } from "@dimforge/rapier3d-compat"

const props = defineProps<{
  dimensions: [number, number]
  position: [number, number, number]
  mesh: THREE.Mesh
}>()

const { position, dimensions } = toRefs(props)

const world = getWorld()

const rigidBodyDesc = new RigidBodyDesc(RigidBodyType.KinematicPositionBased)
const rigidBody = world.createRigidBody(rigidBodyDesc)
let collider: Collider | undefined

const dispose = () => {
  if (collider) {
    world.removeCollider(collider, false)
    collider = undefined
  }
}

const create = (newDimensions: [number, number]) => {
  dispose()
  const colliderDesc = ColliderDesc.cuboid(newDimensions[0] / 2, 0.1, newDimensions[1] / 2)
  collider = world.createCollider(colliderDesc, rigidBody.handle)
}

watch(dimensions, v => create(v), { immediate: true, deep: true })
watch(position, pos => rigidBody.setNextKinematicTranslation({ x: pos[0], y: pos[1] - 0.1, z: pos[2] }), {
  immediate: true,
  deep: true,
})

onScopeDispose(() => {
  dispose()
  world.removeRigidBody(rigidBody)
})
</script>
