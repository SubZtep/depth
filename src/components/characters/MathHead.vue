<template lang="pug">
//- .debug {{BLAZEPOSE_KEYPOINTS.filter(headOnlyFilter).map(i => props.keypoints.value[i]).join(', ')}}
</template>

<script lang="ts" setup>
import type { PropType } from "vue"
import type { LandmarkList } from "../../../public/pose/index.d"
import { singleFns } from "../../packages/ThreeJS/useRenderLoop"
import { Vector3, Group } from "three"
import { lineFactory, keypointFactory, boneMaterial } from "../../models/factories"
import { BLAZEPOSE_CONNECTED_KEYPOINTS_PAIRS, BLAZEPOSE_KEYPOINTS } from "../../misc/constants"
import { get } from "@vueuse/core"

const props = defineProps({
  keypoints: { type: Object as PropType<Ref<LandmarkList>>, required: true },
  position: { type: Array as unknown as PropType<THREE.Vector3Tuple>, default: () => [0, 0, 0] },
  width: { type: Number, default: 1 },
  zMulti: { type: Number, default: 1 },
})

const root = new Group()
singleFns.add(({ scene }) => scene.add(root))

const lineKey = (i: number, j: number) => `${i}-${j}`
const joints = new Map<number, KeypointMesh>()
const lines = new Map<string, THREE.Line>()

root.add(
  ...BLAZEPOSE_KEYPOINTS
    .map((v, i) => {
    const joint = keypointFactory(v)
    joints.set(i, joint)
    return joint
  }),
  // ...BLAZEPOSE_CONNECTED_KEYPOINTS_PAIRS.map(([i, j]) => {
  //   const key = lineKey(i, j)
  //   const line = lineFactory(key)
  //   lines.set(key, line)
  //   return line
  // })
)

const updateJoints = (points: LandmarkList) => {
  points.forEach((point, index) => {
    const joint = joints.get(index)
    if (joint) {
      joint.position.set(point.x * props.width, point.y * props.width, point.z * props.width * props.zMulti)
    }
  })
}

watch(
  () => props.keypoints,
  marks => {
    if (marks) {
      updateJoints(get(marks))
    }
  }
)

// const lineEnds = [new Vector3(), new Vector3()]
// const updateLines = (points: LandmarkList) => {
//   BLAZEPOSE_CONNECTED_KEYPOINTS_PAIRS.forEach(([i, j]) => {
//     lineEnds[0].set(points[i].x * props.width, points[i].y * props.width, points[i].z * props.width * props.zMulti)
//     lineEnds[1].set(points[j].x * props.width, points[j].y * props.width, points[j].z * props.width * props.zMulti)

//     const line = lines.get(lineKey(i, j))!
//     line.geometry.setFromPoints(lineEnds)
//     line.material = boneMaterial
//   })
// }

onBeforeUnmount(() => {
  lines.forEach(line => line.geometry.dispose())
  singleFns.add(({ scene }) => scene.remove(root))
})
</script>
