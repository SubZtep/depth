<template lang="pug">
Title Blast
InfinitePlane

GrassPlane(:width="6" :height="6")

BlastBoxes(:pieces="[3, 3, 3]" @loaded="boxesLoaded")
</template>

<script lang="ts" setup>
import { useEnvironmentStore } from "~/stores/environment"
import GrassPlane from "~/components/3d/GrassPlane.vue"
import InfinitePlane from "~/components/3d/InfinitePlane"
import BlastBoxes from "~/components/3d/BlastBoxes.vue"
import { useCameraControls } from "@depth/controller"
import { RigidBody } from "@dimforge/rapier3d-compat"
import { getWorld } from "@depth/physics"

useEnvironmentStore().$patch({
  skybox: 13,
  distance: 100,
  color: 0x001300,
  size: 1,
} as any)

const cc = useCameraControls()
cc.setPosition(0, 3, 8)
cc.setTarget(0, 1, 0)
cc.minPolarAngle = Math.PI / 6
cc.maxPolarAngle = Math.PI / 2.1
cc.minDistance = 5
cc.maxDistance = 25

const world = getWorld()

// eslint-disable-next-line unicorn/consistent-function-scoping
const blaster = (bodyHandlers: number[]) => () => {
  const body = world.getRigidBody(bodyHandlers[0])
  // console.log("BLAASAS", rigidBodies./get([0, 0, 0]))
  // const body = rigidBodies.get(rigidBodies.keys().next().value)!
  // const body = rigidBodies.get([1, 1, 1])!
  console.log("BLAASAS", body)

  body.applyImpulse({ x: 100.1, y: 200, z: 100.05 }, true)
  // body.applyImpulse({ x: 0.1, y: 2, z: 10.05 }, true)
}

let blast: ReturnType<typeof blaster>

const boxesLoaded = (bodyHandlers: number[]) => {
  blast = blaster(bodyHandlers)
}

const state = reactive({
  mass: 2,
})

const btns = {
  blast: () => {
    blast?.()
  },
}

addGuiFolder(folder => {
  folder.name = "💥 Blast Page"
  folder.add({ blast }, "blast").name("Blast!!!")
})
</script>
