<template lang="pug">
ParaPanel(title="Face Mesh")
  div Position
  InputXYZ(v-model="state.position" :min="-100" :max="100" :step="0.1")
  div Scale
  InputNumber( v-model.number="state.scale" :min="0" :max="100" :step="0.1")
</template>

<script lang="ts" setup>
import { loop3D, useScene } from "@depth/canvas"
import { useFace, TRIANGULATION } from "@depth/poser"
import { BufferAttribute } from "three/src/core/BufferAttribute"
import { BufferGeometry } from "three/src/core/BufferGeometry"
import { Mesh } from "three/src/objects/Mesh"
import { lerp as linearLerp } from "three/src/math/MathUtils"
import { DoubleSide, DynamicDrawUsage } from "three/src/constants"
import { MeshLambertMaterial } from "three/src/materials/MeshLambertMaterial"

const props = defineProps<{
  position: [number, number, number]
  scale?: number
  video: HTMLVideoElement
  streaming: boolean
  throttle: number
  lerp: boolean
}>()

const state = reactive({
  position: props.position,
  scale: props.scale ?? 1,
})

const scene = useScene()

const { throttle = ref(0), lerp = ref(false), streaming = ref(false) } = toRefs(props)

const geometry = new BufferGeometry()

const material = new MeshLambertMaterial({
  side: DoubleSide,
  color: 0xff0000,
})

const prevVertices = new Float32Array(TRIANGULATION.length * 3)
const nextVertices = new Float32Array(TRIANGULATION.length * 3)
const vertices = new Float32Array(TRIANGULATION.length * 3)
const positionAttribute = new BufferAttribute(vertices, 3)
positionAttribute.setUsage(DynamicDrawUsage)
geometry.setAttribute("position", positionAttribute)

const mesh = new Mesh(geometry, material)
mesh.frustumCulled = false
scene.add(mesh)

watchEffect(() => {
  mesh.position.set(...state.position)
})

useFace({
  throttle,
  streaming,
  video: props.video,
  options: { refineLandmarks: true, selfieMode: false },
  handler: result => {
    if (!result || result.multiFaceLandmarks.length === 0) return
    const keypoints = result.multiFaceLandmarks[0]

    for (let i = 0; i < TRIANGULATION.length; i += 3) {
      const p1 = keypoints[TRIANGULATION[i]]
      const p2 = keypoints[TRIANGULATION[i + 1]]
      const p3 = keypoints[TRIANGULATION[i + 2]]
      nextVertices.set(
        [
          p1.x * state.scale,
          state.position[1] - p1.y * state.scale,
          p1.z * state.scale,
          p2.x * state.scale,
          state.position[1] - p2.y * state.scale,
          p2.z * state.scale,
          p3.x * state.scale,
          state.position[1] - p3.y * state.scale,
          p3.z * state.scale,
        ],
        i * 3
      )
    }

    if (!get(throttle) || !get(lerp)) {
      vertices.set(nextVertices)
      geometry.computeVertexNormals()
      positionAttribute.needsUpdate = true
    } else {
      // eslint-disable-next-line unicorn/prefer-spread
      prevVertices.set(vertices)
    }
  },
})

let p0 = 0
let stop: Fn
let t: number
let diff = 0

// TODO: make lerp good
watch(and(throttle, lerp, streaming), on => {
  if (!on) return stop?.()

  stop = loop3D(({ deltaTime }) => {
    diff = performance.now() - p0
    if (diff > get(throttle)!) p0 = performance.now()

    t = diff / get(throttle) + deltaTime

    if (t > 1) {
      prevVertices.set(nextVertices)
      vertices.set(nextVertices)
    } else {
      for (const [i, to] of nextVertices.entries()) {
        const from = prevVertices.at(i) as number
        vertices.set([linearLerp(from, to, t)], i)
      }
    }

    geometry.computeVertexNormals()
    positionAttribute.needsUpdate = true
  })
})

onScopeDispose(() => {
  scene.remove(mesh)
  geometry.dispose()
  material.dispose()
})
</script>
