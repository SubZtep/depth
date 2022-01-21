<template lang="pug">
//- Debug hdeg: {{hdeg}}#[br]vdeg: {{vdeg}}
</template>

<script lang="ts" setup>
import { exec3D, useScene } from "@depth/canvas"

const props = defineProps<{
  parent: THREE.Object3D
  //   position: PositionTuple
  //   rotation: RotationTuple
}>()

// const cc = useCameraControls()
// const camera = cc.camera
// cc.enabled = false
// cc.dispose()

// if (props.parent) {
//   // props.parent.add(camera)
//   // exec3D({ ca})
//   //
// }

// const cc = useCameraControls()
// // useFpsControls(cc)
// cc.setPosition(0, 2, -5, false)
// const camera = cc.camera
// // cc.dispose()

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
