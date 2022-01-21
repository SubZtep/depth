<template lang="pug">
ParaPanel(title="Face Mesh")
  div Normalized
  InputBoolean(v-model="normalized")

slot(:mesh="mesh")
</template>

<script lang="ts" setup>
import { useScene } from "@depth/canvas"
import { TRIANGULATION } from "@depth/poser"

type Keypoint = { x: number; y: number; z: number }

const props = defineProps<{
  keypoints: Keypoint[]
  position: PositionTuple
  scale: number
  material?: THREE.Material
  selfie?: boolean
}>()

const { keypoints, position, scale } = toRefs(props)

const scene = useScene()

const geometry = new THREE.BufferGeometry()

const normalized = ref(true)

const material = props.material
  ? props.material
  : new THREE.MeshLambertMaterial({
      side: THREE.DoubleSide,
      color: 0xff0000,
    })

const vertices = new Float32Array(TRIANGULATION.length * 3)
const positionAttribute = new THREE.BufferAttribute(vertices, 3)
positionAttribute.setUsage(THREE.DynamicDrawUsage)
geometry.setAttribute("position", positionAttribute)

const mesh = new THREE.Mesh(geometry, material)
mesh.frustumCulled = false
scene.add(mesh)

const bounding = ref<number[]>([])

const updateKeypoints = (newKeypoints: Keypoint[]) => {
  for (let i = 0; i < TRIANGULATION.length; i += 3) {
    const p1 = newKeypoints[TRIANGULATION[i]]
    const p2 = newKeypoints[TRIANGULATION[i + 1]]
    const p3 = newKeypoints[TRIANGULATION[i + 2]]
    vertices.set([p1.x, p1.y, p1.z, p2.x, p2.y, p2.z, p3.x, p3.y, p3.z], i * 3)
  }

  if (normalized.value) {
    geometry.computeBoundingBox()

    const boundingIndices = [
      ...(geometry.boundingBox!.min!.toArray() as number[]),
      ...(geometry.boundingBox!.max!.toArray() as number[]),
    ]
    const elevate = Math.min(boundingIndices[1], boundingIndices[4])
    const diff = Math.max(boundingIndices[1], boundingIndices[4]) - elevate

    for (let i = 1; i < vertices.length; i += 3) {
      vertices[i] -= elevate
      vertices[i] = diff - vertices[i]
    }
    geometry.scale(1 + elevate, 1 + elevate, 1 + elevate)
    // TODO: remove rotation
  }

  geometry.computeVertexNormals()
  positionAttribute.needsUpdate = true
}

watch(keypoints, v => updateKeypoints(v), { immediate: true })
watch(position, v => void mesh.position.set(...v), { immediate: true, deep: true })
watch(scale, v => void mesh.scale.setScalar(v), { immediate: true })

onScopeDispose(() => {
  scene.remove(mesh)
  geometry.dispose()
  material.dispose()
})
</script>
