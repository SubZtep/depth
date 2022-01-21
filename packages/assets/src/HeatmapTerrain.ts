import { defineComponent, onScopeDispose } from "vue"
import * as THREE from "three"
import { useScene } from "@depth/canvas"

// <template lang="pug">
// ComponentPanel(title="Heatmap terrain")
//   div Position
//   InputXYZ(v-model="position" :min="-20" :hover="props.hover")

//   div Dimensions
//   InputXY(v-model="dimensions" :labels="['Width', 'Height']" :max="200" :hover="props.hover")

//   div Segments
//   InputXY(v-model="segments" :labels="['Width', 'Height']" :max="2000" :hover="props.hover")

//   div Height ratio
//   InputNumber(v-model="mesh.material.uniforms.heightRatio.value" :min="0" :max="100" :step="0.1" :hover="props.hover")

// slot(:mesh="mesh")
// </template>

// <script lang="ts" setup>
// import { useScene } from "@depth/canvas"
// import { Mesh } from "three/src/objects/Mesh"
// import { throttledWatch } from "@vueuse/core"
// import { CanvasTexture } from "three/src/textures/CanvasTexture"
// import { PlaneGeometry } from "three/src/geometries/PlaneGeometry"
// import { ShaderMaterial } from "three/src/materials/ShaderMaterial"

// const props = defineProps<{
//   position?: [number, number, number]
//   dimensions?: [number, number]
//   segments?: [number, number]
//   heightRatio?: number
//   scale?: number
//   hover?: boolean
// }>()

// const position = ref<[number, number, number]>(props.position ?? [0, 0, 0])
// const dimensions = ref<[number, number]>(props.dimensions ?? [50, 50])
// const segments = ref<[number, number]>(props.segments ?? [1000, 1000])

const vertexShader = `
  uniform sampler2D heightMap;
  uniform float heightRatio;
  varying vec2 vUv;
  varying float hValue;
  void main() {
    vUv = uv;
    vec3 pos = position;
    hValue = texture2D(heightMap, vUv).g;
    pos.y = hValue * heightRatio;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos,1.0);
  }
`

const fragmentShader = `
  varying float hValue;

  vec3 heatmapGradient(float t) {
    return clamp((pow(t, 1.5) * 0.8 + 0.2) * vec3(smoothstep(0.0, 0.35, t) + t * 0.5, smoothstep(0.5, 1.0, t), max(1.0 - t * 1.7, t * 7.0 - 6.0)), 0.0, 1.0);
  }

  void main() {
    float v = abs(hValue - 1.);
    gl_FragColor = vec4(heatmapGradient(hValue), 1. - v * v) ;
  }
`

function createHeightMap() {
  const canvas = document.createElement("canvas")
  canvas.width = 256
  canvas.height = 256
  const context = canvas.getContext("2d")!
  context.fillStyle = "black"
  context.fillRect(0, 0, 256, 256)
  for (let i = 0; i < 100; i++) {
    const x = Math.floor(Math.random() * 255)
    const y = Math.floor(Math.random() * 255)
    const radius = 50
    const grd = context.createRadialGradient(x, y, 1, x, y, radius)
    const h8 = Math.floor(Math.random() * 255)
    grd.addColorStop(0, "rgb(" + h8 + "," + h8 + "," + h8 + ")")
    grd.addColorStop(1, "transparent")
    context.fillStyle = grd
    context.fillRect(0, 0, 256, 256)
  }
  return new THREE.CanvasTexture(canvas)
}

// watchEffect(() => {
//   if (props.scale !== undefined) {
//     mesh.scale.setScalar(props.scale)
//   }
//   mesh.position.set(...position.value)
// })

// throttledWatch(
//   [dimensions, segments],
//   () => {
//     mesh.geometry.dispose()
//     const geometry = new PlaneGeometry(dimensions.value[0], dimensions.value[1], segments.value[0], segments.value[1])
//     geometry.rotateX(-Math.PI * 0.5)
//     mesh.geometry = geometry
//     mesh.updateMatrix()
//   },
//   { immediate: true, deep: true, throttle: 500 }
// )

// </script>

export default defineComponent({
  setup() {
    const scene = useScene()
    const heightMap = createHeightMap()

    const mesh = new THREE.Mesh(
      undefined,
      new THREE.ShaderMaterial({
        transparent: true,
        uniforms: {
          heightMap: { value: heightMap },
          // heightRatio: { value: props.heightRatio ?? 10 },
          heightRatio: { value: 10 },
        },
        vertexShader,
        fragmentShader,
      })
    )

    scene.add(mesh)

    mesh.geometry.dispose()
    // const geometry = new THREE.PlaneGeometry(dimensions.value[0], dimensions.value[1], segments.value[0], segments.value[1])
    const geometry = new THREE.PlaneGeometry(10, 10, 10, 10)
    geometry.rotateX(-Math.PI * 0.5)
    mesh.geometry = geometry
    mesh.updateMatrix()

    onScopeDispose(() => {
      scene.remove(mesh)
    })

    return {}
  },
  template: "<div>HEYHO</div>",
})
