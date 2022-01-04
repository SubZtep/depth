<template lang="pug">
Title Face

DirectionalLight3D(:link-camera-position="true")
//- BlastBox(:position="[0, 5, 0]")

EntityPanel(title="First Floor Panel" :position="[0, 0, 0]" v-slot="{ hover, position }")
  Tile1Material(v-slot="{ material }")
    TilePlane(:position="position" :dimensions="[8, 8]" :material="material" v-slot="{ mesh, dimensions }")
      MeshOutline(v-if="hover" :mesh="mesh" :position="position" :scale="1" :dimensions="dimensions")
      KinematicRigidBody(:mesh="mesh" :position="position" :dimensions="dimensions")

EntityPanel(title="Second Floor Panel" :position="[1, 0, 9]" v-slot="{ hover, position }")
  Tile1Material(v-slot="{ material }")
    TilePlane(:dimensions="[8, 8]" :position="position" :material="material" v-slot="{ mesh, dimensions }")
      MeshOutline(v-if="hover" :mesh="mesh" :position="position" :scale="1" :dimensions="dimensions")

template(v-if="state.player")
  component(:is="player" v-slot="{ video, streaming }")
    EntityPanel(title="Face" :position="[-5, 5, -1]" :scale="1" v-slot="{ hover, position, scale }")
      UseFace(:video="video" :streaming="streaming" v-slot="{ keypoints }")
        FaceMesh(:keypoints="keypoints.length > 0 && streaming ? keypoints : FaceKeypoints" :position="position" :scale="scale" v-slot="{ mesh }")
          MeshOutline(v-if="hover" :mesh="mesh" :position="position" :scale="scale" :dimensions="[scale, scale]")

EntityPanel(v-else title="Empty Face" :position="[-5, 5, 0]" :scale="1" v-slot="{ hover, position, scale }")
  FaceMaterial(v-slot="{ material }")
    FaceMesh(:keypoints="FaceKeypoints" :position="position" :scale="scale" :material="material" v-slot="{ mesh, bounding }")
      MeshOutline(v-if="hover" :mesh="mesh" :position="position" :scale="scale" :dimensions="[scale, scale]")
      CameraFit(:mesh="mesh" :position="position" :scale="scale" :bounding="bounding")

      .text-white {{bounding}}
</template>

<script lang="ts" setup>
import FaceMesh from "~/components/3d/FaceMesh.vue"
import { useEnvironmentStore } from "~/stores/environment"
import VideoClipPlayer from "~/components/depth/VideoClipPlayer.vue"
import WebcamPlayer from "~/components/depth/WebcamPlayer.vue"
import FaceKeypoints from "~/3d/face.json"
import EntityPanel from "~/components/panel/EntityPanel.vue"

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
