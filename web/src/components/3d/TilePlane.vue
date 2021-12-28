<template lang="pug">
Teleport(to="#panel")
  .bg-black.border-red-500.text-green-300
    h1.text-center
      | Tile Plane
    .form
      div Width
      input(type="range" min="1" max="10" v-model="state.width")
      div Height
      input(type="range" min="1" max="10" v-model="state.height")

      div Position X
      input(type="range" min="-10" max="10" v-model="state.position[0]")
      div Position Y
      input(type="range" min="-10" max="10" v-model="state.position[1]")
      div Position Z
      input(type="range" min="-10" max="10" v-model="state.position[2]")

slot(:mesh="mesh")
</template>

<script lang="ts" setup>
import { useScene } from "@depth/canvas"
import { getWorld } from "@depth/physics"
import { Collider, ColliderDesc, RigidBodyDesc, RigidBodyType } from "@dimforge/rapier3d-compat"
import { PlaneGeometry } from "three/src/geometries/PlaneGeometry"
import { MeshStandardMaterial } from "three/src/materials/MeshStandardMaterial"
import { Mesh } from "three/src/objects/Mesh"

const props = defineProps<{
  width: number
  height: number
  material: MeshStandardMaterial
  position?: PositionTuple
}>()

const state = reactive({
  width: props.width,
  height: props.height,
  position: props.position ?? [0, 0, 0],
})

const mesh = new Mesh(undefined, props.material)
mesh.material.needsUpdate = true
mesh.receiveShadow = true
mesh.matrixAutoUpdate = false
mesh.rotateX(-Math.PI / 2)

const scene = useScene()
const world = getWorld()

scene.add(mesh)

const rigidBodyDesc = new RigidBodyDesc(RigidBodyType.KinematicPositionBased)
const rigidBody = world.createRigidBody(rigidBodyDesc)
let groundCollider: Collider

watchEffect(() => {
  mesh.geometry?.dispose()
  mesh.geometry = new PlaneGeometry(state.width, state.height, 1, 1)
  mesh.position.set(...state.position)
  mesh.updateMatrix()

  if (groundCollider) {
    world.removeCollider(groundCollider, false)
  }

  const groundColliderDesc = ColliderDesc.cuboid(state.width / 2, 0.1, state.height / 2)
  groundCollider = world.createCollider(groundColliderDesc, rigidBody.handle)

  rigidBody.setNextKinematicTranslation({ x: state.position[0], y: state.position[1] - 0.1, z: state.position[2] })
})

onScopeDispose(() => {
  scene.remove(mesh)
  world.removeCollider(groundCollider, true)
})
</script>
