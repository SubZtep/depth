<template lang="pug">
Title Blast

LensFlare(:position="[100, 60, 20]")
InfinitePlane(:color="0x000900")

Tile1Material(v-slot="{ material }")
  TilePlane(:width="8" :height="8" :position="[4, 0, 0]" :material="material")

Tile2Material(v-slot="{ material }")
  TilePlane(:width="8" :height="8" :position="[-4, 0, 0]" :material="material")

ThreeGlobe(:scale="0.01" :position="[-4, 2, 0]")

BlastBoxes(:pieces="[3, 3, 3]" :position="[4, 0, 0]" @loaded="boxesLoaded")
</template>

<script lang="ts" setup>
import { useEnvironmentStore } from "~/stores/environment"
import TilePlane from "~/components/3d/TilePlane.vue"
import Tile2Material from "~/components/3d/Tile2Material"
import InfinitePlane from "~/components/3d/InfinitePlane"
import BlastBoxes from "~/components/3d/BlastBoxes.vue"
import { useCameraControls } from "@depth/controller"
import { getWorld } from "@depth/physics"
import { degToRad, loop3D, useScene } from "@depth/canvas"
import { HemisphereLight } from "three/src/lights/HemisphereLight"
import LensFlare from "~/components/3d/LensFlare.vue"
import { DirectionalLight } from "three/src/lights/DirectionalLight"
import ThreeGlobe from "~/components/3d/ThreeGlobe"

const scene = useScene()

const light = new HemisphereLight(0x93a5bc, 0x6a866f, 1)
scene.add(light)

useEnvironmentStore().$patch({
  skybox: 13,
  distance: 100,
  color: 0x001300,
  size: 1,
} as any)

const cc = useCameraControls()
cc.setPosition(0, 3, 8)
cc.setTarget(0, 1.8, 0)
// cc.minPolarAngle = degToRad(15)
cc.maxPolarAngle = degToRad(89.9)
// cc.minDistance = 5
// cc.maxDistance = 15
const directionalLight = new DirectionalLight(0xffffff, 1)
// directionalLight.position.set(...cc.camera.position.toArray())
// directionalLight.target.position.set(0, 1, 0)
directionalLight.castShadow = true
directionalLight.shadow.mapSize.width = 512 // default
directionalLight.shadow.mapSize.height = 512 // default
directionalLight.shadow.camera.near = 0.5 // default
directionalLight.shadow.camera.far = 100 // default
// scene.add(directionalLight)

loop3D(() => {
  directionalLight.position.set(...cc.camera.position.toArray())
  directionalLight.target.position.set(-4, 2, 0)
})

const world = getWorld()
const rigidBodyHandlers: number[] = []
const boxOriginals = new Map<number, any>()

const blast = () => {
  const body = world.getRigidBody(rigidBodyHandlers[0])
  body.applyImpulse({ x: 100.1, y: 200, z: 100.05 }, true)
}

const resetBoxPositions = () => {
  for (const handler of rigidBodyHandlers) {
    const body = world.getRigidBody(handler)
    const origin = boxOriginals.get(handler)
    body.setLinvel({ x: 0, y: 0, z: 0 }, true)
    body.setAngvel({ x: 0, y: 0, z: 0 }, true)
    body.setTranslation(origin.position, true)
    body.setRotation(origin.rotation, true)
  }
}

const boxesLoaded = (bodyHandlers: number[]) => {
  Object.assign(rigidBodyHandlers, bodyHandlers)

  for (const handler of rigidBodyHandlers) {
    const body = world.getRigidBody(handler)
    boxOriginals.set(Number(handler), {
      position: body.translation(),
      rotation: body.rotation(),
    })
  }
}

const state = reactive({
  mass: 2,
})

addGuiFolder(folder => {
  folder.name = "💥 Blast Page"
  folder.add({ blast }, "blast").name("Blast!!!")
  folder.add({ resetBoxPositions }, "resetBoxPositions").name("Reset boxes")
})
</script>
