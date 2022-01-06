<template lang="pug">
Title
  template(v-if="hasUuid") Your UUID: {{uuid}}
  template(v-else) Meta

ValidateHappiness(v-if="!hasUuid" v-slot="{ uuid }")
  p Are you happy to keep Your generated ID in local your storage?
  p This is required for connect and meta.
  p
  p {{uuid}}
</template>

<script lang="ts" setup>
import { storeToRefs } from "pinia"
import { useWebSocket } from "@vueuse/core"
import { usePlayerStore } from "~/stores/player"
import ValidateHappiness from "~/components/meta/ValidateHappiness"
import { useEnvironmentStore } from "~/stores/environment"

const toast = useToast()
const playerStore = usePlayerStore()

const { uuid } = storeToRefs(playerStore)
const hasUuid = computed(() => !!uuid.value)

useEnvironmentStore().$patch({
  skybox: 3,
  distance: 100,
  color: 0x001300,
  size: 1,
} as any)

// import VideoClipPlayer from "~/components/depth/VideoClipPlayer.vue"
// import WebcamPlayer from "~/components/depth/WebcamPlayer.vue"
// import { usePermission } from "@vueuse/core"

// const camera = usePermission("camera")
// const state = reactive({
//   input: "" as "" | "camera" | "clip",
//   selfie: true,
//   detect: "face" as "pose" | "face",
// })

// const stop = watch(camera, permission => {
//   state.input = permission === "granted" ? "camera" : "clip"
//   stop()
// })

// const inputComponent = computed(() => (state.input === "camera" ? WebcamPlayer : VideoClipPlayer))
// const detectPose = computed(() => state.detect === "pose")
// const detectFace = computed(() => state.detect === "face")
// const selfie = toRef(state, "selfie")

// addGuiFolder(folder => {
//   folder.name = "☺ Page Settings"
//   folder.add(state, "input", ["camera", "clip"])
//   folder.add(state, "selfie")
//   folder.add(state, "detect", ["pose", "face"])
// })
</script>
