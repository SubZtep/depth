<template lang="pug">
Title Depth

WebcamPlayer(v-slot="{ video, streaming }")
  FaceRotation(:video="video" :streaming="streaming" :throttle="state.throttle" :lerp="state.lerp" v-slot="{ position, rotation }")
    Debug
      div deg y {{degY(...rotation)}}
      div position {{position}}
      div rotation {{rotation}}
    SimpleBox(:position="[0, 0.5, 0]" :rotation="rotation" :color="0xffff00")
    PlayerCamera(:position="position" :rotation="rotation")

ViewportView
</template>

<script lang="ts" setup>
import SimpleBox from "~/components/3d/SimpleBox.vue"
import WebcamPlayer from "~/components/depth/WebcamPlayer.vue"
import FaceRotation from "~/components/depth/FaceRotation.vue"
import PlayerCamera from "~/components/depth/PlayerCamera.vue"
import { Euler } from "three/src/math/Euler"
import { radToDeg } from "three/src/math/MathUtils"
import { Quaternion } from "three/src/math/Quaternion"
import ViewportView from "~/components/depth/ViewportView.vue"

const state = reactive({
  throttle: 1000,
  lerp: true,
})

addGuiFolder(folder => {
  folder.name = "💆 Face rotation"
  folder.add(state, "throttle", 0, 1000, 50)
  folder.add(state, "lerp")
})

const degY = (...q: RotationTuple) => {
  const euler = new Euler().setFromQuaternion(new Quaternion(...q))
  return radToDeg(euler.y) % 360
}
</script>
