<template lang="pug">
//- pre.text-white {{q.w}} {{pos}}
//- SimpleBox

slot(:position="position" :rotation="rotation")
</template>

<script lang="ts" setup>
import { Quaternion } from "three/src/math/Quaternion"
import { Vector3 } from "three/src/math/Vector3"
import { useFace } from "@depth/poser"
import useFaceRotation from "~/composables/useFaceRotation"
// const landmarks = ref<LandmarkList>()

const props = defineProps<{
  video: HTMLVideoElement
  streaming: boolean
}>()


const position = ref<PositionTuple>([0, 0, 0])
const rotation = ref<RotationTuple>([0, 0, 0, 1])

const q = ref<Quaternion>(new Quaternion())
const pos = ref(new Vector3())

const face = useFace({
  video: props.video,
  streaming: toRef(props, "streaming"),
  throttle: 200,
  handler: result => {
    // lathe.setRotationFromQuaternion(q.value)
    // set(landmarks, result.multiFaceLandmarks[0])
    // console.log(result)
    // console.log(useFaceRotation(result.multiFaceLandmarks[0]))

    const lm = result.multiFaceLandmarks[0]

    if (!lm || !lm[454] || !lm[234] || !lm[10] || !lm[152] || !lm[173]) return

    const vh1 = new Vector3(lm[454].x, lm[454].y, lm[454].z)
    const vh2 = new Vector3(lm[234].x, lm[234].y, lm[234].z)
    const vv1 = new Vector3(lm[10].x, lm[10].y, lm[10].z)
    const vv2 = new Vector3(lm[152].x, lm[152].y, lm[152].z)

    const vh1o = new Vector3(1, 0, 0)
    const vv1o = new Vector3(0, 1, 0)

    const vh2o = vh2.clone().sub(vh1.clone()).normalize()
    const vv2o = vv2.clone().sub(vv1.clone()).normalize()

    q.value = rotateVectorsSimultaneously(vh1o, vv1o, vh2o, vv2o)
    rotation.value = [q.value.x, q.value.y, q.value.z, q.value.w]

    pos.value.set(lm[173].x, lm[173].y, lm[173].z)

    position.value = [pos.value.x, pos.value.y, pos.value.z]
  },
})

function rotateVectorsSimultaneously(u0: Vector3, v0: Vector3, u2: Vector3, v2: Vector3) {
  // https://stackoverflow.com/a/55248720/1398275
  const q2 = new Quaternion().setFromUnitVectors(u0, u2)
  const v1 = v2.clone().applyQuaternion(q2.clone().conjugate())

  const v0_proj = v0.projectOnPlane(u0)
  const v1_proj = v1.projectOnPlane(u0)

  let angleInPlane = v0_proj.angleTo(v1_proj)
  if (v1_proj.dot(new Vector3().crossVectors(u0, v0)) < 0) {
    angleInPlane *= -1
  }
  const q1 = new Quaternion().setFromAxisAngle(u0, angleInPlane)
  const q = new Quaternion().multiplyQuaternions(q2, q1)

  return q
}
</script>
