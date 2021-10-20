import ThreeGlobe from "three-globe"
import { singleFns } from "@depth/three.js"

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
  },
  setup(props, { slots }) {
    // Gen random data
    const N = 300
    const gData = [...Array(N).keys()].map(() => ({
      lat: (Math.random() - 0.5) * 180,
      lng: (Math.random() - 0.5) * 360,
      size: Math.random() / 3,
      color: ["red", "white", "blue", "green"][Math.round(Math.random() * 3)],
    }))

    const Globe = new ThreeGlobe()
      .globeImageUrl("//unpkg.com/three-globe/example/img/earth-dark.jpg")
      .bumpImageUrl("//unpkg.com/three-globe/example/img/earth-topology.png")
      .pointsData(gData)
      .pointAltitude("size")
      .pointColor("color")

    useTimeoutFn(() => {
      gData.forEach(d => (d.size = Math.random()))
      Globe.pointsData(gData)
    }, 4000)

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

    onMounted(() => {
      singleFns.add(({ scene }) => {
        scene.add(Globe)
      })
    })

    onBeforeUnmount(() => {
      singleFns.add(({ scene }) => {
        scene.remove(Globe)
      })
    })

    return () => slots.default && slots.default()
  },
})
