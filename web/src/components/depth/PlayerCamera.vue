<template lang="pug">
pre.text-white.absolute.top-0 {{props.rotation}} {{hdeg}} {{vdeg}}
</template>

<script lang="ts" setup>
import { useCameraControls } from "@depth/controller"
import { Euler } from "three/src/math/Euler"
import { Quaternion } from "three/src/math/Quaternion"
import { watchEffect } from "vue"
import { radToDeg } from "three/src/math/MathUtils"
import { Object3D } from "three/src/core/Object3D"
import { useScene } from "@depth/canvas"

const props = defineProps<{
  position: PositionTuple
  rotation: RotationTuple
}>()

// const cc = useCameraControls()

// const EPS = 1e-5
// in order to archive FPS look, set EPSILON for the distance to the center
// cc.camera.position.set(0, 0, EPS)
// cc.minDistance = cc.maxDistance = 1
// cc.azimuthRotateSpeed = -0.3 // negative value to invert rotation direction
// cc.polarRotateSpeed = -0.3 // negative value to invert rotation direction
// cc.truckSpeed = 10

const cc = useCameraControls()
cc.setPosition(0, 2, -5, false)
const camera = cc.camera
cc.dispose()

const o1 = new Object3D()
o1.add(camera)
useScene().add(o1)

const euler = ref(new Euler())
const hdeg = computed(() => radToDeg(euler.value.y) % 360)
const vdeg = computed(() => radToDeg(euler.value.x) % 360)

watchEffect(() => {
  const q = new Quaternion().fromArray(props.rotation)
  euler.value.setFromQuaternion(q)

  o1.quaternion.set(...props.rotation)
})
</script>
