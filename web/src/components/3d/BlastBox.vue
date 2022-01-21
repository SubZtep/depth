<template lang="pug">
</template>

<script lang="ts" setup>
import { useScene } from "@depth/canvas"
import { ActiveEvents, ColliderDesc, RigidBodyDesc } from "@dimforge/rapier3d-compat"
import { loop3D, toVector } from "@depth/canvas"
import { getWorld } from "@depth/physics"
import { woodCrateMaterial } from "~/3d/materials/woodCrateMaterial"

const props = defineProps<{
  position: [number, number, number]
}>()

const bodies: number[] = []

const emit = defineEmits<{
  (e: "loaded", bodyHandlers: number[]): void
}>()

// const group = new Group()

// const toCenterVector = ([x, y, z]: PositionTuple): PositionTuple => {
//   return [x - ((props.pieces[0] - 1) / 2) + props.position[0], y + props.position[1], z - ((props.pieces[2] - 1) / 2) + props.position[2]]
// }

// for (let x = 0; x < props.pieces[0]; x++) {
//   for (let y = 0; y < props.pieces[1]; y++) {
//     for (let z = 0; z < props.pieces[2]; z++) {
//       const { boxMesh, rigidBody } = createBox(toCenterVector([x, y, z]))
//       group.add(boxMesh)
//       bodies.push(rigidBody.handle)
//     }
//   }
// }

const scene = useScene()
// scene.add(group)

const world = getWorld()

const boxGeometry = new THREE.BoxGeometry(1, 1, 1)

const mesh = new THREE.Mesh(boxGeometry, woodCrateMaterial)
mesh.position.set(...props.position)
mesh.receiveShadow = true
mesh.castShadow = true

scene.add(mesh)

const rigidBodyDesc = RigidBodyDesc.newDynamic()
  // .setCcdEnabled(true)
  .setAdditionalMass(2)
  .setAdditionalPrincipalAngularInertia({ x: 1, y: 1, z: 1 })
  .setTranslation(...props.position)

const colliderDesc = ColliderDesc.cuboid(0.5, 0.5, 0.5).setActiveEvents(ActiveEvents.CONTACT_EVENTS).setDensity(2)
// .setRestitution(1)

const rigidBody = world.createRigidBody(rigidBodyDesc)
const collider = world.createCollider(colliderDesc, rigidBody.handle)

// boxMesh.position.set(...startPosition)
// rigidBody.setTranslation(toVector(startPosition), true)

loop3D(() => {
  const pos = rigidBody.translation()
  const rot = rigidBody.rotation()

  mesh.position.set(pos.x, pos.y, pos.z)
  mesh.setRotationFromQuaternion({ x: rot.x, y: rot.y, z: rot.z, w: rot.w } as THREE.Quaternion)
})

onScopeDispose(() => {
  scene.remove(mesh)
  boxGeometry.dispose()
  woodCrateMaterial.dispose()
  world.removeCollider(collider, false)
  world.removeRigidBody(rigidBody)
})

//   return { boxMesh, rigidBody }
// }
</script>
