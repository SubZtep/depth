<template lang="pug">
ParaPanel(title="Three Globe jol")
  .form
    div Surface
    select(v-model="state.surface")
      option.capitalize(v-for="v in surfaces" :key="v" :value="v") {{v}}

    div Scale
    .flex.justify-between.max-w-200px.gap-2
      input.flex-grow(type="range" min="0.001" max="0.1" step="0.001" v-model="state.scale")
      input.w-12(type="text" v-model="state.scale")

    div Position X
    input(type="range" min="-10" max="10" v-model="state.position[0]")
    div Position Y
    input(type="range" min="-10" max="10" v-model="state.position[1]")
    div Position Z
    input(type="range" min="-10" max="10" v-model="state.position[2]")
</template>

<script lang="ts" setup>
import ThreeGlobe from "three-globe"
import { loop3D, toVector, useScene } from "@depth/canvas"
import { Mesh } from "three/src/objects/Mesh"
import { SphereBufferGeometry } from "three/src/geometries/SphereGeometry"
import { MeshPhongMaterial } from "three/src/materials/MeshPhongMaterial"
import { Collider, ColliderDesc, RigidBodyDesc, RigidBodyType } from "@dimforge/rapier3d-compat"
import { getWorld } from "@depth/physics"

const terrains = ["topology", "water"] as const
const surfaces = ["blue-marble", "day", "night", "dark"] as const

const props = defineProps<{
  position?: PositionTuple
  scale?: number
  surface?: typeof surfaces[number]
  terrain?: typeof terrains[number]
  points?: { lat: number; lng: number }[]
}>()

const emit = defineEmits<{
  (e: "loaded", bodyHandler: number): void
}>()

const state = reactive({
  position: props.position ?? [0, 0, 0],
  scale: props.scale ?? 0.01,
  terrain: props.terrain ?? terrains[0],
  surface: props.surface ?? surfaces[0],
})

const Globe = new ThreeGlobe() //.showAtmosphere(false)
Globe.rotateY(-Math.PI / 2)
Globe.castShadow = true
Globe.receiveShadow = true

const scene = useScene()
scene.add(Globe)

if (props.points) {
  Globe.hexBinPointsData(props.points)
  Globe.hexBinPointWeight(3)
  Globe.hexBinResolution(2)
  Globe.hexMargin(0.2)
  Globe.hexTopColor(() => "darkgreen")
  Globe.hexSideColor(() => "green")
  Globe.hexBinMerge(true)
}

watchEffect(() => {
  Globe.position.set(...state.position)
  Globe.scale.set(state.scale, state.scale, state.scale)
  Globe.globeImageUrl(`/textures/globe/earth-${state.surface}.jpg`)
  Globe.bumpImageUrl(`/textures/globe/earth-${state.terrain}.png`)
})

const N = 300
const gData = [...Array.from({ length: N }).keys()].map(() => ({
  lat: (Math.random() - 0.5) * 180,
  lng: (Math.random() - 0.5) * 360,
  alt: Math.random(),
  radius: Math.random() * 3,
  color: ["red", "black"][Math.round(Math.random())],
}))

Globe.customLayerData(gData)
  .customThreeObject((d, _globeRadius) => {
    const mesh = new Mesh(
      // @ts-ignore
      new SphereBufferGeometry(d.radius, 5, 4),
      // @ts-ignore
      new MeshPhongMaterial({ color: d.color, shininess: 1 })
    )
    mesh.castShadow = true
    mesh.receiveShadow = true
    mesh.material.needsUpdate = true

    loop3D(() => {
      mesh.rotateY(Math.random() * 0.01)
    })

    return mesh
  })
  .customThreeObjectUpdate((obj, d) => {
    // @ts-ignore
    Object.assign(obj.position, Globe.getCoords(d.lat, d.lng, d.alt))
  })

loop3D(({ deltaTime }) => {
  for (const d of gData) d.lat += 10 * deltaTime
  Globe.customLayerData(Globe.customLayerData())
})

const world = getWorld()
const rigidBodyDesc = new RigidBodyDesc(RigidBodyType.Dynamic).setGravityScale(0)
const rigidBody = world.createRigidBody(rigidBodyDesc)
let collider: Collider

watchEffect(() => {
  if (collider) {
    world.removeCollider(collider, false)
  }

  // FIXME: collider size still not correct
  const colliderDesc = ColliderDesc.ball(state.scale * 200) // 1m = 0.005 in props.scale
  collider = world.createCollider(colliderDesc, rigidBody.handle)

  rigidBody.setTranslation(toVector(state.position), false)
})

emit("loaded", rigidBody.handle)

loop3D(() => {
  const pos = rigidBody.translation()
  const globePos = Globe.position
  if (globePos.x !== pos.x || globePos.y !== pos.y || globePos.z !== pos.z) {
    Globe.position.set(pos.x, pos.y, pos.z)
    // state.position = [pos.x, pos.y, pos.z]
  }
})

onScopeDispose(() => {
  world.removeCollider(collider, false)
  world.removeRigidBody(rigidBody)
  scene.remove(Globe)
})
</script>
