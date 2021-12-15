<template lang="pug">
//- .pre.text-white
</template>

<script lang="ts" setup>
import { rotationFromQuaternion, useScene } from "@depth/canvas"
import { BoxGeometry } from "three"
import { MeshLambertMaterial } from "three/src/materials/MeshLambertMaterial"
import { Mesh } from "three/src/objects/Mesh"
import { onScopeDispose, watchEffect } from "vue"

const props = defineProps<{
  position: PositionTuple
  rotation: RotationTuple
  size?: SizeTuple
  color?: number
}>()

const geometry = new BoxGeometry(props.size?.[0], props.size?.[1], props.size?.[2])
const material = new MeshLambertMaterial({ color: props.color ?? 0x000300 })
const mesh = new Mesh(geometry, material)

watchEffect(() => {
  rotationFromQuaternion(mesh, props.rotation)
  mesh.position.set(...props.position)
})

const scene = useScene()
scene.add(mesh)

onScopeDispose(() => {
  scene.remove(mesh)
})

</script>
