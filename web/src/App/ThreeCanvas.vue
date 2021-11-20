<template lang="pug">
Teleport(to="#scene")
  canvas(ref="wc")

MainScene
</template>

<script lang="ts" setup>
import { useThreeJSEventHook, useCanvas } from "@depth/three.js"
// import { onVisibility } from "../events"
// import { createDefaultObjects } from "../3D/sceneDefaults"
import { sleep } from "@depth/misc"
import { getRapier } from "~/3D/entities/PhysicalWorld"

const wc = ref()
const threeJs = useThreeJSEventHook()

useCanvas(wc) // .add(...(await createDefaultObjects()))

// await rapier.install()
await getRapier()

await sleep(69)
useNProgress().done()
threeJs.trigger({ cmd: "Resume" })

// onVisibility(({ visible }) => {
//   threeJs.trigger(visible ? resumeLoop : pauseLoop)
// })
</script>
