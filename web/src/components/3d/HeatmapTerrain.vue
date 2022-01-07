<template lang="pug">
ParaPanel(title="Heatmap Terrain")
  div Dimensions
  InputXY(v-model="dimensions" :labels="['Width', 'Height']" :hover="props.hover")

  div Height ratio
  InputNumber(v-model="mesh.material.uniforms.heightRatio.value" :min="0" :max="100" :hover="props.hover")

  //- div Cell height
  //- InputNumber(v-model="state.cellHeight" :min="0" :max="100" :hover="props.hover")

  //- div tileSize
  //- InputNumber(v-model="state.tileSize" :min="0" :max="100" :step="0.1" :hover="props.hover")

  //- div tileTextureWidth
  //- InputNumber(v-model="state.tileTextureWidth" :min="0" :max="512" :step="0.1" :hover="props.hover")

  //- div tileTextureHeight
  //- InputNumber(v-model="state.tileTextureHeight" :min="0" :max="512" :step="0.1" :hover="props.hover")

slot(:mesh="mesh")
</template>

<script lang="ts" setup>
import { Mesh } from "three/src/objects/Mesh"
import { useScene } from "@depth/canvas"
import { CanvasTexture } from "three/src/textures/CanvasTexture"
import { PlaneBufferGeometry } from "three/src/geometries/PlaneGeometry"
import { ShaderMaterial } from "three/src/materials/ShaderMaterial"

const scene = useScene()

const props = defineProps<{
  dimensions?: [number, number]
  scale?: number
  hover?: boolean
}>()

const dimensions = ref<[number, number]>(props.dimensions ?? [1, 1])

const heatVertex = `
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

const heatFragment = `
  varying float hValue;

  vec3 heatmapGradient(float t) {
    return clamp((pow(t, 1.5) * 0.8 + 0.2) * vec3(smoothstep(0.0, 0.35, t) + t * 0.5, smoothstep(0.5, 1.0, t), max(1.0 - t * 1.7, t * 7.0 - 6.0)), 0.0, 1.0);
  }

  void main() {
    float v = abs(hValue - 1.);
    gl_FragColor = vec4(heatmapGradient(hValue), 1. - v * v) ;
  }
`

const heightMap = createHeightMap()

function createHeightMap() {
  const canvas = document.createElement("canvas")
  canvas.width = 256
  canvas.height = 256
  const ctx = canvas.getContext("2d")!
  ctx.fillStyle = "black"
  ctx.fillRect(0, 0, 256, 256)
  for (let i = 0; i < 100; i++) {
    const x = Math.floor(Math.random() * 255)
    const y = Math.floor(Math.random() * 255)
    const radius = 50
    const grd = ctx.createRadialGradient(x, y, 1, x, y, radius)
    const h8 = Math.floor(Math.random() * 255)
    grd.addColorStop(0, "rgb(" + h8 + "," + h8 + "," + h8 + ")")
    grd.addColorStop(1, "transparent")
    ctx.fillStyle = grd
    ctx.fillRect(0, 0, 256, 256)
  }
  return new CanvasTexture(canvas)
}

const geometry = new PlaneBufferGeometry(50, 50, 1000, 1000)
geometry.rotateX(-Math.PI * 0.5)

const mesh = new Mesh(
  geometry,
  new ShaderMaterial({
    uniforms: {
      heightMap: { value: heightMap },
      heightRatio: { value: 10 },
    },
    vertexShader: heatVertex,
    fragmentShader: heatFragment,
    transparent: true,
  })
)

scene.add(mesh)

watchEffect(() => {
  if (props.scale !== undefined) {
    mesh.scale.setScalar(props.scale)
  }
})
//   mesh.position.set(...props.position)

//   world.cellSize = state.cellSize
//   world.cellSliceSize = state.cellSize * state.cellSize
//   world.cell = new Uint8Array(state.cellSize * state.cellSize * state.cellSize)
//   world.tileSize = state.tileSize
//   world.tileTextureWidth = state.tileTextureWidth
//   world.tileTextureHeight = state.tileTextureHeight
//   setVoxelHeights(state.cellSize, state.cellHeight)

//   const worldData = world.generateGeometryDataForCell(0, 0, 0)
//   geometry.setAttribute("position", new BufferAttribute(new Float32Array(worldData.positions), 3))
//   geometry.setAttribute("normal", new BufferAttribute(new Float32Array(worldData.normals), 3))
//   geometry.setIndex(worldData.indices)
// })

onScopeDispose(() => {
  scene.remove(mesh)
})
</script>
