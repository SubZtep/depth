<template lang="pug">
//- ParaPanel(title="Mesh Outline" @hover="toggleOutline")

//- slot(:mesh="mesh")
</template>

<script lang="ts" setup>
import { useScene, createOutlinedMesh, disposeMesh } from "@depth/canvas"
import { LineSegments } from "three/src/objects/LineSegments"
import { Mesh } from "three/src/objects/Mesh"

const props = defineProps<{
  mesh: Mesh
  updated?: boolean
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
  outline = createOutlinedMesh(props.mesh.geometry, "yellow")
  outline.rotation.copy(props.mesh.rotation)
  outline.position.copy(props.mesh.position)
  scene.add(outline)
}

if (props.updated === undefined) {
  create()
} else {
  watch(() => props.updated, () => {
    dispose()
    create()
  }, { immediate: true })
}

onScopeDispose(() => {
  dispose()
  // console.log("END")
  // toggleOutline(false)
  // scene.remove(mesh)
  // world.removeCollider(groundCollider, true)
})
</script>
