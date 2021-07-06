<template></template>

<script lang="ts" setup>
import type { Results, LandmarkList } from "../../../public/pose/index.d"
import type { PropType, WatchStopHandle } from "vue"
import { watch, toRefs, inject, onBeforeUnmount, onMounted } from "vue"
import { Vector3, Group } from "three"

import {
  lineFactory,
  keypointFactory,
  whiteMaterial,
  redMaterial,
  boneMaterial,
  badBoneMaterial,
} from "../../models/factories"
import { isInRect, scaleKeypoint } from "../../misc/utils"
import { get } from "@vueuse/core"
import { BLAZEPOSE_CONNECTED_KEYPOINTS_PAIRS, BLAZEPOSE_KEYPOINTS } from "../../misc/constants"

// const landmarkLength = 33

const props = defineProps({
  results: { type: Object as PropType<Results>, required: true },
  position: { type: Object as PropType<THREE.Vector3Tuple>, default: [0, 0, 0] },
  // landmarks: { type: Object as PropType<LandmarkList>, required: true },
  keypointLimit: { type: Number, default: 33 },
  // videoWidth: { type: Number, required: true },
  // videoHeight: { type: Number, required: true },
  width: { type: Number, required: true },
  // scale: { type: Number, required: true },
  zMulti: { type: Number, required: true },
})

// const pose = props.pose
const results = props.results
// const { landmarks, videoWidth, videoHeight, scale, width, zMulti, keypointLimit } = toRefs(props)
const { width, zMulti, keypointLimit } = toRefs(props)
const isVisible = (i: number, j?: number) => i < get(keypointLimit) && (j === undefined || j < get(keypointLimit))

const root = inject<Group>("root")!
root.position.fromArray(props.position)

const stickmanGroup = new Group()

const joints = Array.from<number, KeypointMesh>({ length: 33 }, i => keypointFactory(BLAZEPOSE_KEYPOINTS[i], isVisible(i)))
const lines = new Map<string, THREE.Line>()

const lineKey = (i: number, j: number) => `${i}-${j}`

stickmanGroup.add(
  ...joints,
  ...BLAZEPOSE_CONNECTED_KEYPOINTS_PAIRS.map(([i, j]) => {
    const key = lineKey(i, j)
    const line = lineFactory(key, isVisible(i, j))
    lines.set(key, line)
    return line
  })
)

const updateJoints = (points: LandmarkList) => {
  points.forEach((point, index) => {
    joints[index].position.set(point.x * get(width), point.y * get(width), point.z * get(width))
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
    // line.material =
    //   isKeypointApperaing(keypoints[i]) && isKeypointApperaing(keypoints[j])
    //     ? boneMaterial
    //     : badBoneMaterial
    // line.geometry.setFromPoints(lineEnds)
    // line.geometry.computeBoundingSphere()
  })
}

let stopWatch: WatchStopHandle

onMounted(() => {
  root.add(stickmanGroup)

  stopWatch = watch(() => results.poseWorldLandmarks, marks => {
    updateJoints(marks)
    updateLines(marks)
  })
})

onBeforeUnmount(() => {
  stopWatch()
  root.remove(stickmanGroup)
  lines.forEach(line => line.geometry.dispose())
})
</script>
