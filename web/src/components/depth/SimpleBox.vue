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
}>()

const geometry = new BoxGeometry()
const material = new MeshLambertMaterial({ color: 0x000300 })
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
