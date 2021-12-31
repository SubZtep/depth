<template lang="pug">
//- ParaPanel(title="Mesh Outline" @hover="toggleOutline")
//- .text-white {{position}}, {{ dimensions }}
</template>

<script lang="ts" setup>
import { useScene, createOutlinedMesh, disposeMesh } from "@depth/canvas"
import { LineSegments } from "three/src/objects/LineSegments"
import { Mesh } from "three/src/objects/Mesh"

const props = defineProps<{
  dimensions: [number, number]
  position: [number, number, number]
  mesh: Mesh
}>()

const { position, dimensions } = toRefs(props)

const scene = useScene()

let outline: LineSegments | undefined

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
  scene.add(outline)
}

watch(dimensions, () => create(), { immediate: true, deep: true })
watch(position, pos => outline?.position.set(...pos), { immediate: true, deep: true })

onScopeDispose(() => {
  dispose()
})
</script>
