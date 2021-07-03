<template></template>

<script lang="ts" setup>
import type { PropType } from "vue"
import type { Pose, Keypoint } from "@tensorflow-models/pose-detection"
import { watch, toRefs, inject, onBeforeUnmount, onMounted } from "vue"
import { Vector3, Group } from "three"
import {
  BLAZEPOSE_KEYPOINTS,
  BLAZEPOSE_CONNECTED_KEYPOINTS_PAIRS,
} from "@tensorflow-models/pose-detection/dist/constants.js"
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

const props = defineProps({
  pose: { type: Object as PropType<Pose>, required: true },
  keypointLimit: { type: Number, default: 33 },
  videoWidth: { type: Number, required: true },
  videoHeight: { type: Number, required: true },
  scale: { type: Number, required: true },
  zMulti: { type: Number, required: true },
})

const pose = props.pose
const { videoWidth, videoHeight, scale, zMulti, keypointLimit } = toRefs(props)

const root = inject<Group>("root")!
const stickmanGroup = new Group()
const joints = new Map<string, KeypointMesh>()
const lines = new Map<string, THREE.Line>()

const keypointToTuple = (kp: Keypoint): THREE.Vector3Tuple =>
  scaleKeypoint(get(videoWidth), get(videoHeight), get(scale), get(zMulti), kp)

const isKeypointApperaing = (kp: Keypoint): boolean => isInRect(get(videoWidth), get(videoHeight), kp.x, kp.y)

const lineKey = (i: number, j: number) => `${i}-${j}`

const isVisible = (i: number, j?: number) => i < get(keypointLimit) && (j === undefined || j < get(keypointLimit))

const initJoints = () => {
  stickmanGroup.add(
    ...BLAZEPOSE_KEYPOINTS.map((name, i) => {
      const joint = keypointFactory(name, isVisible(i))
      joints.set(name, joint)
      return joint
    })
  )
}

const initLines = () => {
  stickmanGroup.add(
    ...BLAZEPOSE_CONNECTED_KEYPOINTS_PAIRS.map(([i, j]) => {
      const key = lineKey(i, j)
      const line = lineFactory(key, isVisible(i, j))
      lines.set(key, line)
      return line
    })
  )
}

const updateJoints = (keypoints: Keypoint[]) => {
  keypoints.forEach(kp => {
    const joint = joints.get(kp.name!)!
    joint.visible = isVisible(BLAZEPOSE_KEYPOINTS.indexOf(kp.name!))
    if (joint.visible) {
      joint.material = isKeypointApperaing(kp) ? whiteMaterial : redMaterial
      joint.position.fromArray(keypointToTuple(kp))
    }
  })
}

const updateLines = (keypoints: Keypoint[]) => {
  const points = new Array(2)
  BLAZEPOSE_CONNECTED_KEYPOINTS_PAIRS.forEach(([i, j]) => {
    const line = lines.get(lineKey(i, j))!
    line.visible = isVisible(i, j)
    if (line.visible) {
      points[0] = new Vector3(...keypointToTuple(keypoints[i]))
      points[1] = new Vector3(...keypointToTuple(keypoints[j]))
      line.geometry.setFromPoints(points)
      line.material =
        isKeypointApperaing(keypoints[i]) && isKeypointApperaing(keypoints[j])
          ? boneMaterial
          : badBoneMaterial
      line.geometry.setFromPoints(points)
      // line.geometry.computeBoundingSphere()
    }
  })
}

onMounted(() => {
  initJoints()
  initLines()
  root.add(stickmanGroup)

  watch(pose, ({ keypoints }) => {
    // console.log("KP 💀", keypoints)
    updateJoints(keypoints)
    updateLines(keypoints)
  })
})

onBeforeUnmount(() => {
  root.remove(stickmanGroup)
  lines.forEach(line => line.geometry.dispose())
})
</script>
