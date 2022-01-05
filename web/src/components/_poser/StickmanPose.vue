<template lang="pug">
ParaPanel(title="Stickman")
  div Stick color
  InputColor(v-model="state.color")

slot(:color="state.color")
</template>

<script lang="ts" setup>
import { useScene } from "@depth/canvas"
import { Vector3 } from "three"
import { BufferGeometry } from "three/src/core/BufferGeometry"
import { SphereGeometry } from "three/src/geometries/SphereGeometry"
import { LineBasicMaterial } from "three/src/materials/LineBasicMaterial"
import { MeshPhongMaterial } from "three/src/materials/MeshPhongMaterial"
import { Group } from "three/src/objects/Group"
import { Line } from "three/src/objects/Line"
import { Mesh } from "three/src/objects/Mesh"

type Keypoint = { x: number; y: number; z: number }

const props = defineProps<{
  // TODO: make it better
  normalized: boolean
  scale: number
  position: [number, number, number]
  keypoints: Keypoint[]
  selfie: boolean
}>()

const scene = useScene()

const { normalized, scale, position, keypoints, selfie } = toRefs(props)

const BLAZEPOSE_CONNECTED_KEYPOINTS_PAIRS: [number, number][] = [
  [0, 1],
  [0, 4],
  [1, 2],
  [2, 3],
  [3, 7],
  [4, 5],
  [5, 6],
  [6, 8],
  [9, 10],
  [11, 12],
  [11, 13],
  [11, 23],
  [12, 14],
  [14, 16],
  [12, 24],
  [13, 15],
  [15, 17],
  [16, 18],
  [16, 20],
  [15, 17],
  [15, 19],
  [15, 21],
  [16, 22],
  [17, 19],
  [18, 20],
  [23, 25],
  [23, 24],
  [24, 26],
  [25, 27],
  [26, 28],
  [27, 29],
  [28, 30],
  [27, 31],
  [28, 32],
  [29, 31],
  [30, 32],
]

const state = reactive({
  color: "#e3dac9"
})

const sphereGeometry = new SphereGeometry(0.03, 8, 6)
const whiteMaterial = new MeshPhongMaterial({ color: 0x69ffff, flatShading: true })
const boneMaterial = new LineBasicMaterial({ color: 0xe3dac9 })

const root = new Group()
scene.add(root)
const joints: Mesh[] = []
const lines = new Map<string, Line>()

for (let i = 0; i < props.keypoints.length; i++) {
  const mesh = new Mesh(sphereGeometry, whiteMaterial)
  // mesh.receiveShadow = true
  mesh.castShadow = true
  joints.push(mesh)
  root.add(mesh)
}

for (const pairs of BLAZEPOSE_CONNECTED_KEYPOINTS_PAIRS) {
  const geometry = new BufferGeometry()
  const line = new Line(geometry, boneMaterial)
  line.frustumCulled = false
  lines.set(`${pairs[0]}-${pairs[1]}`, line)
  root.add(line)
}

const pKeypoint = ({ x, y, z }: Keypoint, normalized: boolean, selfie: boolean) => {
  if (normalized) {
    if (selfie) {
      x = 1 - x
    }
    y = 1 - y
  }
  return { x, y, z } as Vector3
}

watch(
  [keypoints, normalized, selfie],
  ([newKeypoints, newNormalized, newSelfie]) => {
    for (const [i, keypoint] of newKeypoints.entries()) {
      const kp = pKeypoint(keypoint, newNormalized, newSelfie)
      joints[i].position.set(kp.x, kp.y, kp.z)
    }

    for (const pairs of BLAZEPOSE_CONNECTED_KEYPOINTS_PAIRS) {
      lines
        .get(`${pairs[0]}-${pairs[1]}`)!
        .geometry.setFromPoints([
          pKeypoint(newKeypoints[pairs[0]], newNormalized, newSelfie),
          pKeypoint(newKeypoints[pairs[1]], newNormalized, newSelfie),
        ])
    }
  },
  { immediate: true, deep: true }
)

watch(
  [scale, position, normalized],
  ([newScale, newPosition, newNormalized]) => {
    root.scale.set(newScale, newScale, newScale)

    if (newNormalized) {
      const pos = [...newPosition] as [number, number, number]
      pos[0] -= newScale / 2
      root.position.set(...pos)
    } else {
      root.position.set(...newPosition)
    }
  },
  { immediate: true, deep: true }
)

watchEffect(() => {
  boneMaterial.color.set(state.color)
})

onScopeDispose(() => {
  scene.remove(root)
  for (const line of lines.values()) {
    line.geometry.dispose()
  }
  sphereGeometry.dispose()
  whiteMaterial.dispose()
  boneMaterial.dispose()
})
</script>
