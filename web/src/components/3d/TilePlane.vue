<template lang="pug">
ParaPanel(title="Tile Plane" @hover="toggleOutline")
  div Width
  InputNumber(v-model="state.width" :min="1" :max="10")
  div Height
  InputNumber(v-model="state.height" :min="1" :max="10")

  div Position
  InputXYZ(v-model="state.position")

slot(:mesh="mesh")
</template>

<script lang="ts" setup>
import { useScene, createOutlinedMesh, disposeMesh } from "@depth/canvas"
import { getWorld } from "@depth/physics"
import { Collider, ColliderDesc, RigidBodyDesc, RigidBodyType } from "@dimforge/rapier3d-compat"
import { PlaneGeometry } from "three/src/geometries/PlaneGeometry"
import { Material } from "three/src/materials/Material"
import { LineSegments } from "three/src/objects/LineSegments"
import { Mesh } from "three/src/objects/Mesh"
import { useCameraFit } from "~/composables/useCameraFit"

const props = defineProps<{
  width: number
  height: number
  material?: Material
  position?: PositionTuple
}>()

const state = reactive({
  width: props.width,
  height: props.height,
  position: props.position ?? [0, 0, 0],
})

const scene = useScene()
const world = getWorld()

const mesh = new Mesh(undefined, props.material)
mesh.material.needsUpdate = true
mesh.receiveShadow = true
mesh.matrixAutoUpdate = false
mesh.rotateX(-Math.PI / 2)

scene.add(mesh)

useCameraFit().add(mesh)

const rigidBodyDesc = new RigidBodyDesc(RigidBodyType.KinematicPositionBased)
const rigidBody = world.createRigidBody(rigidBodyDesc)
let groundCollider: Collider
let outline: LineSegments | null

const toggleOutline = (show: boolean) => {
  if (outline) {
    scene.remove(outline)
    disposeMesh(outline)
    outline = null
  }

  if (show) {
    outline = createOutlinedMesh(mesh.geometry, "yellow")
    outline.position.set(...state.position)
    outline.rotateX(-Math.PI / 2)
    scene.add(outline)
  }
}

watchEffect(() => {
  mesh.geometry?.dispose()
  mesh.geometry = new PlaneGeometry(state.width, state.height, 1, 1)
  mesh.position.set(...state.position)
  mesh.updateMatrix()

  toggleOutline(!!outline)

  if (groundCollider) {
    world.removeCollider(groundCollider, false)
  }
  const groundColliderDesc = ColliderDesc.cuboid(state.width / 2, 0.1, state.height / 2)
  groundCollider = world.createCollider(groundColliderDesc, rigidBody.handle)
  rigidBody.setNextKinematicTranslation({ x: state.position[0], y: state.position[1] - 0.1, z: state.position[2] })
})

onScopeDispose(() => {
  toggleOutline(false)
  scene.remove(mesh)
  world.removeCollider(groundCollider, true)
})
</script>
