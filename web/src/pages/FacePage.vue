<template lang="pug">
Title Face

UseDirectionalLight(:link-camera-position="true")

Tile1Material(v-slot="{ material }")
  TilePlane(:width="8" :height="8" :material="material")

Tile1Material(v-slot="{ material }")
  TilePlane(:width="8" :height="8" :position="[1, 0, 9]" :material="material")

component(:is="player" v-slot="{ video, streaming }")
  pre.text-white {{video.width}} x {{video.height}}
  UseFace(:video="video" :streaming="streaming" v-slot="{ keypoints }")
    FaceMesh(:keypoints="keypoints" :position="[-5, 5, -1]" :scale="10")
</template>

<script lang="ts" setup>
import FaceMesh from "~/components/3d/FaceMesh.vue"
import { useEnvironmentStore } from "~/stores/environment"
import VideoClipPlayer from "~/components/depth/VideoClipPlayer.vue"
import WebcamPlayer from "~/components/depth/WebcamPlayer.vue"

useEnvironmentStore().$patch({
  skybox: 15,
} as any)

const state = reactive({
  throttle: 0,
  lerp: false,
  player: "Video Clip",
})

const player = shallowRef(VideoClipPlayer)

addGuiFolder(folder => {
  folder.name = "☺ Face Page"
  folder
    .add(state, "player", ["Video Clip", "Webcam"])
    .name("Player")
    .onChange(v => {
      if (v === "Webcam") {
        player.value = WebcamPlayer
      } else if (v === "Video Clip") {
        player.value = VideoClipPlayer
      }
    })
})
</script>
