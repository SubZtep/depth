<template lang="pug">
</template>

<script lang="ts" setup>
import type { PropType } from "vue"
import type { LandmarkList } from "../../../public/pose/index.d"
import { singleFns } from "../../packages/ThreeJS/useRenderLoop"
import { watch, onBeforeUnmount, onMounted } from "vue"
import { Vector3, Group } from "three"
import { lineFactory, keypointFactory, boneMaterial } from "../../models/factories"
import { BLAZEPOSE_CONNECTED_KEYPOINTS_PAIRS, BLAZEPOSE_KEYPOINTS } from "../../misc/constants"

const props = defineProps({
  keypoints: { type: Object as PropType<Keypoint[]>, required: false },
  position: { type: Array as unknown as PropType<THREE.Vector3Tuple>, default: () => [0, 0, 0] },
  width: { type: Number, default: 1 },
  zMulti: { type: Number, default: 1 },
})

const root = new Group()
singleFns.add(({ scene }) => scene.add(root))

const stickmanGroup = new Group()
stickmanGroup.position.fromArray(props.position)

const lineKey = (i: number, j: number) => `${i}-${j}`
const joints = new Map<number, KeypointMesh>()
const lines = new Map<string, THREE.Line>()

stickmanGroup.add(
  ...BLAZEPOSE_KEYPOINTS.map((v, i) => {
    const joint = keypointFactory(v)
    joints.set(i, joint)
    return joint
  }),
  ...BLAZEPOSE_CONNECTED_KEYPOINTS_PAIRS.map(([i, j]) => {
    const key = lineKey(i, j)
    const line = lineFactory(key)
    lines.set(key, line)
    return line
  })
)

const updateJoints = (points: LandmarkList) => {
  points.forEach((point, index) => {
    joints.get(index)!.position.set(point.x * props.width, point.y * props.width, point.z * props.width * props.zMulti)
  })
}

const lineEnds = [new Vector3(), new Vector3()]
const updateLines = (points: LandmarkList) => {
  BLAZEPOSE_CONNECTED_KEYPOINTS_PAIRS.forEach(([i, j]) => {
    lineEnds[0].set(points[i].x * props.width, points[i].y * props.width, points[i].z * props.width * props.zMulti)
    lineEnds[1].set(points[j].x * props.width, points[j].y * props.width, points[j].z * props.width * props.zMulti)

    const line = lines.get(lineKey(i, j))!
    line.geometry.setFromPoints(lineEnds)
    line.material = boneMaterial
  })
}

onMounted(() => {
  root.add(stickmanGroup)

  watch(
    () => props.keypoints,
    marks => {
      if (marks !== undefined) {
        updateJoints(marks)
        updateLines(marks)
      } else {
        console.warn("Stickman is hidden booo")
      }
    }
  )
})

onBeforeUnmount(() => {
  lines.forEach(line => line.geometry.dispose())
  singleFns.add(({ scene }) => scene.remove(root))
})
</script>
