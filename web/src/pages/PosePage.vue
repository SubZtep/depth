<template lang="pug">
Title Pose

WebSocketPoser

component(v-if="state.input" :is="inputComponent" :selfie="state.selfie" v-slot="{ video, streaming }")
  EntityPanel(title="First Panel" :position="[0, 0, 0]" :scale="1" v-slot="{ hover, position, scale }")
    Tile1Material(:repeat="[1, 1]" v-slot="{ material }")
      TilePlane(v-bind="{ position, scale, material }" :dimensions="[2, 2]" v-slot="{ mesh, dimensions }")
        MeshOutline(v-if="hover" v-bind="{ mesh, position, scale, dimensions }")
    UsePose(v-if="detectPose" v-bind="{ video, streaming, selfie }" v-slot="{ keypoints, normalized }")
      StickmanPose(v-bind="{ keypoints, position, scale, normalized, selfie }")
    UseFace(v-if="detectFace" v-bind="{ video, streaming }" v-slot="{ keypoints }")
      FaceMaterial(v-slot="{ material }")
        FaceMesh(v-bind="{ keypoints, position, scale, material, selfie }")

</template>

<script lang="ts" setup>
import VideoClipPlayer from "~/components/depth/VideoClipPlayer.vue"
import WebcamPlayer from "~/components/depth/WebcamPlayer.vue"
import { usePermission } from "@vueuse/core"

const camera = usePermission("camera")
const state = reactive({
  input: "" as "" | "camera" | "clip",
  selfie: true,
  detect: "face" as "pose" | "face",
})

const stop = watch(camera, permission => {
  state.input = permission === "granted" ? "camera" : "clip"
  stop()
})

const inputComponent = computed(() => (state.input === "camera" ? WebcamPlayer : VideoClipPlayer))
const detectPose = computed(() => state.detect === "pose")
const detectFace = computed(() => state.detect === "face")
const selfie = toRef(state, "selfie")

addGuiFolder(folder => {
  folder.name = "☺ Page Settings"
  folder.add(state, "input", ["camera", "clip"])
  folder.add(state, "selfie")
  folder.add(state, "detect", ["pose", "face"])
})
</script>
