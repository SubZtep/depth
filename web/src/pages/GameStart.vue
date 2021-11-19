<template lang="pug">
Title M̸̧̹̃o̶̥̪̓͝l̵͙̙̓l̸̘͑̅u̵̺̇s̷̡͖̿̌̓c̷͚̥͛o̴͇̘͝p̶̦̆̊͛h̷̢̖̎̕o̵̙̭̝̔͝ḃ̵͕̬̿i̸̥̠̒̈́̚a̵̽ͅ

//- SnailShell(v-slot="{ snail }")
</template>

<script lang="ts" setup>
import { ColliderDesc, RigidBodyDesc, World } from "@dimforge/rapier3d-compat"
import { exec3D } from "@depth/three.js"
// import { DirectionalLight, Scene, SpotLight, SpotLightHelper } from "three"
import getSnailShell from "~/3D/goodybag/snail-shell"
import getSnailTorch from "~/3D/lights/snail-torch"
import greenFloor from "~/3D/meshes/green-floor"

import { leafPlane } from "~/3D/sceneDefaults"
import { useRapier } from "~/composables/useRapier"

const leaf = await leafPlane()
leaf.position.set(0, 0, 0)

const snail = await getSnailShell()
const { spotLight, spotLightHelper } = getSnailTorch()
snail.add(spotLight)

const floor = greenFloor()

exec3D(({ scene, cameraControls }) => {
  scene.add(snail, spotLight.target, spotLight.target, spotLightHelper, spotLight, leaf, floor)
})

const { physicsWorld } = await useRapier()

// Add physics to the green floor

// const { physicsWorld } = rapier

// const { getRapier } = useRapier()

// await getRapier()

// let gravity = { x: 0, y: -9.81, z: 0 }
// let world = new World(gravity)

// // Create the ground
// let groundColliderDesc = ColliderDesc.cuboid(10, 0.1, 10)
// world.createCollider(groundColliderDesc)

// // Create a dynamic rigid-body.
// let rigidBodyDesc = RigidBodyDesc.newDynamic().setTranslation(0, 1, 0)
// let rigidBody = world.createRigidBody(rigidBodyDesc)

// // Create a cuboid collider attached to the dynamic rigidBody.
// let colliderDesc = ColliderDesc.cuboid(0.5, 0.5, 0.5)
// let collider = world.createCollider(colliderDesc, rigidBody.handle)

// // Game loop. Replace by your own game loop system.
// let gameLoop = () => {
//   // Ste the simulation forward.
//   world.step()

//   // Get and print the rigid-body's position.
//   let position = rigidBody.translation()
//   console.log("Rigid-body position:", position.x, position.y, position.z)

//   setTimeout(gameLoop, 16)
// }

// gameLoop()
</script>
