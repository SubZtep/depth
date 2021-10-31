<template lang="pug">
Title Object Pool Test
</template>

<script lang="ts" setup>
import { exec3D } from "@depth/three.js"
import { BoxGeometry, MeshBasicMaterial, Mesh } from "three"

const geometry = new BoxGeometry(1, 1, 1)
const material = new MeshBasicMaterial({ color: 0xffff00 })

exec3D(({ scene }) => {
  // TODO: pool
  for (let x = -4; x < 5; x++) {
    for (let y = 1; y < 6; y++) {
      const cube = new Mesh(geometry, material)
      cube.position.set(0, y * 2, x * 2)
      scene.add(cube)
    }
  }
})
</script>
