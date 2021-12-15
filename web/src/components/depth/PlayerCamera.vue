<template lang="pug">
pre.text-white.absolute.top-0 {{props.rotation}} {{euler}}
</template>

<script lang="ts" setup>
import { exec3D, rotationFromQuaternion, useScene } from "@depth/canvas"
import { useCameraControls } from "@depth/controller"
import { createBoxCollider, getWorld } from "@depth/physics"
import { FrontSide } from "three/src/constants"
import { PlaneGeometry } from "three/src/geometries/PlaneGeometry"
import { MeshLambertMaterial } from "three/src/materials/MeshLambertMaterial"
import { Euler } from "three/src/math/Euler"
import { Quaternion } from "three/src/math/Quaternion"
import { Mesh } from "three/src/objects/Mesh"
import { MathUtils, Object3D, Vector3 } from "three/src/Three"
import { onScopeDispose, watchEffect } from "vue"

const props = defineProps<{
  position: PositionTuple
  rotation: RotationTuple
}>()

const cc = useCameraControls()

const EPS = 1e-5
// in order to archive FPS look, set EPSILON for the distance to the center
cc.camera.position.set(0, 0, EPS)
cc.minDistance = cc.maxDistance = 1
cc.azimuthRotateSpeed = -0.3 // negative value to invert rotation direction
cc.polarRotateSpeed = -0.3 // negative value to invert rotation direction
cc.truckSpeed = 10
// cc.enabled = false
// cc.setPosition(-100, 1, 0)
// cc.setTarget(0, 0, 1)

function getAxisAndAngelFromQuaternion(q: RotationTuple) {
  const angle = 2 * Math.acos(q[3])
  let s: number
  // eslint-disable-next-line unicorn/prefer-ternary
  if (1 - q[3] * q[3] < 0.000001) {
    // test to avoid divide by zero, s is always positive due to sqrt
    // if s close to zero then direction of axis not important
    // http://www.euclideanspace.com/maths/geometry/rotations/conversions/quaternionToAngle/
    s = 1
  } else {
    s = Math.sqrt(1 - q[3] * q[3])
  }
  return { axis: [q[0] / s, q[1] / s, q[2] / s], angle }
  // const angle = 2 * Math.acos(q.w)
  // var s
  // if (1 - q.w * q.w < 0.000001) {
  //   // test to avoid divide by zero, s is always positive due to sqrt
  //   // if s close to zero then direction of axis not important
  //   // http://www.euclideanspace.com/maths/geometry/rotations/conversions/quaternionToAngle/
  //   s = 1
  // } else {
  //   s = Math.sqrt(1 - q.w * q.w)
  // }
  // return { axis: new Vector3(q.x / s, q.y / s, q.z / s), angle }
}

const obj1 = new Object3D()
// const obj2 = new Object3D()
// cc.camera.position.setZ(-105)
// obj1.add(cc.camera)
// obj1.position.setZ(10)
// obj2.add(obj1)

// obj3d.position.set(0, 1, 0)

const euler = ref(new Euler())

// let camera
// exec3D(({ camera, scene }) => {
//   // camera = c
//   obj1.add(camera)
//   obj1.position.set(0, 1, -10)
//   // obj2.add(obj1)
//   scene.add(obj1)
//   // camera.position.set(0, 2, 0)
//   // camera.position.setTarget(0, 2, 100)
// })

watchEffect(() => {
  const q = new Quaternion(...props.rotation)
  // q.x *= -1
  //obj1?.rotation.setFromQuaternion(q)
  // obj1?.setRotationFromQuaternion(q)
  euler.value.setFromQuaternion(q)
  // euler.value.setFromQuaternion(new Quaternion(...props.rotation).normalize())
  // euler.value.setFromQuaternion(new Quaternion(...props.rotation).normalize())
  // cc.rotateAzimuthTo(-euler.z, true)
  // cc.rotatePolarTo(-euler.x, true)
  // cc.rotateTo(-euler.value.y, euler.value.x, true)
  // cc.rotateTo(-euler.value.y, Math.PI / 2, true)
  // cc.camera.up.angleTo(new Euler().setFromQuaternion(new Quaternion(...props.rotation)).toVector3())
  // cc.updateCameraUp()
  // cc.rotateAzimuthTo(-props.rotation[0] * 0.1, true)
  // cc.rotatePolarTo(-props.rotation[1] * 0.1, true)
  // console.log(getAxisAndAngelFromQuaternion(props.rotation))

  // cc.rotateTo(q.x, q.y, true)
  // rotationFromQuaternion(cc.camera., props.rotation)
  // rotationFromQuaternion(obj1, props.rotation)

  // rotationFromQuaternion(obj2, props.rotation)
  // obj2.quaternion.invert()
  // cc.currentAction.rotation.set(...props.rotation)
  // cc.rotate(0, 0, false)

  // console.log(obj3d.rotation.y * MathUtils.DEG2RAD)

  // cc.rotateTo(-obj3d.rotation.y * MathUtils.DEG2RAD, 0, false)
  // cc.rotateTo(-obj2.rotation.y * MathUtils.DEG2RAD, -obj2.rotation.x * MathUtils.DEG2RAD, true)

  // cc.rotateTo(-obj2.rotation.y * MathUtils.DEG2RAD, 0, true)
  // cc.rotate(0, -obj2.rotation.y * MathUtils.DEG2RAD, false)
  // cc.rotateAzimuthTo(-obj2.rotation.y * MathUtils.DEG2RAD, false)

  // const q = new Quaternion(...props.rotation)
  // cc.rotateAzimuthTo(q.x * MathUtils.DEG2RAD, true)
  // cc.rotateTo(obj1.rotation.x, obj1.rotation.y, true)
  // cc.rotateTo(props.rotation[0], props.rotation[2], true)
  // q.

  // const euler = new Euler().setFromQuaternion(new Quaternion(...props.rotation))

  // console.log(Math.atan2(euler.y, euler.x))
  // console.log(e)
  // euler.
  // cc.rotate(Math.atan2(euler.y, euler.x) * (180 / Math.PI), 0, false)
  // cc.rotate(euler.x, euler.y, false)
  // console.log(new Euler().setFromQuaternion(new Quaternion(...props.rotation)))
})

// cc.camera.rotation
// cc.rotate()

// const geometry = new BoxGeometry()
// const material = new MeshLambertMaterial({ color: 0x000300 })
// const mesh = new Mesh(geometry, material)

// watchEffect(() => {
//   // console.log(props.rotation)
//   rotationFromQuaternion(mesh, props.rotation)
//   mesh.position.set(...props.position)
// })

// const scene = useScene()
// scene.add(mesh)

// onScopeDispose(() => {
//   scene.remove(mesh)
// })
</script>
