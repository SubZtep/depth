<template lang="pug">
ParaPanel(title="Directional Light")
  div Color
  InputColor(v-model="state.color" :hover="props.hover === true")
  div Intensity
  InputNumber(v-model="state.intensity" :min="0" :max="10" :step="0.1" :hover="props.hover === true")
</template>

<script lang="ts" setup>
import { useScene, loop3D } from "@depth/canvas"
import { useCameraControls } from "@depth/controller"

const props = defineProps<{
  position?: PositionTuple
  target?: PositionTuple
  linkCameraPosition?: boolean
  hover?: boolean
}>()

const state = reactive({
  color: "#ffffff",
  intensity: 1,
  position: props.position ?? [0, 0, 0],
  target: props.target ?? [0, 0, 0],
})

const scene = useScene()

const directionalLight = new THREE.DirectionalLight()
directionalLight.castShadow = true
directionalLight.shadow.mapSize.width = 512 // default
directionalLight.shadow.mapSize.height = 512 // default
directionalLight.shadow.camera.near = 0.5 // default
directionalLight.shadow.camera.far = 100 // default
scene.add(directionalLight, directionalLight.target)

if (props.linkCameraPosition) {
  const cc = useCameraControls()
  loop3D(() => {
    directionalLight.position.set(...cc.camera.position.toArray())
    directionalLight.target.position.set(-4, 2, 0)
  })
}

watchEffect(() => {
  directionalLight.color.set(state.color)
  directionalLight.intensity = state.intensity
})

onScopeDispose(() => {
  scene.remove(directionalLight, directionalLight.target)
  directionalLight.dispose()
})
</script>
