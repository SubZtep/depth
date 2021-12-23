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

const state = reactive({
  throttle: 0,
  lerp: false,
})

addGuiFolder(folder => {
  folder.name = "☺ Face Page"
  folder.add(state, "throttle", 0, 1000, 50)
  folder.add(state, "lerp")
})
</script>
