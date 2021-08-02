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
  ...BLAZEPOSE_HEAD_KEYPOINTS
    .map((v, i) => {
      const joint = headPart(v)
      joints.set(i, joint)
      return joint
    }),
  ...BLAZEPOSE_HEAD_CONNECTED_KEYPOINTS_PAIRS
    .map(([i, j]) => {
      const key = lineKey(i, j)
      const line = lineFactory(key)
      lines.set(key, line)
      return line
    })
)

const normPos = (point: Landmark, scale: number, zMulti: number): [number, number, number] => ([
  point.x * props.scale,
  point.y * props.scale,
  point.z * props.scale * props.zMulti])

const updateJointsPositions = (points: LandmarkList) => {
  points.forEach(
    (point, index) => joints.get(index)?.position.set(...normPos(point, props.scale, props.zMulti)))
}

const updateLines = (points: LandmarkList) => {
  BLAZEPOSE_HEAD_CONNECTED_KEYPOINTS_PAIRS.forEach(([i, j]) => {
    lineEnds[0].set(...normPos(points[i], props.scale, props.zMulti))
    lineEnds[1].set(...normPos(points[j], props.scale, props.zMulti))

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

const fejkemejke = [
  {
    "x": 0.4186739921569824,
    "y": 0.2512146830558777,
    "z": -0.7165566086769104,
    "visibility": 0.9990034699440002
  },
  {
    "x": 0.4546741843223572,
    "y": 0.3311470150947571,
    "z": -0.6706072092056274,
    "visibility": 0.998615562915802
  },
  {
    "x": 0.47620806097984314,
    "y": 0.33307623863220215,
    "z": -0.670041024684906,
    "visibility": 0.9989899396896362
  },
  {
    "x": 0.4952591359615326,
    "y": 0.33351898193359375,
    "z": -0.6705867648124695,
    "visibility": 0.9990525841712952
  },
  {
    "x": 0.39317941665649414,
    "y": 0.32763350009918213,
    "z": -0.6580232381820679,
    "visibility": 0.9983647465705872
  },
  {
    "x": 0.37364426255226135,
    "y": 0.3274235129356384,
    "z": -0.657486617565155,
    "visibility": 0.9961506128311157
  },
  {
    "x": 0.3606080710887909,
    "y": 0.3275452256202698,
    "z": -0.6603281497955322,
    "visibility": 0.9966702461242676
  },
  {
    "x": 0.5285687446594238,
    "y": 0.31924164295196533,
    "z": -0.3554363250732422,
    "visibility": 0.9943779110908508
  },
  {
    "x": 0.3512580990791321,
    "y": 0.3151811361312866,
    "z": -0.29328814148902893,
    "visibility": 0.9983478784561157
  },
  {
    "x": 0.4667991101741791,
    "y": 0.18646091222763062,
    "z": -0.5884379744529724,
    "visibility": 0.9983610510826111
  },
  {
    "x": 0.38416174054145813,
    "y": 0.18471986055374146,
    "z": -0.5711575746536255,
    "visibility": 0.9966296553611755
  }
]

updateJointsPositions(fejkemejke)
updateLines(fejkemejke)
</script>
