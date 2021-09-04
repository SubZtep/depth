<template lang="pug">
//- .debug {{BLAZEPOSE_KEYPOINTS.filter(headOnlyFilter).map(i => props.keypoints.value[i]).join(', ')}}
</template>

<script lang="ts" setup>
import type { PropType } from "vue"
import type { Landmark, LandmarkList } from "../../../public/pose/index.d"
import { singleFns } from "../../packages/ThreeJS/useRenderLoop"
import { Vector3, Group } from "three"
import { lineFactory, keypointFactory, boneMaterial } from "../../models/factories"
import { BLAZEPOSE_HEAD_CONNECTED_KEYPOINTS_PAIRS, BLAZEPOSE_HEAD_KEYPOINTS } from "../../misc/constants"
import { normaliseKeypointToDisplay } from "../../misc/utils"
import { get } from "@vueuse/core"
import { headPart } from "../../models/avatar"

const props = defineProps({
  keypoints: { type: Object as PropType<Ref<LandmarkList>>, required: true },
  // position: { type: Array as unknown as PropType<THREE.Vector3Tuple>, default: () => [0, 0, 0] },
  positionY: { type: Number, default: 0 },
  scale: { type: Number, default: 1 },
  zMulti: { type: Number, default: 1 },
  rotationY: { type: Number, default: 0 },
})

const root = new Group()
singleFns.add(({ scene }) => scene.add(root))

watchEffect(() => {
  root.position.setY(get(props, "positionY"))
  root.rotation.y = get(props, "rotationY")
})

const lineKey = (i: number, j: number) => `${i}-${j}`
const joints = new Map<number, KeypointMesh>()
const lines = new Map<string, THREE.Line>()
const lineEnds = [new Vector3(), new Vector3()]

root.add(
  ...BLAZEPOSE_HEAD_KEYPOINTS.map((v, i) => {
    const joint = headPart(v)
    joints.set(i, joint)
    return joint
  }),
  ...BLAZEPOSE_HEAD_CONNECTED_KEYPOINTS_PAIRS.map(([i, j]) => {
    const key = lineKey(i, j)
    const line = lineFactory(key)
    lines.set(key, line)
    return line
  })
)

const hat = headPart("hat")
joints.get(BLAZEPOSE_HEAD_KEYPOINTS.indexOf("nose"))!.add(hat)
hat.position.set(0, 1.3, 2)
hat.rotateX(Math.PI * 1.5)

const updateJointsPositions = (points: LandmarkList) => {
  points.forEach((point, index) => joints.get(index)?.position.set(...normaliseKeypointToDisplay(point, props.scale, props.zMulti)))
}

const updateLines = (points: LandmarkList) => {
  BLAZEPOSE_HEAD_CONNECTED_KEYPOINTS_PAIRS.forEach(([i, j]) => {
    lineEnds[0].set(...normaliseKeypointToDisplay(points[i], props.scale, props.zMulti))
    lineEnds[1].set(...normaliseKeypointToDisplay(points[j], props.scale, props.zMulti))

    const line = lines.get(lineKey(i, j))!
    line.geometry.setFromPoints(lineEnds)
    line.material = boneMaterial
  })
}

watch(
  () => props.keypoints,
  marks => {
    if (marks) {
      updateJointsPositions(get(marks))
      updateLines(get(marks))
    }
  }
)

onBeforeUnmount(() => {
  lines.forEach(line => line.geometry.dispose())
  singleFns.add(({ scene }) => scene.remove(root))
})
</script>
