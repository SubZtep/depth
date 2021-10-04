import type { GpuBuffer } from "public/pose"
import { CanvasTexture, MeshBasicMaterial, PlaneBufferGeometry, Mesh, DoubleSide } from "three"
import { singleFns, loopFns } from "~/packages/ThreeJS/useRenderLoop"

export default defineComponent({
  props: {
    image: { type: Object as PropType<GpuBuffer>, required: true },
    scale: { type: Number, default: 1 },
    opacity: { type: Number, default: 1 },
    position: { type: Array as PropType<number[]>, default: () => ([0, 0, 0]) },
  },

  setup(props) {
    const canvasTexture = new CanvasTexture(get(props.image))
    const videoMaterial = new MeshBasicMaterial({
      side: DoubleSide,
      transparent: true,
      opacity: props.opacity,
      map: canvasTexture,
    })

    const playerGeometry = new PlaneBufferGeometry(1, 1)
    const player = new Mesh(playerGeometry, videoMaterial)
    const aspectRatio = useCssVar("--video-aspect-ratio")

    singleFns.add(({ scene }) => scene.add(player))

    const updateTexture: LoopFn = () => {
      canvasTexture.needsUpdate = true
    }

    loopFns.add(updateTexture)

    watch(
      () => props.scale,
      scale => {
        const width = scale * +get(aspectRatio)
        player.scale.set(width, scale, 1)
        player.position.set(props.position[0] + width / 2, props.position[1] + scale / 2, props.position[2])
      },
      { immediate: true }
    )

    watch(
      () => props.opacity,
      opacity => {
        videoMaterial.opacity = opacity
      }
    )

    onBeforeUnmount(() => {
      loopFns.delete(updateTexture)
      singleFns.add(({ scene }) => scene.remove(player))
      canvasTexture.dispose()
      videoMaterial.dispose()
      playerGeometry.dispose()
    })
  },

  render() {
    return () => null
  },
})
