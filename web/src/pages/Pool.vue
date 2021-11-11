<template lang="pug">
Title Object Pool Test
</template>

<script lang="ts" setup>
import { addGuiFolder } from "@depth/dat.gui"
import { exec3D, loop3D } from "@depth/three.js"
import { BoxGeometry } from "three/src/geometries/BoxGeometry"
import { MeshBasicMaterial } from "three/src/materials/MeshBasicMaterial"
import { Euler } from "three/src/math/Euler"
import { Mesh } from "three/src/objects/Mesh"
import { Entity, SystemRotate } from "~/composables/useECS"
import useObjectPool from "~/composables/useObjectPool"

const toast = useToast()

const geometry = new BoxGeometry(1, 1, 1)
const material1 = new MeshBasicMaterial({ color: 0xffff00 })
const material2 = new MeshBasicMaterial({ color: 0xff00ff })

// let rot = 0
const rot = new Euler(0, 0, 0)

// loop3D(() => {
//   // rotY++
//   rot.y++
//   console.log(rot)
// })

function createM1() {
  const mesh = new Mesh(geometry, material1)
  mesh.setRotationFromEuler(rot)
  // mesh.rotation.set(rot)
  // mesh.rotateY() = getRotY
  return mesh
}

function createM2() {
  return new Mesh(geometry, material2)
}

const pool1 = useObjectPool<Mesh>({ modelType: "m1", creator: createM1 })
const pool2 = useObjectPool<Mesh>({ modelType: "m2", creator: createM2, size: 10 })

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

const addM1 = () => {
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
  return cube
}

const btns = {
  newRow: () => {
    const cubes = newRow(x++)
    exec3D(({ scene }) => {
      scene.add(...cubes)
    })
  },

  addM1,

  delM1: () => {
    try {
      pool1.release()
    } catch (e: any) {
      toast.error(e.message)
    }
  },

  ecs: () => {
    const obj = addM1()
    if (!obj) return

    const entity = new Entity()
    entity.addComponent(obj)
    entity.addSystem(SystemRotate)

    loop3D(() => {
      entity.update()
    })
  },
}

addGuiFolder(folder => {
  folder.name = "Object Pool Test"
  folder.add(btns, "newRow").name("Try mem leak")
  folder.add(btns, "addM1")
  folder.add(btns, "delM1")
  folder.add(btns, "ecs")
})
</script>
