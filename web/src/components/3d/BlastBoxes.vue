<template lang="pug">
</template>

<script lang="ts" setup>
import { useEnvironmentStore } from "~/stores/environment"
import PlayerSnail from "~/components/meta/PlayerSnail.vue"
import InfinitePlane from "~/components/3d/InfinitePlane"
import { useScene } from "@depth/canvas"
import { MeshLambertMaterial } from "three/src/materials/MeshLambertMaterial"
import { Mesh } from "three/src/objects/Mesh"
import { ActiveEvents, ColliderDesc, RigidBodyDesc } from "@dimforge/rapier3d-compat"
import { Group } from "three/src/objects/Group"
import type { Quaternion } from "three/src/math/Quaternion"
import { MeshPhongMaterial } from "three/src/materials/MeshPhongMaterial"
import { sRGBEncoding } from "three/src/constants"

const props = defineProps<{
  /** Number of generated boxes on 3 axes. */
  pieces: [number, number, number]
}>()

const group = new Group()

for (let i = 0; i < props.pieces[0]; i++) {
  for (let j = 0; j < props.pieces[1]; j++) {
    for (let k = 0; k < props.pieces[2]; k++) {
      const { boxMesh } = createBox([i + (i + 1) * 0.1, k + 1.5, j + (j + 1) * 0.1])
      group.add(boxMesh)
      // scene.add(boxMesh)
    }
  }
}

const scene = useScene().add(group)

// setTimeout(() => {
//   const { boxMesh, rigidBody } = createBox([0, 0, 0])
//   scene.add(boxMesh)

//   rigidBody.applyImpulse({ x: 0.1, y: 2, z: 10.05 }, true)
// }, 1000)

const state = reactive({
  mass: 2,
})

addGuiFolder(folder => {
  folder.name = "Blast Box"
})
</script>

<script lang="ts">
import { loop3D, toVector } from "@depth/canvas"
import { BoxGeometry } from "three/src/geometries/BoxGeometry"
import { TGALoader } from "three/examples/jsm/loaders/TGALoader"
import { getWorld } from "@depth/physics"

const world = getWorld()

const boxGeometry = new BoxGeometry(1, 1, 1)
// const boxMaterial = new MeshLambertMaterial({ color: 0x001300 })
const boxMaterial = new MeshPhongMaterial({
  color: 0xffffff,
  map: new TGALoader().load("/textures/crate_color8.tga"),
  shininess: 0,
})

function createBox(startPosition: PositionTuple = [0, 0, 0]) {
  const boxMesh = new Mesh(boxGeometry, boxMaterial)
  boxMesh.receiveShadow = true
  boxMesh.castShadow = true
  boxMesh.material.map!.encoding = sRGBEncoding

  const rigidBodyDesc = RigidBodyDesc.newDynamic()
    // .setCcdEnabled(true)
    .setAdditionalMass(2)
    .setAdditionalPrincipalAngularInertia({ x: 1, y: 1, z: 1 })
  const colliderDesc = ColliderDesc.cuboid(0.5, 0.5, 0.5).setActiveEvents(ActiveEvents.CONTACT_EVENTS).setDensity(2)
  // .setRestitution(1)
  const rigidBody = world.createRigidBody(rigidBodyDesc)
  const collider = world.createCollider(colliderDesc, rigidBody.handle)

  // boxMesh.position.setY(1)
  // rigidBody.setTranslation({ x: 0, y: 4, z: 0 }, true)

  boxMesh.position.set(...startPosition)
  rigidBody.setTranslation(toVector(startPosition), true)

  loop3D(() => {
    const pos = rigidBody.translation()
    const rot = rigidBody.rotation()

    boxMesh.position.set(pos.x, pos.y, pos.z)
    boxMesh.setRotationFromQuaternion({ x: rot.x, y: rot.y, z: rot.z, w: rot.w } as Quaternion)
  })

  onScopeDispose(() => {
    scene.remove(boxMesh)
    world.removeCollider(collider, false)
    world.removeRigidBody(rigidBody)
  })

  return { boxMesh, rigidBody }
}
</script>
