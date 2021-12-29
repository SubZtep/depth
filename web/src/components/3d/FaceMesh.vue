<template lang="pug">
ParaPanel(title="Face Mesh")
  div Position
  InputXYZ(v-model="state.position" :min="-50" :max="50" :step="0.1")
  div Scale
  InputNumber(v-model.number="state.scale" :min="0" :max="100" :step="0.1")
</template>

<script lang="ts" setup>
import { useScene } from "@depth/canvas"
import { TRIANGULATION } from "@depth/poser"
import { BufferAttribute } from "three/src/core/BufferAttribute"
import { BufferGeometry } from "three/src/core/BufferGeometry"
import { Mesh } from "three/src/objects/Mesh"
import { DoubleSide, DynamicDrawUsage } from "three/src/constants"
import { MeshLambertMaterial } from "three/src/materials/MeshLambertMaterial"

const props = defineProps<{
  position: [number, number, number]
  scale?: number
  keypoints: { x: number; y: number; z: number }[]
}>()

const state = reactive({
  position: props.position,
  scale: props.scale ?? 1,
})

const scene = useScene()

const geometry = new BufferGeometry()
const material = new MeshLambertMaterial({
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

watchEffect(() => {
  mesh.position.set(...state.position)
})

watch(
  () => props.keypoints,
  keypoints => {
    for (let i = 0; i < TRIANGULATION.length; i += 3) {
      const p1 = keypoints[TRIANGULATION[i]]
      const p2 = keypoints[TRIANGULATION[i + 1]]
      const p3 = keypoints[TRIANGULATION[i + 2]]
      vertices.set(
        [
          p1.x * state.scale,
          state.position[1] - p1.y * state.scale,
          p1.z * state.scale,
          p2.x * state.scale,
          state.position[1] - p2.y * state.scale,
          p2.z * state.scale,
          p3.x * state.scale,
          state.position[1] - p3.y * state.scale,
          p3.z * state.scale,
        ],
        i * 3
      )
    }

    geometry.computeVertexNormals()
    positionAttribute.needsUpdate = true
  }
)

onScopeDispose(() => {
  scene.remove(mesh)
  geometry.dispose()
  material.dispose()
})
</script>
