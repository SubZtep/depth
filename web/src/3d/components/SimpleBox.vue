<template lang="pug">
slot(:mesh="mesh")
</template>

<script lang="ts" setup>
import { Mesh } from "three/src/objects/Mesh"
import { Collider, ColliderDesc, RigidBody, RigidBodyDesc, World } from "@dimforge/rapier3d-compat"
import { MeshLambertMaterial } from "three/src/materials/MeshLambertMaterial"
import { BoxGeometry } from "three/src/geometries/BoxGeometry"
import { rotationFromQuaternion, useScene } from "@depth/canvas"
import { getWorld } from "@depth/physics"
import type { Object3D } from "three/src/core/Object3D"

const props = defineProps<{
  /** Add to a parent object instead of `Scene` */
  parent?: Object3D
  position?: PositionTuple
  rotation?: RotationTuple
  size?: SizeTuple
  color?: number
  physics?: boolean
}>()

const geometry = new BoxGeometry(props.size?.[0], props.size?.[1], props.size?.[2])
const material = new MeshLambertMaterial({ color: props.color ?? 0x000300 })
const mesh = shallowRef(new Mesh(geometry, material))

let world: World
let rigidBody: RigidBody
let collider: Collider

if (props.physics) {
  world = getWorld()
  const rigidBodyDesc = RigidBodyDesc.newDynamic().setCcdEnabled(true)
  rigidBodyDesc.setAdditionalMass(0.2)
  rigidBody = world.createRigidBody(rigidBodyDesc)
  const colliderDesc = ColliderDesc.cuboid(0.6 / 2, 0.45 / 2, 0.7 / 2)
  colliderDesc.setDensity(2)
  collider = world.createCollider(colliderDesc, rigidBody.handle)
}

if (props.position) {
  watch(
    () => props.position!,
    position => void mesh.value.position.set(...position),
    { immediate: true }
  )
}

if (props.rotation) {
  watch(
    () => props.rotation!,
    rotation => rotationFromQuaternion(mesh.value, rotation),
    { immediate: true }
  )
}

const scene = useScene()

if (props.parent) {
  props.parent.add(mesh.value)
} else {
  scene.add(mesh.value)
}

onScopeDispose(() => {
  if (props.physics) {
    world.removeCollider(collider, true)
    world.removeRigidBody(rigidBody)
  }

  if (props.parent) {
    props.parent.remove(mesh.value)
  } else {
    scene.remove(mesh.value)
  }
})
</script>
