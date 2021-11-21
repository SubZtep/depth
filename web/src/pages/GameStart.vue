<template lang="pug">
Title M̸̧̹̃o̶̥̪̓͝l̵͙̙̓l̸̘͑̅u̵̺̇s̷̡͖̿̌̓c̷͚̥͛o̴͇̘͝p̶̦̆̊͛h̷̢̖̎̕o̵̙̭̝̔͝ḃ̵͕̬̿i̸̥̠̒̈́̚a̵̽ͅ

//- Debug {{metaSnails}}
</template>

<script lang="ts" setup>
import { exec3D } from "@depth/three.js"
import greenFloor from "~/3D/meshes/green-floor"
import { leafPlane } from "~/3D/sceneDefaults"
import { Snail } from "~/3D/entities/Snail"
import { addGuiFolder } from "@depth/dat.gui"
import { useKeyboard } from "~/composables/useKeyboard"
import { useMetaSnails } from "~/composables/useMetaSnails"
import useSceneHelper from "~/composables/useSceneHelper"
import getSnailShell from "~/3D/goodybag/snail-shell"
import type { Object3D } from "three/src/core/Object3D"
import type { Quaternion } from "three/src/math/Quaternion"

const { metaSubscribe, validateHappiness } = useMetaSnails()
const { addForPage } = useSceneHelper()

const leaf = await leafPlane()
leaf.position.set(0, -0.1, 0)

const floor = greenFloor()

exec3D(({ scene }) => {
  scene.add(leaf, floor)
})

const playerSnail = await Snail.initialize()
playerSnail.setInput(useKeyboard())

validateHappiness()
const metaSnails = new Map<string, Object3D | null>()
metaSubscribe(async ({ uuid, position, rotation }) => {
  if (!metaSnails.has(uuid)) {
    // eslint-disable-next-line unicorn/no-null
    metaSnails.set(uuid, null)
    const meta = await getSnailShell()
    // XXX: horror:
    // const meta = await Snail.initialize()
    // meta.object3D.scale.set(0.5, 0.5, 0.5)
    meta.scale.set(0.06, 0.06, 0.06)
    metaSnails.set(uuid, meta)
    addForPage(meta)
  }

  const metasnail = metaSnails.get(uuid)
  if (!metasnail) return // waiting for await above
  metasnail.position.set(position.x, position.y, position.z)
  metasnail.setRotationFromQuaternion(rotation as Quaternion)
})

addGuiFolder(folder => {
  folder.name = "Game Helper"
  folder.add(playerSnail, "jump")
  folder.add(playerSnail, "push")
})
</script>
