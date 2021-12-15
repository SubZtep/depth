<template lang="pug">
Title Depth

WebcamPlayer(v-slot="{ video, streaming }")
  FaceRotation(:video="video" :streaming="streaming" v-slot="{ position, rotation }")
    //- pre.absolute.top-0.text-white {{position}} {{rotation}}
    SimpleBox(:position="[0, 0, 0]" :rotation="rotation")
    //- SimpleBox(:position="position" :rotation="rotation")
    PlayerCamera(:position="position" :rotation="rotation")

</template>

<script lang="ts" setup>
import SimpleBox from "~/components/depth/SimpleBox.vue"
import WebcamPlayer from "~/components/depth/WebcamPlayer.vue"
import FaceRotation from "~/components/depth/FaceRotation.vue"
import PlayerCamera from "~/components/depth/PlayerCamera.vue"

</script>
