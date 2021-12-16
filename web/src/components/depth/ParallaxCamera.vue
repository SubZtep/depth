<template lang="pug">
</template>

<script lang="ts" setup>
import { useCameraControls } from "@depth/controller"
import { radToDeg, DEG2RAD } from "three/src/math/MathUtils"
import { Euler } from "three/src/math/Euler"
import { Quaternion } from "three/src/math/Quaternion"
import { Box3 } from "three/src/math/Box3"

const props = defineProps<{
  // rotation: Object as PropType<RotationTuple>,
  rotation: RotationTuple
}>()

const cc = useCameraControls()
cc.setOrbitPoint(0, 5, 1)
cc.setPosition(0, 5, 2, false)
cc.fitToBox(new Box3(new Vector3(-3, 6, 0), new Vector3(3, 0, 0)), true)
cc.dollyTo(8, false)

const euler = ref(new Euler())

watch(
  () => props.rotation,
  rotation => {
    euler.value.setFromQuaternion(new Quaternion().fromArray(props.rotation))
    const degY = radToDeg(euler.value.y) % 360
    cc.azimuthAngle = -degY * DEG2RAD

    const degZ = radToDeg(euler.value.z) % 360

    cc.camera.up = new Vector3(0, 0, degZ * DEG2RAD)
  }
)
</script>
