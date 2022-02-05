<template lang="pug">
</template>

<script lang="ts" setup>
import { useCameraControls } from "@depth/controller"

const props = defineProps<{
  // rotation: Object as PropType<RotationTuple>,
  rotation: RotationTuple
}>()

const cc = useCameraControls()
cc.setOrbitPoint(0, 5, 1)
cc.setPosition(0, 5, 2, false)
cc.fitToBox(new THREE.Box3(new THREE.Vector3(-3, 6, 0), new THREE.Vector3(3, 0, 0)), true)
cc.dollyTo(8, false)

const euler = ref(new THREE.Euler())

watch(
  () => props.rotation,
  rotation => {
    euler.value.setFromQuaternion(new THREE.Quaternion().fromArray(props.rotation))
    const degY = THREE.MathUtils.radToDeg(euler.value.y) % 360
    cc.azimuthAngle = -degY * THREE.MathUtils.DEG2RAD

    const degZ = THREE.MathUtils.radToDeg(euler.value.z) % 360
    const degX = THREE.MathUtils.radToDeg(euler.value.x) % 360

    console.log({ degX, degY, degZ })

    // cc.camera.up = new Vector3(0, 0, degZ * DEG2RAD)
  }
)
</script>
