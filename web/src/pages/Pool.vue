<template lang="pug">
Title Object Pool Test
</template>

<script lang="ts" setup>
import { addGuiFolder } from "@depth/dat.gui"
import { exec3D } from "@depth/three.js"
import { BoxGeometry, MeshBasicMaterial, Mesh } from "three"
import useObjectPool from "~/composables/useObjectPool"

const toast = useToast()

const geometry = new BoxGeometry(1, 1, 1)
const material1 = new MeshBasicMaterial({ color: 0xffff00 })
const material2 = new MeshBasicMaterial({ color: 0xff00ff })

function createM1() {
  return new Mesh(geometry, material1)
}

function createM2() {
  return new Mesh(geometry, material2)
}

const pool1 = useObjectPool<Mesh>("m1", createM1, 10)
const pool2 = useObjectPool<Mesh>("m2", createM2, 10)

const newRow = (xx: number) => {
  const creator = xx % 2 === 0 ? createM1 : createM2
  const cubes: Mesh[] = []
  for (let z = -50; z < 50; z++) {
    for (let y = 1; y < 20; y++) {
      const cube = creator()
      cube.position.set(-xx * 2, y * 2, z * 2)
      cubes.push(cube)
    }
  }
  return cubes
}

let x = 0
const numOfRows = 100

const btns = {
  newRow: () => {
    const cubes = newRow(x++)
    exec3D(({ scene }) => {
      scene.add(...cubes)
    })
  },

  addM1: () => {
    let cube: Mesh

    try {
      cube = pool1.acquire()
    } catch (e: any) {
      toast.error(e.message)
      return
    }

    const num = pool1.assigned()
    const col = Math.floor(num / numOfRows)
    const row = num % numOfRows

    cube.position.set(-x * 2, (col - 20) * -2, (row - 50) * 2)
  },

  delM1: () => {
    try {
      pool1.release()
    } catch (e: any) {
      toast.error(e.message)
    }
  },
}

addGuiFolder(folder => {
  folder.name = "Object Pool Test"
  // folder.add(btns, "newRow").name("Try mem leak")
  folder.add(btns, "addM1")
  folder.add(btns, "delM1")
})
</script>
