<template lang="pug">
ParaPanel(title="Tile Plane" @hover="v => panelHovered = v")
  div Dimensions
  InputXY(v-model="dimensions" :labels="['Width', 'Height']")

slot(:mesh="mesh" :dimensions="dimensions" :panel-hovered="panelHovered")
</template>

<script lang="ts" setup>
import { useScene } from "@depth/canvas"
import { PlaneGeometry } from "three/src/geometries/PlaneGeometry"
import { Material } from "three/src/materials/Material"
import { Mesh } from "three/src/objects/Mesh"
import { useCameraFit } from "~/composables/useCameraFit"

const props = defineProps<{
  dimensions: [number, number]
  position: PositionTuple
  material?: Material
}>()

const panelHovered = ref(false)

const dimensions = ref(props.dimensions ?? [0, 0])

const scene = useScene()

const geometry = new PlaneGeometry()

const mesh = new Mesh(geometry, props.material)
mesh.material.needsUpdate = true
mesh.receiveShadow = true
mesh.matrixAutoUpdate = false
mesh.rotateX(-Math.PI / 2)
scene.add(mesh)

useCameraFit().add(mesh)

watchEffect(() => {
  const helperPlane = new PlaneGeometry(...(dimensions.value as [number, number]))
  mesh.geometry.copy(helperPlane)
  helperPlane.dispose()

  mesh.position.set(...props.position)
  mesh.updateMatrix()
})

onScopeDispose(() => {
  scene.remove(mesh)
  geometry.dispose()
})
</script>
