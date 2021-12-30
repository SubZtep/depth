<template lang="pug">
//- ParaPanel(title="Tile Plane" @hover="toggleOutline")
ParaPanel(title="Tile Plane")
  div Dimensions
  InputXY(v-model="state.dimensions" :labels="['Width', 'Height']")

  div Position
  InputXYZ(v-model="state.position")

//- slot(v-if="ready" :mesh="mesh")
slot(:mesh="mesh" :updated="updated")
</template>

<script lang="ts" setup>
import { useScene, createOutlinedMesh, disposeMesh } from "@depth/canvas"
import { PlaneGeometry } from "three/src/geometries/PlaneGeometry"
import { Material } from "three/src/materials/Material"
import { Mesh } from "three/src/objects/Mesh"
import { useCameraFit } from "~/composables/useCameraFit"

const props = defineProps<{
  width: number
  height: number
  dimensions?: [number, number]
  material?: Material
  position?: PositionTuple
}>()

const state = reactive({
  width: props.width,
  height: props.height,
  position: props.position ?? [0, 0, 0],
  dimensions: props.dimensions ?? [1, 1],
})

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
const updated = ref(false)

watchEffect(() => {
  const helperPlane = new PlaneGeometry(...state.dimensions)
  mesh.geometry.copy(helperPlane)
  helperPlane.dispose()

  mesh.position.set(...state.position)
  mesh.updateMatrix()

  // start()
  set(updated, !get(updated))
})

onScopeDispose(() => {
  scene.remove(mesh)
  geometry.dispose()
})
</script>
