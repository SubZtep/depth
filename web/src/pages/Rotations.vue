<template lang="pug">
Title Rotations

//- Debug {{cone}}
</template>

<script lang="ts" setup>
import { exec3D } from "@depth/three.js"
import { ConeGeometry } from "three/src/geometries/ConeGeometry"
import { MeshPhongMaterial } from "three/src/materials/MeshPhongMaterial"
import { Mesh } from "three/src/objects/Mesh"
import { addGuiFolder } from "@depth/dat.gui"
import { Object3D } from "three/src/core/Object3D"

const geometry = new ConeGeometry(0.2, 2, 4)
const material = new MeshPhongMaterial({ color: 0xaaaa00 })
const cone = new Mesh(geometry, material)
cone.position.set(0, 1, 0)

const pivot = new Object3D()
pivot.add(cone)

onMounted(() => {
  exec3D(({ scene }) => {
    scene.add(pivot)
  })
})

onBeforeUnmount(() => {
  exec3D(({ scene }) => {
    scene.remove(pivot)
  })
  material.dispose()
  geometry.dispose()
})

const state = reactive({
  rotateX: 0,
  rotateY: 0,
  rotateZ: 0,
})

addGuiFolder(folder => {
  folder.name = "♡ Cone"
  folder
    .add(state, "rotateX", 0, 360)
    .name("Rotate X")
    .onChange(r => {
      pivot.rotation.x = (r * Math.PI) / 180
    })
  folder
    .add(state, "rotateY", 0, 360)
    .name("Rotate Y")
    .onChange(r => {
      pivot.rotation.y = (r * Math.PI) / 180
    })
  folder
    .add(state, "rotateZ", 0, 360)
    .name("Rotate Z")
    .onChange(r => {
      pivot.rotation.z = (r * Math.PI) / 180
    })
})
</script>
