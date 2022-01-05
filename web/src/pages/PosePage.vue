<template lang="pug">
Title Pose

VideoClipPlayer(v-slot="{ video, streaming }")

  EntityPanel(title="First Panel" :position="[0, 0, 0]" :scale="1" v-slot="{ hover, position, scale }")
    Tile1Material(:repeat="[1, 1]" v-slot="{ material }")
      TilePlane(:position="position" :dimensions="[2, 2]" :scale="scale" :material="material" v-slot="{ mesh, dimensions }")
        MeshOutline(v-if="hover" :mesh="mesh" :position="position" :scale="scale" :dimensions="dimensions")
    UsePose(:video="video" :streaming="streaming" v-slot="{ keypoints, normalized }")
      StickmanPose(:keypoints="keypoints.length > 0 ? keypoints : PoseKeypoints" :position="position" :scale="scale" :normalized="normalized")

</template>

<script lang="ts" setup>
import VideoClipPlayer from "~/components/depth/VideoClipPlayer.vue"
import PoseKeypoints from "~/3d/pose.json"

</script>
