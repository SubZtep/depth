<template lang="pug">
ParaPanel(title="Directional Light")
  div Color
  InputColor(v-model="state.color")
  div Intensity
  InputNumber(v-model="state.intensity" :min="0" :max="10" :step="0.1")
</template>

<script lang="ts" setup>
import { useScene, createOutlinedMesh, disposeMesh, loop3D } from "@depth/canvas"
import { useCameraControls } from "@depth/controller"
import { getWorld } from "@depth/physics"
import { Collider, ColliderDesc, RigidBodyDesc, RigidBodyType } from "@dimforge/rapier3d-compat"
import { PlaneGeometry } from "three/src/geometries/PlaneGeometry"
import { DirectionalLight } from "three/src/lights/DirectionalLight"
import { MeshStandardMaterial } from "three/src/materials/MeshStandardMaterial"
import { Color } from "three/src/math/Color"
import { LineSegments } from "three/src/objects/LineSegments"
import { Mesh } from "three/src/objects/Mesh"

const props = defineProps<{
  //   width: number
  //   height: number
  //   material: MeshStandardMaterial
  //   position?: PositionTuple
  linkCameraPosition?: boolean
}>()

const state = reactive({
  color: "#ffffff",
  intensity: 1,
  //   width: props.width,
  //   height: props.height,
  //   position: props.position ?? [0, 0, 0],
})

const scene = useScene()
// const world = getWorld()

// const color = new Color()

// const directionalLight = new DirectionalLight(color, 1)
const directionalLight = new DirectionalLight()
// directionalLight.color
// directionalLight.position.set(...cc.camera.position.toArray())
// directionalLight.target.position.set(0, 1, 0)
directionalLight.castShadow = true
directionalLight.shadow.mapSize.width = 512 // default
directionalLight.shadow.mapSize.height = 512 // default
directionalLight.shadow.camera.near = 0.5 // default
directionalLight.shadow.camera.far = 100 // default
scene.add(directionalLight, directionalLight.target)

if (props.linkCameraPosition) {
  const cc = useCameraControls()
  loop3D(() => {
    directionalLight.position.set(...cc.camera.position.toArray())
    directionalLight.target.position.set(-4, 2, 0)
  })
}

watchEffect(() => {
  directionalLight.color.set(state.color)
  directionalLight.intensity = state.intensity
  // color.set(state.color)
  // directionalLight.updateMatrix()
})

// const mesh = new Mesh(undefined, props.material)
// mesh.material.needsUpdate = true
// mesh.receiveShadow = true
// mesh.matrixAutoUpdate = false
// mesh.rotateX(-Math.PI / 2)

// scene.add(mesh)

// const rigidBodyDesc = new RigidBodyDesc(RigidBodyType.KinematicPositionBased)
// const rigidBody = world.createRigidBody(rigidBodyDesc)
// let groundCollider: Collider
// let outline: LineSegments | null

// const toggleOutline = (show: boolean) => {
//   if (outline) {
//     scene.remove(outline)
//     disposeMesh(outline)
//     outline = null
//   }

//   if (show) {
//     outline = createOutlinedMesh(mesh.geometry, "yellow")
//     outline.position.set(...state.position)
//     outline.rotateX(-Math.PI / 2)
//     scene.add(outline)
//   }
// }

// watchEffect(() => {
//   mesh.geometry?.dispose()
//   mesh.geometry = new PlaneGeometry(state.width, state.height, 1, 1)
//   mesh.position.set(...state.position)
//   mesh.updateMatrix()

//   toggleOutline(!!outline)

//   if (groundCollider) {
//     world.removeCollider(groundCollider, false)
//   }
//   const groundColliderDesc = ColliderDesc.cuboid(state.width / 2, 0.1, state.height / 2)
//   groundCollider = world.createCollider(groundColliderDesc, rigidBody.handle)
//   rigidBody.setNextKinematicTranslation({ x: state.position[0], y: state.position[1] - 0.1, z: state.position[2] })
// })

onScopeDispose(() => {
  scene.remove(directionalLight, directionalLight.target)
  directionalLight.dispose()
  //   toggleOutline(false)
  //   scene.remove(mesh)
  //   world.removeCollider(groundCollider, true)
})
</script>
