<template lang="pug">
Title M̸̧̹̃o̶̥̪̓͝l̵͙̙̓l̸̘͑̅u̵̺̇s̷̡͖̿̌̓c̷͚̥͛o̴͇̘͝p̶̦̆̊͛h̷̢̖̎̕o̵̙̭̝̔͝ḃ̵͕̬̿i̸̥̠̒̈́̚a̵̽ͅ

//- Debug {{metaSnails}}
</template>

<script lang="ts" setup>
import greenFloor from "~/3D/meshes/green-floor"
import { leafPlane } from "~/3D/sceneDefaults"
import { Snail } from "~/3D/entities/Snail"
import { addGuiFolder } from "@depth/dat.gui"
import { useKeyboard } from "~/composables/useKeyboard"
import { useMetaSnails } from "~/composables/useMetaSnails"
import useSceneHelper from "~/composables/useSceneHelper"
import getSnailShell from "~/3D/goodybag/snail-shell"
import useResources from "~/composables/useResources"
import { usePlayerStore } from "~/stores/player"
import { Color, MeshPhongMaterial, Vector3 } from "three"

const playerStore = usePlayerStore()
const { metaSubscribe, validateHappiness } = useMetaSnails(playerStore as any)
const { addForPage } = useSceneHelper()
const { loader } = useResources()

const leaf = await leafPlane(new Vector3(0, -0.1, 0))
const floor = greenFloor({ opacity: 0.5 })
addForPage(leaf, floor)

const snailShell = await loader<Group>("SnailShell", getSnailShell)
const playerSnail = Snail.initialize(snailShell)
playerSnail.setInput(useKeyboard())

if (!playerStore.uuid) validateHappiness()
const metaSnails = new Map<string, Object3D>()
metaSubscribe(({ uuid, position, rotation, name, color }) => {
  if (!metaSnails.has(uuid)) {
    const metamat = new MeshPhongMaterial({ color: new Color(color), shininess: 150, flatShading: true })
    const meta = snailShell.clone(true)
    meta.traverse((node: any) => {
      if (node.material) node.material = metamat
    })
    meta.scale.set(0.06, 0.06, 0.06)
    metaSnails.set(uuid, meta)
    addForPage(meta)
  }

  const metasnail = metaSnails.get(uuid)!
  // TODO: lerp position
  metasnail.position.set(position.x, position.y, position.z)
  metasnail.setRotationFromQuaternion(rotation as Quaternion)
})

onBeforeUnmount(() => {
  for (const metasnail of metaSnails.values()) {
    metasnail.traverse((node: any) => node?.dispose())
  }
  metaSnails.clear()
})

addGuiFolder(folder => {
  folder.name = "🐌 Meta Snail"
  folder.add(playerStore, "name").name("Your Name")
  folder.addColor(playerStore, "color").name("Your Colour")
  // folder.add(playerSnail, "jump")
  // folder.add(playerSnail, "push")
})
</script>
