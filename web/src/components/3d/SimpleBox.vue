<template lang="pug">
slot(:mesh="mesh")
</template>

<script lang="ts" setup>
import { rotationFromQuaternion, useScene } from "@depth/canvas"
import { MeshLambertMaterial } from "three/src/materials/MeshLambertMaterial"
import { BoxGeometry } from "three/src/geometries/BoxGeometry"
import { Mesh } from "three/src/objects/Mesh"
import { onScopeDispose, useSlots, watchEffect } from "vue"
import type { Object3D } from "three/src/core/Object3D"

const props = defineProps<{
  /** Add to a parent object instead of `Scene` */
  parent?: Object3D
  position?: PositionTuple
  rotation?: RotationTuple
  size?: SizeTuple
  color?: number
}>()

const geometry = new BoxGeometry(props.size?.[0], props.size?.[1], props.size?.[2])
const material = new MeshLambertMaterial({ color: props.color ?? 0x000300 })
const mesh = shallowRef(new Mesh(geometry, material))

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
  if (props.parent) {
    props.parent.remove(mesh.value)
  } else {
    scene.remove(mesh.value)
  }
})
</script>
