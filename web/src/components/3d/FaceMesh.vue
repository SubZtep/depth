<template lang="pug">
ParaPanel(title="Face Mesh" @hover="v => panelHovered = v")
  div Position
  InputXYZ(v-model="position" :min="-50" :max="50" :step="0.1")
  div Scale
  InputNumber(v-model.number="scale" :min="0" :max="100" :step="0.1")

slot(:mesh="mesh" :position="position" :scale="scale" :panel-hovered="panelHovered")
</template>

<script lang="ts" setup>
import { useScene } from "@depth/canvas"
import { TRIANGULATION } from "@depth/poser"
import { BufferAttribute } from "three/src/core/BufferAttribute"
import { BufferGeometry } from "three/src/core/BufferGeometry"
import { Mesh } from "three/src/objects/Mesh"
import { DoubleSide, DynamicDrawUsage } from "three/src/constants"
import { MeshLambertMaterial } from "three/src/materials/MeshLambertMaterial"
import { Material } from "three/src/materials/Material"

type Keypoint = { x: number; y: number; z: number }

const props = defineProps<{
  keypoints: Keypoint[]
  position?: [number, number, number]
  scale?: number
  material?: Material
}>()

const panelHovered = ref(false)

const position = ref(props.position ?? [0, 0, 0])
const scale = ref(props.scale ?? 1)

const scene = useScene()

const geometry = new BufferGeometry()

const material = props.material
  ? props.material
  : new MeshLambertMaterial({
      side: DoubleSide,
      color: 0xff0000,
    })

const vertices = new Float32Array(TRIANGULATION.length * 3)
const positionAttribute = new BufferAttribute(vertices, 3)
positionAttribute.setUsage(DynamicDrawUsage)
geometry.setAttribute("position", positionAttribute)

const mesh = new Mesh(geometry, material)
mesh.frustumCulled = false
scene.add(mesh)

const updateKeypoints = (newKeypoints: Keypoint[], newScale: number) => {
  for (let i = 0; i < TRIANGULATION.length; i += 3) {
    const p1 = newKeypoints[TRIANGULATION[i]]
    const p2 = newKeypoints[TRIANGULATION[i + 1]]
    const p3 = newKeypoints[TRIANGULATION[i + 2]]
    vertices.set(
      [
        p1.x * newScale,
        position.value[1] - p1.y * newScale,
        p1.z * newScale,
        p2.x * newScale,
        position.value[1] - p2.y * newScale,
        p2.z * newScale,
        p3.x * newScale,
        position.value[1] - p3.y * newScale,
        p3.z * newScale,
      ],
      i * 3
    )
  }
  geometry.computeVertexNormals()
  positionAttribute.needsUpdate = true
}

watch(
  () => props.keypoints,
  keypoints => updateKeypoints(keypoints, scale.value),
  { immediate: true }
)
watch(position, v => mesh.position.set(...(v as PositionTuple)), { immediate: true, deep: true })
watch(scale, v => updateKeypoints(props.keypoints, v), { immediate: true })

onScopeDispose(() => {
  scene.remove(mesh)
  geometry.dispose()
  material.dispose()
})
</script>
