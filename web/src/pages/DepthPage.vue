<template lang="pug">
Title Depth

WebcamPlayer(v-slot="{ video, streaming }")
  FaceRotation(:video="video" :streaming="streaming" :throttle="state.throttle" :lerp="state.lerp" v-slot="{ position, rotation }")
    Debug
      //- div deg y {{degY(...rotation)}}
      div position {{position}}
      div rotation {{rotation}}

    ParallaxCamera(:rotation="rotation")

    //- SimpleBox(:position="[0, 0.5, -1]" :rotation="rotation" :color="0x00ff00" v-slot="{ mesh: mesh1 }")
      SimpleBox(:parent="mesh1" :position="[0, 0.5, 2]" :size="[0.5, 0.2, 5]" :color="0xff0000" v-slot="{ mesh: mesh2 }")
        SimpleBox(:parent="mesh2" :position="[0, 0.5, 2]" :color="0x0000ff" v-slot="{ mesh: mesh3 }")
          //- PlayerCamera(:parent="mesh3")
    //- PlayerCamera(:position="position" :rotation="rotation")

GradientPyramid(:position="[0, 3.5, -5]" :rotation="[1, 0, 0, 0]" :levels="5")

ViewportView(:camera="cc.camera")
</template>

<script lang="ts" setup>
import { useCameraControls } from "@depth/controller"
import GradientPyramid from "~/components/3d/GradientPyramid.vue"
import WebcamPlayer from "~/components/depth/WebcamPlayer.vue"
import FaceRotation from "~/components/depth/FaceRotation.vue"
import ViewportView from "~/components/depth/ViewportView.vue"
import ParallaxCamera from "~/components/depth/ParallaxCamera.vue"

const state = reactive({
  throttle: 100,
  lerp: true,
})

addGuiFolder(folder => {
  folder.name = "💆 Face rotation"
  folder.add(state, "throttle", 0, 1000, 50)
  folder.add(state, "lerp")
})

// usePage()
const cc = useCameraControls()
// cc.setOrbitPoint(0, 5, 1)
// cc.setPosition(0, 5, 2, false)
// cc.fitToBox(new Box3(new Vector3(-3, 6, 0), new Vector3(3, 0, 0)), true)
// cc.dollyTo(8, false)

// const degY = (...q: RotationTuple) => {
//   const euler = new Euler().setFromQuaternion(new Quaternion(...q))
//   return radToDeg(euler.y) % 360
// }

const rot = ref()
</script>
