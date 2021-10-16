import ThreeGlobe from "three-globe"
import { singleFns } from "~/packages/ThreeJS/useRenderLoop"

export default defineComponent({
  setup(_props, { slots }) {
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

    setTimeout(() => {
      gData.forEach(d => (d.size = Math.random()))
      Globe.pointsData(gData)
    }, 4000)

    Globe.position.set(0, 0, 200)

    singleFns.add(({ scene }) => {
      scene.add(Globe)
    })

    return () => slots.default && slots.default()
  },
})
