import ThreeGlobe from "three-globe"
import { exec3D } from "@depth/three.js"
import { defineComponent, onBeforeUnmount, onMounted, watch } from "vue"
import type { PropType } from "vue"

export const terrains = ["topology", "water"]
export const surfaces = ["blue-marble", "day", "night", "dark"]

export default defineComponent({
  props: {
    position: {
      type: Array as unknown as PropType<THREE.Vector3Tuple>,
      default: () => [0, 0, 0] as THREE.Vector3Tuple,
    },
    scale: {
      type: Number,
      default: 1,
    },
    surface: {
      type: String,
      default: surfaces[0],
      validator: (v: string) => surfaces.includes(v),
    },
    terrain: {
      type: String,
      default: terrains[0],
      validator: (v: string) => terrains.includes(v),
    },
  },
  setup(props, { slots }) {
    const Globe = new ThreeGlobe().showAtmosphere(false)

    Globe.rotateY(-Math.PI / 2)

    watch(
      () => props.position,
      pos => {
        Globe.position.set(...pos)
      },
      { immediate: true, deep: true }
    )

    watch(
      () => props.scale,
      scale => {
        Globe.scale.set(scale, scale, scale)
      },
      { immediate: true, deep: true }
    )

    watch(
      () => props.surface,
      v => void Globe.globeImageUrl(`/textures/globe/earth-${v}.jpg`),
      { immediate: true }
    )

    watch(
      () => props.terrain,
      v => void Globe.bumpImageUrl(`/textures/globe/earth-${v}.png`),
      { immediate: true }
    )

    onMounted(() => {
      exec3D(({ scene }) => {
        scene.add(Globe)
      })
    })

    onBeforeUnmount(() => {
      exec3D(({ scene }) => {
        scene.remove(Globe)
      })
    })

    return () => slots.default && slots.default()
  },
})
