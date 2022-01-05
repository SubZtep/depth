<template lang="pug">
</template>

<script lang="ts" setup>
import { useScene, createOutlinedMesh, disposeMesh } from "@depth/canvas"
import { LineSegments } from "three/src/objects/LineSegments"
import { Mesh } from "three/src/objects/Mesh"

const props = defineProps<{
  dimensions?: [number, number]
  scale: number
  position: [number, number, number]
  mesh: Mesh
}>()

const { position, scale, dimensions = ref([1, 1] as [number, number]) } = toRefs(props)
let outline: LineSegments | undefined
const scene = useScene()

const dispose = () => {
  if (outline) {
    scene.remove(outline)
    disposeMesh(outline)
    outline = undefined
  }
}

const create = () => {
  dispose()
  outline = createOutlinedMesh(props.mesh.geometry, "yellow")
  outline.rotation.copy(props.mesh.rotation)
  outline.position.copy(props.mesh.position)
  outline.scale.copy(props.mesh.scale)
  scene.add(outline)
}

watch(dimensions, () => create(), { immediate: true, deep: true })
watch(scale, v => void outline?.scale.setScalar(v), { immediate: true })
watch(position, v => void outline?.position.set(...v), { immediate: true, deep: true })

onScopeDispose(() => {
  dispose()
})
</script>
