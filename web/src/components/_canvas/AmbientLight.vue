<template lang="pug">
ParaPanel(title="Ambient Light")
  div Color
  InputColor(v-model="state.color")
  div Intensity
  InputNumber(v-model="state.intensity" :min="0" :max="2" :step="0.1")
</template>

<script lang="ts" setup>
import { useScene } from "@depth/canvas"

const props = defineProps<{
  color?: string
  intensity?: number
}>()

const state = reactive({
  color: props.color ?? "#ffffff",
  intensity: props.intensity ?? 1,
})

const scene = useScene()
const light = new THREE.AmbientLight(state.color, state.intensity)
scene.add(light)

watchEffect(() => {
  light.color.set(state.color)
  light.intensity = state.intensity
})

onScopeDispose(() => {
  scene.remove(light)
  light.dispose()
})
</script>
