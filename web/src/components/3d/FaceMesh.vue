<template lang="pug">
//- pre.text-white {{q.w}} {{pos}}
//- slot(:position="position" :rotation="rotation")
</template>

<script lang="ts" setup>
import { loop3D, useScene } from "@depth/canvas"
import { useFace, TRIANGULATION } from "@depth/poser"
import { BufferAttribute } from "three/src/core/BufferAttribute"
import { BufferGeometry } from "three/src/core/BufferGeometry"
import { Mesh } from "three/src/objects/Mesh"
import { lerp as linearLerp } from "three/src/math/MathUtils"
import { MeshPhongMaterial } from "three/src/materials/MeshPhongMaterial"
import { DoubleSide, DynamicDrawUsage } from "three/src/constants"

const props = defineProps<{
  video: HTMLVideoElement
  streaming: boolean
  throttle: number
  lerp: boolean
}>()

const { throttle = ref(0), lerp = ref(false), streaming = ref(false) } = toRefs(props)

const geometry = new BufferGeometry()
const material = new MeshPhongMaterial({
  side: DoubleSide,
  color: 0xff0000,
  shininess: 100,
})

const prevVertices = new Float32Array(TRIANGULATION.length * 3)
const nextVertices = new Float32Array(TRIANGULATION.length * 3)
const vertices = new Float32Array(TRIANGULATION.length * 3)
const positionAttribute = new BufferAttribute(vertices, 3)
positionAttribute.setUsage(DynamicDrawUsage)
geometry.setAttribute("position", positionAttribute)

const mesh = new Mesh(geometry, material)
useScene().add(mesh)

const height = 1.5

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
      nextVertices.set([p1.x, height - p1.y, p1.z, p2.x, height - p2.y, p2.z, p3.x, height - p3.y, p3.z], i * 3)
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
</script>
