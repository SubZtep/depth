import type { GpuBuffer } from "../../../public/libs/pose"
import { get, useCssVar } from "@vueuse/core"
import { defineComponent, onBeforeUnmount, watch } from "vue"

import { CanvasTexture, MeshBasicMaterial, DoubleSide, PlaneBufferGeometry, Mesh } from "@depth/three.js"
// import { singleFns, loopFns } from "@depth/three.js"
// import type { loopFn } from "@depth/three.js"

export default defineComponent({
  props: {
    image: { type: Object as PropType<GpuBuffer>, required: true },
    scale: { type: Number, default: 1 },
    opacity: { type: Number, default: 1 },
    position: { type: Array as PropType<number[]>, default: () => [0, 0, 0] },
  },

  setup(properties) {
    const canvasTexture = new CanvasTexture(get(properties.image))
    const videoMaterial = new MeshBasicMaterial({
      side: DoubleSide,
      transparent: true,
      opacity: properties.opacity,
      map: canvasTexture,
    })

    const playerGeometry = new PlaneBufferGeometry(1, 1)
    const player = new Mesh(playerGeometry, videoMaterial)
    const aspectRatio = useCssVar("--video-aspect-ratio")

    // singleFns.add(({ scene }) => scene.add(player))

    // const updateTexture: Fn /*LoopFn*/ = () => {
    //   canvasTexture.needsUpdate = true
    // }

    // loopFns.add(updateTexture)

    watch(
      () => properties.scale,
      scale => {
        const width = scale * +get(aspectRatio)
        player.scale.set(width, scale, 1)
        player.position.set(
          properties.position[0] + width / 2,
          properties.position[1] + scale / 2,
          properties.position[2]
        )
      },
      { immediate: true }
    )

    watch(
      () => properties.opacity,
      opacity => {
        videoMaterial.opacity = opacity
      }
    )

    onBeforeUnmount(() => {
      // loopFns.delete(updateTexture)
      // singleFns.add(({ scene }) => scene.remove(player))
      canvasTexture.dispose()
      videoMaterial.dispose()
      playerGeometry.dispose()
    })
  },

  render() {
    // eslint-disable-next-line unicorn/no-null
    return () => null
  },
})
