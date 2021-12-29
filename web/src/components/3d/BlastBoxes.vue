<template lang="pug">
</template>

<script lang="ts" setup>
import { useScene } from "@depth/canvas"
import { Mesh } from "three/src/objects/Mesh"
import { ActiveEvents, ColliderDesc, RigidBody, RigidBodyDesc } from "@dimforge/rapier3d-compat"
import { Group } from "three/src/objects/Group"
import type { Quaternion } from "three/src/math/Quaternion"

const props = defineProps<{
  /** Number of generated boxes on 3 axes. */
  pieces: [number, number, number]
  position: [number, number, number]
}>()

const bodies: number[] = []

const emit = defineEmits<{
  (e: "loaded", bodyHandlers: number[]): void
}>()

const group = new Group()

const toCenterVector = ([x, y, z]: PositionTuple): PositionTuple => {
  return [x - ((props.pieces[0] - 1) / 2) + props.position[0], y + props.position[1], z - ((props.pieces[2] - 1) / 2) + props.position[2]]
}

for (let x = 0; x < props.pieces[0]; x++) {
  for (let y = 0; y < props.pieces[1]; y++) {
    for (let z = 0; z < props.pieces[2]; z++) {
      const { boxMesh, rigidBody } = createBox(toCenterVector([x, y, z]))
      group.add(boxMesh)
      bodies.push(rigidBody.handle)
    }
  }
}

const scene = useScene()
scene.add(group)

emit("loaded", bodies)
</script>

<script lang="ts">
import { loop3D, toVector } from "@depth/canvas"
import { BoxGeometry } from "three/src/geometries/BoxGeometry"
import { getWorld } from "@depth/physics"
import { woodCrateMaterial } from "~/3d/materials/woodCrateMaterial"

const world = getWorld()

const boxGeometry = new BoxGeometry(1, 1, 1)

function createBox(startPosition: PositionTuple = [0, 0, 0]) {
  const boxMesh = new Mesh(boxGeometry, woodCrateMaterial)
  boxMesh.receiveShadow = true
  boxMesh.castShadow = true

  const rigidBodyDesc = RigidBodyDesc.newDynamic()
    // .setCcdEnabled(true)
    .setAdditionalMass(2)
    .setAdditionalPrincipalAngularInertia({ x: 1, y: 1, z: 1 })
  const colliderDesc = ColliderDesc.cuboid(0.5, 0.5, 0.5).setActiveEvents(ActiveEvents.CONTACT_EVENTS).setDensity(2)
  // .setRestitution(1)
  const rigidBody = world.createRigidBody(rigidBodyDesc)
  const collider = world.createCollider(colliderDesc, rigidBody.handle)

  boxMesh.position.set(...startPosition)
  rigidBody.setTranslation(toVector(startPosition), true)

  loop3D(() => {
    const pos = rigidBody.translation()
    const rot = rigidBody.rotation()

    boxMesh.position.set(pos.x, pos.y, pos.z)
    boxMesh.setRotationFromQuaternion({ x: rot.x, y: rot.y, z: rot.z, w: rot.w } as Quaternion)
  })

  // onScopeDispose(() => {
  //   scene.remove(boxMesh)
  //   boxGeometry.dispose()
  //   boxMaterial.dispose()
  //   world.removeCollider(collider, false)
  //   world.removeRigidBody(rigidBody)
  // })

  return { boxMesh, rigidBody }
}
</script>
