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
import { useScene, createOutlinedMesh, disposeMesh } from "@depth/canvas"
import { getWorld } from "@depth/physics"
import { Collider, ColliderDesc, RigidBodyDesc, RigidBodyType } from "@dimforge/rapier3d-compat"
import { PlaneGeometry } from "three/src/geometries/PlaneGeometry"
import { Material } from "three/src/materials/Material"
import { LineSegments } from "three/src/objects/LineSegments"
import { Mesh } from "three/src/objects/Mesh"
import { useCameraFit } from "~/composables/useCameraFit"

const props = defineProps<{
  mesh: Mesh
  updated?: boolean
  // width: number
  // height: number
  // material?: Material
  // position?: PositionTuple
}>()

// const state = reactive({
//   width: props.width,
//   height: props.height,
//   position: props.position ?? [0, 0, 0],
// })

const scene = useScene()
const world = getWorld()

const rigidBodyDesc = new RigidBodyDesc(RigidBodyType.KinematicPositionBased)
const rigidBody = world.createRigidBody(rigidBodyDesc)
let groundCollider: Collider
let collider: Collider

const dispose = () => {
  if (collider) {
    world.removeCollider(collider, false)
  }
}
const create = () => {
  const meshData = props.mesh.geometry.toJSON()
  const groundColliderDesc = ColliderDesc.cuboid(meshData.width / 2, 0.1, meshData.height / 2)
  groundCollider = world.createCollider(groundColliderDesc, rigidBody.handle)

  rigidBody.setNextKinematicTranslation({ x: props.mesh.position[0], y: props.mesh.position[1] - 0.1, z: props.mesh.position[2] })

}

watch(() => props.updated, () => {
  // if (updated) {
  dispose()
  create()
  // }
})

watchEffect(() => {
  console.log("KIN", props.mesh.geometry.toJSON().width)


  // const groundColliderDesc = ColliderDesc.cuboid(props.mesh.geometry state.width / 2, 0.1, state.height / 2)
  // groundCollider = world.createCollider(groundColliderDesc, rigidBody.handle)
  // rigidBody.setNextKinematicTranslation({ x: props.mesh.position[0], y: props.mesh.position[1] - 0.1, z: props.mesh.position[2] })
})


onScopeDispose(() => {
  world.removeCollider(groundCollider, false)
})
</script>
