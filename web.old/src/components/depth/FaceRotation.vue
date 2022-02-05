<template lang="pug">
//- pre.text-white {{q.w}} {{pos}}
slot(:position="position" :rotation="rotation")
</template>

<script lang="ts" setup>
import { useFace } from "@depth/poser"
import { loop3D } from "@depth/canvas"

const props = defineProps<{
  video: HTMLVideoElement
  streaming: boolean
  throttle: number
  lerp: boolean
}>()

const { throttle = ref(0), lerp = ref(false) } = toRefs(props)

const position = ref<PositionTuple>([0, 0, 0])
const rotation = ref<RotationTuple>([0, 0, 0, 1])

let q1 = new THREE.Quaternion()
let q2 = new THREE.Quaternion()
let p1 = new THREE.Vector3()
const p2 = new THREE.Vector3()
const streaming = toRef(props, "streaming")

useFace({
  video: props.video,
  streaming,
  throttle,
  handler: result => {
    const lm = result.multiFaceLandmarks[0]

    if (!lm || !lm[454] || !lm[234] || !lm[10] || !lm[152] || !lm[173]) return

    const vh1 = new THREE.Vector3(lm[454].x, lm[454].y, lm[454].z)
    const vh2 = new THREE.Vector3(lm[234].x, lm[234].y, lm[234].z)
    const vv1 = new THREE.Vector3(lm[10].x, lm[10].y, lm[10].z)
    const vv2 = new THREE.Vector3(lm[152].x, lm[152].y, lm[152].z)

    const vh1o = new THREE.Vector3(1, 0, 0)
    const vv1o = new THREE.Vector3(0, 1, 0)

    const vh2o = vh2.clone().sub(vh1.clone()).normalize()
    const vv2o = vv2.clone().sub(vv1.clone()).normalize()

    p1 = p2.clone()
    position.value = [p1.x, p1.y, p1.z]
    p2.set(lm[173].x, lm[173].y, lm[173].z)

    q1 = q2.clone()
    rotation.value = [q1.x, q1.y, q1.z, q1.w]
    q2 = rotateVectorsSimultaneously(vh1o, vv1o, vh2o, vv2o)

    if (!get(throttle) || !get(lerp)) {
      rotation.value = [q2.x, q2.y, q2.z, q2.w]
      position.value = [p2.x, p2.y, p2.z]
    }
  },
})

let p0 = 0
let diff = 0
let stop: Fn
let t: number

watch(and(throttle, lerp, streaming), on => {
  if (!on) return stop?.()

  stop = loop3D(({ deltaTime }) => {
    diff = performance.now() - p0
    if (diff > get(throttle)!) p0 = performance.now()

    // FIXME: t seems buggy
    // t = Math.min(+(diff / props.throttle!).toFixed(2), 1) + deltaTime
    t = Math.min(+(diff / props.throttle!).toFixed(2), 1)

    p1.lerp(p2, t)
    position.value = [p1.x, p1.y, p1.z]
    q1.slerp(q2, t)
    rotation.value = [q1.x, q1.y, q1.z, q1.w]
  })
})
</script>

<script lang="ts">
function rotateVectorsSimultaneously(u0: Vector3, v0: Vector3, u2: Vector3, v2: Vector3) {
  // https://stackoverflow.com/a/55248720/1398275
  const q2 = new THREE.Quaternion().setFromUnitVectors(u0, u2)
  const v1 = v2.clone().applyQuaternion(q2.clone().conjugate())

  const v0_proj = v0.projectOnPlane(u0)
  const v1_proj = v1.projectOnPlane(u0)

  let angleInPlane = v0_proj.angleTo(v1_proj)
  if (v1_proj.dot(new THREE.Vector3().crossVectors(u0, v0)) < 0) {
    angleInPlane *= -1
  }
  const q1 = new THREE.Quaternion().setFromAxisAngle(u0, angleInPlane)
  const q = new THREE.Quaternion().multiplyQuaternions(q2, q1)

  return q
}
</script>
