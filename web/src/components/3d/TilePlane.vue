<template lang="pug">
//- ParaPanel(title="Tile Plane" @hover="toggleOutline")
ParaPanel(title="Tile Plane")
  div Dimensions
  InputXY(v-model="dimensions" :labels="['Width', 'Height']")

  div Position
  InputXYZ(v-model="position")

slot(:mesh="mesh")
//- slot(v-if="ready" :mesh="mesh")
//- slot(:mesh="mesh" :updated="updated")
</template>

<script lang="ts" setup>
import { useScene, createOutlinedMesh, disposeMesh } from "@depth/canvas"
import { useTimeout } from "@vueuse/core"
import { PlaneGeometry } from "three/src/geometries/PlaneGeometry"
import { Material } from "three/src/materials/Material"
import { Mesh } from "three/src/objects/Mesh"
import { provide } from "vue"
import { useCameraFit } from "~/composables/useCameraFit"

const props = defineProps<{
  dimensions?: [number, number]
  material?: Material
  position?: PositionTuple
}>()

const position = reactive(props.position ?? [0, 0, 0])
const dimensions = reactive(props.dimensions ?? [1, 1])

provide("position", position)
provide("dimensions", dimensions)

// const state = reactive({
//   // position: props.position ?? [0, 0, 0],
//   dimensions: props.dimensions ?? [1, 1],
// })

const scene = useScene()

const geometry = new PlaneGeometry()

const mesh = new Mesh(geometry, props.material)
mesh.material.needsUpdate = true
mesh.receiveShadow = true
mesh.matrixAutoUpdate = false
mesh.rotateX(-Math.PI / 2)
scene.add(mesh)

useCameraFit().add(mesh)

// const { ready, start } = useTimeout(1000, { controls: true })

watchEffect(() => {
  const helperPlane = new PlaneGeometry(...dimensions as [number, number])
  mesh.geometry.copy(helperPlane)
  helperPlane.dispose()

  mesh.position.set(...position as PositionTuple)
  mesh.updateMatrix()

  // start()
})

onScopeDispose(() => {
  scene.remove(mesh)
  geometry.dispose()
})
</script>
