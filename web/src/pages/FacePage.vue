<template lang="pug">
Title Face

UseDirectionalLight(:link-camera-position="true")

Tile1Material(v-slot="{ material }")
  TilePlane(:width="8" :height="8" :material="material")

Tile1Material(v-slot="{ material }")
  TilePlane(:width="8" :height="8" :position="[1, 0, 9]" :material="material")

//- WebcamPlayer(v-slot="{ video, streaming }")
  FaceMesh(:video="video" :streaming="streaming" :throttle="state.throttle" :lerp="state.lerp" :position="[-5, 5, -1]" :scale="10")

VideoClipPlayer(v-slot="{ video, streaming }")
  FaceMesh(:video="video" :streaming="streaming" :throttle="state.throttle" :lerp="state.lerp" :position="[-5, 5, -1]" :scale="10")

</template>

<script lang="ts" setup>
import FaceMesh from "~/components/3d/FaceMesh.vue"
import { useEnvironmentStore } from "~/stores/environment"
import VideoClipPlayer from "~/components/depth/VideoClipPlayer.vue"

useEnvironmentStore().$patch({
  skybox: 15,
} as any)

const state = reactive({
  throttle: 0,
  lerp: false,
})

// const directionalLight = new DirectionalLight(0xffffff, 0.8)
// directionalLight.position.set(0, 10, -5)
// directionalLight.rotateZ(Math.PI / 8)
// useScene().add(directionalLight)
addGuiFolder(folder => {
  folder.name = "☺ Face Page"
  folder.add(state, "throttle", 0, 1000, 50)
  folder.add(state, "lerp")
  folder.close()
})
</script>
