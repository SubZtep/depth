<template lang="pug">
</template>

<script lang="ts" setup>
import type { Results, LandmarkList } from "../../../public/pose/index.d"
import type { PropType, WatchStopHandle } from "vue"
import { watch, toRefs, inject, onBeforeUnmount, onMounted } from "vue"
import { Vector3, Group } from "three"
import { get } from "@vueuse/core"
import { lineFactory, keypointFactory, boneMaterial } from "../../models/factories"
import { BLAZEPOSE_CONNECTED_KEYPOINTS_PAIRS, BLAZEPOSE_KEYPOINTS } from "../../misc/constants"

const props = defineProps({
  results: { type: Object as PropType<Results>, required: true },
  position: { type: Object as PropType<THREE.Vector3Tuple>, required: true },
  // position: { type: Object as PropType<THREE.Vector3Tuple>, default: () => [0, 0, 0] },
  keypointLimit: { type: Number, default: 33 },
  width: { type: Number, required: true },
  zMulti: { type: Number, required: true },
  playing: { type: Boolean, required: true },
})

// eslint-disable-next-line vue/no-setup-props-destructure
const results = props.results
const { playing, width, zMulti, keypointLimit } = toRefs(props)
const isVisible = (i: number, j?: number) => i < get(keypointLimit) && (j === undefined || j < get(keypointLimit))

const root = inject<Group>("root")!
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
    const line = lineFactory(key, isVisible(i, j))
    lines.set(key, line)
    return line
  })
)

const updateJoints = (points: LandmarkList) => {
  points.forEach((point, index) => {
    joints.get(index)!.position.set(point.x * get(width), point.y * get(width), point.z * get(width))
  })
}

const updateLines = (points: LandmarkList) => {
  const lineEnds = new Array(2)
  BLAZEPOSE_CONNECTED_KEYPOINTS_PAIRS.forEach(([i, j]) => {
    const line = lines.get(lineKey(i, j))!

    lineEnds[0] = new Vector3(points[i].x * get(width), points[i].y * get(width), points[i].z * get(width))
    lineEnds[1] = new Vector3(points[j].x * get(width), points[j].y * get(width), points[j].z * get(width))

    line.geometry.setFromPoints(lineEnds)
    line.material = boneMaterial
  })
}

let stopWatch: WatchStopHandle

onMounted(() => {
  root.add(stickmanGroup)

  stopWatch = watch(
    () => results.poseWorldLandmarks,
    marks => {
      if (marks !== undefined) {
        updateJoints(marks)
        updateLines(marks)
      }
    }
  )
})

onBeforeUnmount(() => {
  stopWatch()
  root.remove(stickmanGroup)
  lines.forEach(line => line.geometry.dispose())
})
</script>
