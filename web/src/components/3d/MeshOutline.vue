<template lang="pug">
//- ParaPanel(title="Mesh Outline" @hover="toggleOutline")

//- slot(:mesh="mesh")
</template>

<script lang="ts" setup>
import { useScene, createOutlinedMesh, disposeMesh } from "@depth/canvas"
import { LineSegments } from "three/src/objects/LineSegments"
import { Mesh } from "three/src/objects/Mesh"
import { inject } from "vue"

const position = inject<[number, number, number]>("position")
const dimensions = inject<[number, number]>("dimensions")

const props = defineProps<{
  mesh: Mesh
}>()

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

watch(dimensions!, () => create(), { immediate: true })
watch(position!, pos => outline?.position.set(...position!), { immediate: true })

onScopeDispose(() => {
  dispose()
})
</script>
