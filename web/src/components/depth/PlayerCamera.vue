<template lang="pug">
//- Debug hdeg: {{hdeg}}#[br]vdeg: {{vdeg}}
</template>

<script lang="ts" setup>
import { useCameraControls, useFpsControls } from "@depth/controller"
import { Euler } from "three/src/math/Euler"
import { Quaternion } from "three/src/math/Quaternion"
import { radToDeg } from "three/src/math/MathUtils"
import { Object3D } from "three/src/core/Object3D"
import { useScene } from "@depth/canvas"
import { MathUtils } from "three/src/Three"

const props = defineProps<{
  position: PositionTuple
  rotation: RotationTuple
}>()

const cc = useCameraControls()
// useFpsControls(cc)
cc.setPosition(0, 2, -5, false)
const camera = cc.camera
// cc.dispose()

// const o1 = new Object3D()
// o1.add(camera)
// useScene().add(o1)

// const euler = ref(new Euler())
// const hdeg = computed(() => radToDeg(euler.value.y) % 360)
// const vdeg = computed(() => radToDeg(euler.value.x) % 360)

// watchEffect(() => {
//   const q = new Quaternion().fromArray(props.rotation)
//   euler.value.setFromQuaternion(q)

//   cc.azimuthAngle = -hdeg.value * MathUtils.DEG2RAD
// })
</script>
