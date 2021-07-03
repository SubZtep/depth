<template></template>

<script lang="ts" setup>
import type { PropType } from "vue"
import type { Pose, Keypoint } from "@tensorflow-models/pose-detection"
import { watch, toRefs, inject, onBeforeUnmount, onMounted } from "vue"
import { Vector3 } from "three"
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
  videoWidth: { type: Number, required: true },
  videoHeight: { type: Number, required: true },
  scale: { type: Number, required: true },
  zMulti: { type: Number, required: true },
})

const pose = props.pose
const { videoWidth, videoHeight, scale, zMulti } = toRefs(props)

const root = inject<THREE.Group>("root")!
const joints = new Map<string, KeypointMesh>()
const lines = new Map<string, THREE.Line>()

const initJoints = () => {
  root.add(
    ...BLAZEPOSE_KEYPOINTS.map(name => {
      const joint = keypointFactory(name)
      joints.set(name, joint)
      return joint
    })
  )
}

const initLines = () => {
  root.add(
    ...BLAZEPOSE_CONNECTED_KEYPOINTS_PAIRS.map(([i, j]) => {
      const key = `${i}-${j}`
      const line = lineFactory(key)
      lines.set(key, line)
      return line
    })
  )
}

const updateJoints = (keypoints: Keypoint[]) => {
  keypoints.forEach(kp => {
    const joint = joints.get(kp.name!)!
    joint.material = isInRect(get(videoWidth), get(videoHeight), kp.x, kp.y) ? whiteMaterial : redMaterial
    joint.position.fromArray(scaleKeypoint(get(videoWidth), get(videoHeight), get(scale), get(zMulti), kp))
  })
}

const updateLines = (keypoints: Keypoint[]) => {
  const points = new Array(2)
  const scaleKp = (kp: Keypoint) => scaleKeypoint(get(videoWidth), get(videoHeight), get(scale), get(zMulti), kp)
  const inRect = (x: number, y: number) => isInRect(get(videoWidth), get(videoHeight), x, y)
  BLAZEPOSE_CONNECTED_KEYPOINTS_PAIRS.forEach(([i, j]) => {
    points[0] = new Vector3(...scaleKp(keypoints[i]))
    points[1] = new Vector3(...scaleKp(keypoints[j]))
    const line = lines.get(`${i}-${j}`)!
    line.geometry.setFromPoints(points)
    line.material =
      inRect(keypoints[i].x, keypoints[i].y) && inRect(keypoints[j].x, keypoints[j].y) ? boneMaterial : badBoneMaterial
    lines.get(`${i}-${j}`)!.geometry.setFromPoints(points)
  })
}

onMounted(() => {
  initJoints()
  initLines()

  watch(pose, ({ keypoints }) => {
    // console.log("KP 💀", keypoints)
    updateJoints(keypoints)
    updateLines(keypoints)
  })
})

onBeforeUnmount(() => {
  lines.forEach(line => line.geometry.dispose())
})
</script>
