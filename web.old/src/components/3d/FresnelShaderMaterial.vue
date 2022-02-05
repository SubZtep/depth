<template lang="pug">
//-ParaPanel(title="Fresnel Shader Material")
  div Color
  InputColor(v-model="state.color" :hover="props.hover")

  div Wireframe
  InputBoolean(v-model="state.wireframe")

  div Line width
  InputNumber(:min="1" :max="10" :step="0.1" v-model="state.wireframeLinewidth" :hover="props.hover")

slot(:material="material")
</template>

<script lang="ts">
const vertexShader = `
  varying vec3 vPositionW;
  varying vec3 vNormalW;

  void main() {
    vPositionW = vec3( vec4( position, 1.0 ) * modelMatrix);
    vNormalW = normalize( vec3( vec4( normal, 0.0 ) * modelMatrix ) );
    gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
  }
`

const fragmentShader = `
  varying vec3 vPositionW;
  varying vec3 vNormalW;
  uniform vec3 uColor;

  void main() {
    vec3 viewDirectionW = normalize(cameraPosition - vPositionW);
    float fresnelTerm = dot(viewDirectionW, vNormalW);
    fresnelTerm = clamp(1.0 - fresnelTerm, 0., 1.);
    gl_FragColor = vec4( uColor.rgb * fresnelTerm, 1.);
  }
`
</script>

<script lang="ts" setup>
import * as THREE from "three"
const props = defineProps<{
  hover?: boolean
}>()

const state = reactive({
  wireframe: false,
  wireframeLinewidth: 5,
  color: "#ffffff",
})

const material = new THREE.ShaderMaterial({
  uniforms: {
    uColor: { value: new THREE.Color(state.color) },
  },
  vertexShader,
  fragmentShader,
  wireframe: state.wireframe,
  wireframeLinewidth: state.wireframeLinewidth,
})

watchEffect(() => {
  material.wireframe = state.wireframe
  material.wireframeLinewidth = state.wireframeLinewidth
  material.uniforms.uColor.value = new THREE.Color(state.color)
  // material.needsUpdate = true
})
</script>
