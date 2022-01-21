<template lang="pug">
</template>

<script lang="ts" setup>
import GradientMaterial from "~/3d/materials/GradientMaterial"
import { useScene } from "@depth/canvas"
import * as THREE from "three"

const props = defineProps<{
  /** Add to a parent object instead of `Scene` */
  parent?: THREE.Object3D
  position?: PositionTuple
  rotation?: RotationTuple
  levels?: number
}>()

// const points: Vector2[] = [
//   new Vector2(0, 0),
//   new Vector2(1, 0),
//   new Vector2(1, 1),
//   new Vector2(2, 1),
//   new Vector2(2, 2),
//   new Vector2(3, 2),
//   new Vector2(3, 3),
//   new Vector2(4, 3),
//   new Vector2(4, 4),
// ]
const points: THREE.Vector2[] = []
const levels = props.levels ?? 5
for (let i = 0; i < levels + 1; i++) {
  points.push(new THREE.Vector2(i, i))
  if (i < levels) {
    points.push(new THREE.Vector2(i + 1, i))
  }

  // points.push(new Vector2(i, 0))
}

const geometry = new THREE.LatheGeometry(points, 4)
geometry.rotateX(-Math.PI / 2)
geometry.rotateZ(Math.PI / 4)
const material = new GradientMaterial(new THREE.Color("red"), new THREE.Color("black"))

const mesh = new THREE.Mesh(geometry, material)

if (props.position) {
  mesh.position.set(...props.position)
}

if (props.rotation) {
  mesh.setRotationFromQuaternion(new THREE.Quaternion().fromArray(props.rotation))
}

const scene = useScene()
scene.add(mesh)

onScopeDispose(() => {
  scene.remove(mesh)
})
</script>
