import testScene from "./canvas3ds/test-scene"
import { stateMake } from "@depth/statem"
import "./styles/main.css"
import "@depth/ui"
import { CanvasStatem } from "@depth/canvas"
import * as THREE from "three"
import ThreeGlobe from "three-globe"

stateMake(
  {
    bodybg: "",
  },
  "myState"
)

// // @ts-ignore
// // const myGlobe = new ThreeGlobe().globeImageUrl(myImageUrl).pointsData(myData)
const scene = new THREE.Scene()
// // scene.add(myGlobe)
// scene.add(Globe)

const canvasState = stateMake<CanvasStatem>(
  {
    running: true,
    offscreen: false,
    fps: Number.POSITIVE_INFINITY,
    // width: this.clientWidth,
    // height: this.clientHeight,
    scene: scene.toJSON(),
  },
  "666"
)

// @ts-ignore
document.querySelector("#rend")?.addEventListener(
  "start",
  (x) => {
    console.log(x)
    exec3D(({ scene }) => {
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

      Globe.position.set(10, 10, 10)
      scene.add(Globe)
    })
    // setTimeout(() => {
    //   gData.forEach((d) => (d.size = Math.random()))
    //   Globe.pointsData(gData)
    // }, 4000)
  },
  // (ev) => {
  //   testScene(ev)
  // },
  { passive: true }
)
