<template lang="pug">
Title Face

DirectionalLight3D(:link-camera-position="true")
//- BlastBox(:position="[0, 5, 0]")

Tile1Material(v-slot="{ material }")
  TilePlane(:position="[0, 0, 0]" :dimensions="[8, 8]" :material="material" v-slot="{ mesh, position, dimensions, panelHovered }")
    MeshOutline(v-if="panelHovered" :mesh="mesh" :position="position" :dimensions="dimensions")
    KinematicRigidBody(:mesh="mesh" :position="position" :dimensions="dimensions")

Tile1Material(v-slot="{ material }")
  TilePlane(:dimensions="[8, 8]" :position="[1, 0, 9]" :material="material" v-slot="{ mesh, position, dimensions, panelHovered }")
    MeshOutline(v-if="panelHovered" :mesh="mesh" :position="position" :dimensions="dimensions")

template(v-if="state.player")
  component(:is="player" v-slot="{ video, streaming }")
    UseFace(:video="video" :streaming="streaming" v-slot="{ keypoints }")
      FaceMesh(:keypoints="keypoints.length > 0 && streaming ? keypoints : FaceKeypoints" :position="[-5, 5, -1]" :scale="10" v-slot="{ mesh, position, scale, panelHovered }")
        MeshOutline(v-if="panelHovered" :mesh="mesh" :position="position" :dimensions="[scale, scale]")
template(v-else)
  FaceMaterial(v-slot="{ material }")
    FaceMesh(:keypoints="FaceKeypoints" :position="[-5, 5, 0]" :scale="9" :material="material" v-slot="{ mesh, position, scale, panelHovered }")
      MeshOutline(v-if="panelHovered" :mesh="mesh" :position="position" :dimensions="[scale, scale]")
</template>

<script lang="ts" setup>
import FaceMesh from "~/components/3d/FaceMesh.vue"
import { useEnvironmentStore } from "~/stores/environment"
import VideoClipPlayer from "~/components/depth/VideoClipPlayer.vue"
import WebcamPlayer from "~/components/depth/WebcamPlayer.vue"
import FaceKeypoints from "~/3d/face.json"

useEnvironmentStore().$patch({
  skybox: 15,
} as any)

const state = reactive({
  throttle: 0,
  lerp: false,
  player: "",
})

const player = shallowRef(VideoClipPlayer)

addGuiFolder(folder => {
  folder.name = "☺ Face Page"
  folder.add(state, "player", ["", "Video Clip", "Webcam"]).onChange(v => {
    player.value = v === "Webcam" ? WebcamPlayer : VideoClipPlayer
  })
})
</script>
