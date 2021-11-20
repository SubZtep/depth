<template lang="pug">
Title M̸̧̹̃o̶̥̪̓͝l̵͙̙̓l̸̘͑̅u̵̺̇s̷̡͖̿̌̓c̷͚̥͛o̴͇̘͝p̶̦̆̊͛h̷̢̖̎̕o̵̙̭̝̔͝ḃ̵͕̬̿i̸̥̠̒̈́̚a̵̽ͅ

//- SnailShell(v-slot="{ snail }")
</template>

<script lang="ts" setup>
import { exec3D } from "@depth/three.js"
import greenFloor from "~/3D/meshes/green-floor"
import { leafPlane } from "~/3D/sceneDefaults"
import { Snail } from "~/3D/entities/Snail"
import { addGuiFolder } from "@depth/dat.gui"

const leaf = await leafPlane()
leaf.position.set(0, -0.1, 0)

const floor = greenFloor()

exec3D(({ scene }) => {
  scene.add(leaf, floor)
})

const snail = await Snail.initialize()

const buttons = {
  jump: () => {
    snail.rigidBody.applyForce({ x: 0, y: 1, z: 0 }, true)
  },
  go: () => {
    snail.rigidBody.applyForce({ x: 0, y: 0, z: -0.1 }, true)
  },
}

addGuiFolder(folder => {
  folder.name = "Game Helper"
  folder.add(buttons, "jump")
  folder.add(buttons, "go")
})
</script>
