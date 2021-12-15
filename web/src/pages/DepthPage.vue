<template lang="pug">
Title Depth

WebcamPlayer(v-slot="{ video, streaming }")
  FaceRotation(:video="video" :streaming="streaming" v-slot="{ position, rotation }")
    //- pre.absolute.top-0.text-white {{degtest(...rotation)}}
    SimpleBox(:position="[0, 0, 0]" :rotation="rotation")
    PlayerCamera(:position="position" :rotation="rotation")
</template>

<script lang="ts" setup>
import SimpleBox from "~/components/depth/SimpleBox.vue"
import WebcamPlayer from "~/components/depth/WebcamPlayer.vue"
import FaceRotation from "~/components/depth/FaceRotation.vue"
import PlayerCamera from "~/components/depth/PlayerCamera.vue"
import { useCameraControls } from "@depth/controller"
import { Euler } from "three/src/math/Euler"
import { radToDeg } from "three/src/math/MathUtils"
import { Quaternion } from "three/src/math/Quaternion"

const degtest = (...q: RotationTuple) => {
  const euler = new Euler().setFromQuaternion(new Quaternion(...q))
  return radToDeg(euler.y) % 360
}
</script>
