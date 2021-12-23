<template lang="pug">
//- pre.text-white {{q.w}} {{pos}}
//- slot(:position="position" :rotation="rotation")
</template>

<script lang="ts" setup>
import { useScene } from "@depth/canvas"
import { useFace, TRIANGULATION } from "@depth/poser"
import { BufferAttribute } from "three/src/core/BufferAttribute"
import { BufferGeometry } from "three/src/core/BufferGeometry"
import { Mesh } from "three/src/objects/Mesh"
import { MeshPhongMaterial } from "three/src/materials/MeshPhongMaterial"
import { DoubleSide } from "three/src/constants"

const props = defineProps<{
  video: HTMLVideoElement
  streaming: boolean
  // throttle: number
  // lerp: boolean
}>()

// const { throttle = ref(0), lerp = ref(false) } = toRefs(props)

const streaming = toRef(props, "streaming")


const geometry = new BufferGeometry()
const material = new MeshPhongMaterial({
  side: DoubleSide,
  color: "red",
  shininess: 100,
})
const mesh = new Mesh(geometry, material)
useScene().add(mesh)

useFace({
  video: props.video,
  streaming,
  options: { refineLandmarks: true },
  // throttle: ref(500),
  handler: result => {
    if (!result || result.multiFaceLandmarks.length === 0) return
    const keypoints = result.multiFaceLandmarks[0]

    const vertices = new Float32Array(TRIANGULATION.length * 3)

    for (let i = 0; i < TRIANGULATION.length; i += 3) {
      const p1 = keypoints[TRIANGULATION[i]]
      const p2 = keypoints[TRIANGULATION[i + 1]]
      const p3 = keypoints[TRIANGULATION[i + 2]]

      vertices.set([p1.x, p1.y, p1.z, p2.x, p2.y, p2.z, p3.x, p3.y, p3.z], i * 3)
    }

    geometry.setAttribute("position", new BufferAttribute(vertices, 3))
    geometry.computeVertexNormals()
    geometry.attributes.position.needsUpdate = true
  },
})
</script>
