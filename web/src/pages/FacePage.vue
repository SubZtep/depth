<template lang="pug">
Title Face

WebcamPlayer(v-slot="{ video, streaming }")
  FaceMesh(:video="video" :streaming="streaming")
  //- div {{video}} {{streaming}}

//- WebcamPlayer(v-slot="{ video, streaming }")
//- VideoPlayer(:src="state.src" :key="state.src || 'none'" :play="state.showVideo" v-visible="state.showVideo")
</template>

<script lang="ts" setup>
import WebcamPlayer from "~/components/depth/WebcamPlayer.vue"
import FaceMesh from "~/components/3d/FaceMesh.vue"
// const state = reactive({
//   src: "",
//   showVideo: true,
// })

// addGuiFolder(folder => {
//   folder.name = "Video Page"
//   folder.add(state, "src", ["", "/videos/yoga2.webm", "/videos/extended_leg_pistol_squats.webm"]).name("Source")
// })
</script>
