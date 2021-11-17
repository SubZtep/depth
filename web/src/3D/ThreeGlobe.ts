import ThreeGlobe from "three-globe"
import { exec3D } from "@depth/three.js"
import { defineComponent, onBeforeUnmount, onMounted, watch } from "vue"

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
  setup(properties, { slots }) {
    const Globe = new ThreeGlobe().showAtmosphere(false)

    Globe.rotateY(-Math.PI / 2)

    watch(
      () => properties.position,
      (pos: THREE.Vector3Tuple) => {
        Globe.position.set(...pos)
      },
      { immediate: true, deep: true }
    )

    watch(
      () => properties.scale,
      scale => {
        Globe.scale.set(scale, scale, scale)
      },
      { immediate: true, deep: true }
    )

    watch(
      () => properties.surface,
      v => void Globe.globeImageUrl(`/textures/globe/earth-${v}.jpg`),
      { immediate: true }
    )

    watch(
      () => properties.terrain,
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
