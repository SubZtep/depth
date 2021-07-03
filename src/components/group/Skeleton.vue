<template></template>

<script lang="ts" setup>
import type { PropType } from "vue"
import { Bone, Skeleton, SkeletonHelper, Group } from "three"
import type { Pose, Keypoint } from "@tensorflow-models/pose-detection"
import { watch, toRefs, inject, onBeforeUnmount, onMounted } from "vue"
import {
  BLAZEPOSE_KEYPOINTS,
  BLAZEPOSE_CONNECTED_KEYPOINTS_PAIRS,
} from "@tensorflow-models/pose-detection/dist/constants.js"
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
const root = inject<Group>("root")!
const skeletonGroup = new Group()

const keypointToTuple = (kp: Keypoint): THREE.Vector3Tuple =>
  scaleKeypoint(get(videoWidth), get(videoHeight), get(scale), get(zMulti), kp)

const isKeypointApperaing = (kp: Keypoint): boolean => isInRect(get(videoWidth), get(videoHeight), kp.x, kp.y)


const bones = new Map<string, Bone>()
let skeleton: Skeleton

const init = () => {
  const limit = 12
  for (let i = 0; i < limit; i++) {
    const name = BLAZEPOSE_KEYPOINTS[i]
    const bone = new Bone()
    bone.name = name
    bones.set(name, bone)
  }

  BLAZEPOSE_CONNECTED_KEYPOINTS_PAIRS.filter(([i, j]) => i < limit && j < limit).forEach(([i, j]) => {
    bones.get(BLAZEPOSE_KEYPOINTS[i])!.add(bones.get(BLAZEPOSE_KEYPOINTS[j])!)
  })

  skeleton = new Skeleton(Array.from(bones.values()))
  const helper = new SkeletonHelper(bones.get(BLAZEPOSE_KEYPOINTS[0])!)
  skeletonGroup.add(helper)

  // skeleton = new Skeleton(Array.from(bones.values()))

  // const helper = new SkeletonHelper(bones.get(BLAZEPOSE_KEYPOINTS[0])!)
  // helper.bones = Array.from(bones.values())
  // // helper.root = root
  // // root.add(helper)
  // root.add(helper)
}

onMounted(() => {
  console.time("skeleton init")
  init()
  console.timeEnd("skeleton init")
  root.add(skeletonGroup)

  console.log(skeleton.bones)

  const scaleKp = (kp: Keypoint) => scaleKeypoint(get(videoWidth), get(videoHeight), get(scale), get(zMulti), kp)

  watch(pose, ({ keypoints }) => {
    keypoints.forEach(kp => {
      if (!bones.has(kp.name!)) return
      const bone = bones.get(kp.name!)!
      bone.position.fromArray(scaleKp(kp))
      bone.updateMatrixWorld()
    })
  })
  // invoke(async () => {
  //   await until(pose).changed()

  //   pose.keypoints.forEach(kp => {
  //     if (!bones.has(kp.name!)) return
  //     const bone = bones.get(kp.name!)!
  //     bone.position.fromArray(scaleKp(kp))
  //     bone.updateMatrixWorld()
  //   })

  //   skeleton = new Skeleton(Array.from(bones.values()))
  //   const helper = new SkeletonHelper(bones.get(BLAZEPOSE_KEYPOINTS[0])!)
  //   root.add(helper)
  // })
})

onBeforeUnmount(() => {
  root.remove(skeletonGroup)
  skeleton?.dispose()
})
</script>
