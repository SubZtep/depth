<template lang="pug">
Title.opacity-30.font-mono @.sNAILbuILd.TM

//- SnailShell(v-slot="{ snail }")
</template>

<script lang="ts" setup>
import { exec3D } from "@depth/three.js"
// import { DirectionalLight, Scene, SpotLight, SpotLightHelper } from "three"
import getSnailShell from "~/3D/goodybag/snail-shell"
import getSnailTorch from "~/3D/lights/snail-torch"
import { leafPlane } from "~/3D/sceneDefaults"

const leaf = await leafPlane()
leaf.position.set(0, 0.1, 0)

const snail = await getSnailShell()
const { spotLight, spotLightHelper } = getSnailTorch()
snail.add(spotLight)

exec3D(({ scene, cameraControls }) => {
  scene.add(snail, spotLight.target, spotLight.target, spotLightHelper, spotLight, leaf)
})

console.log("SEFE", snail)
</script>
