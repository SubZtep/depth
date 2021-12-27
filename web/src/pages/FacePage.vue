<template lang="pug">
Title Face

WebcamPlayer(v-slot="{ video, streaming }")
  FaceMesh(:video="video" :streaming="streaming" :throttle="state.throttle" :lerp="state.lerp")
  //- div {{video}} {{streaming}}

//- WebcamPlayer(v-slot="{ video, streaming }")
//- VideoPlayer(:src="state.src" :key="state.src || 'none'" :play="state.showVideo" v-visible="state.showVideo")
</template>

<script lang="ts" setup>
import WebcamPlayer from "~/components/depth/WebcamPlayer.vue"
import FaceMesh from "~/components/3d/FaceMesh.vue"
import { DirectionalLight } from "three/src/lights/DirectionalLight"
import { useScene } from "@depth/canvas"

const state = reactive({
  throttle: 0,
  lerp: false,
})


    const directionalLight = new DirectionalLight(0xffffff, 0.8)
    directionalLight.position.set(0, 10, -5)
    directionalLight.rotateZ(Math.PI / 8)
useScene().add(directionalLight)
addGuiFolder(folder => {
  folder.name = "☺ Face Page"
  folder.add(state, "throttle", 0, 1000, 50)
  folder.add(state, "lerp")
})
</script>
