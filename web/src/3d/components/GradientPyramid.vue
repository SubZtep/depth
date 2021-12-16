<template lang="pug">
</template>

<script lang="ts" setup>
import type { Object3D } from "three/src/core/Object3D"
import { LatheGeometry } from "three/src/geometries/LatheGeometry"
import { Vector2 } from "three/src/math/Vector2"
import { Mesh } from "three/src/objects/Mesh"
import { Color } from "three/src/math/Color"
import GradientMaterial from "~/3d/materials/GradientMaterial"
import { useScene } from "@depth/canvas"
import { onScopeDispose } from "vue"
import { Quaternion } from "three"

const props = defineProps<{
  /** Add to a parent object instead of `Scene` */
  parent?: Object3D
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
const points: Vector2[] = []
const levels = props.levels ?? 5
for (let i = 0; i < levels + 1; i++) {
  points.push(new Vector2(i, i))
  if (i < levels) {
    points.push(new Vector2(i + 1, i))
  }

  // points.push(new Vector2(i, 0))
}

const geometry = new LatheGeometry(points, 4)
geometry.rotateX(-Math.PI / 2)
geometry.rotateZ(Math.PI / 4)
const material = new GradientMaterial(new Color("red"), new Color("black"))

const mesh = new Mesh(geometry, material)

if (props.position) {
  mesh.position.set(...props.position)
}

if (props.rotation) {
  mesh.setRotationFromQuaternion(new Quaternion().fromArray(props.rotation))
}

const scene = useScene()
scene.add(mesh)

onScopeDispose(() => {
  scene.remove(mesh)
})
</script>
