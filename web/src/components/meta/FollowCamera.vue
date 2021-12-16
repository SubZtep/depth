<template lang="pug">
</template>

<script lang="ts" setup>
import type { Object3D } from "three/src/core/Object3D"
import { onScopeDispose } from "vue"
import { useCameraControls } from "@depth/controller/src/helpers"

const props = defineProps<{
  parent?: Object3D
  follow?: Object3D
}>()

// const cc = useCameraControls()

// if (props.parent) {
//   cc.setTarget(props.parent.position.x, props.parent.position.y, props.parent.position.z, true)
//   cc.setPosition(0, 1, 10, true)
//   // cc.setTarget(...props.parent.position as PositionT, true)
//   // props.parent.add(cc.)
//   // props.parent.add(cc.camera)
//   // cc.camera.matrixAutoUpdate = true
// }

// onScopeDispose(() => {
//   if (props.parent) {
//     props.parent.remove(cc.camera)
//   }
// })
</script>
