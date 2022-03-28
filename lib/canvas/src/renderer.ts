import * as THREE from "three"
import { createRenderer } from "./builders"
// import ThreeGlobe from "three-globe"


// const N = 300
// const gData = [...Array(N).keys()].map(() => ({
//   lat: (Math.random() - 0.5) * 180,
//   lng: (Math.random() - 0.5) * 360,
//   size: Math.random() / 3,
//   color: ["red", "white", "blue", "green"][Math.round(Math.random() * 3)],
// }))

// const Globe = new ThreeGlobe()
//   .globeImageUrl("//unpkg.com/three-globe/example/img/earth-dark.jpg")
//   .bumpImageUrl("//unpkg.com/three-globe/example/img/earth-topology.png")
//   .pointsData(gData)
//   .pointAltitude("size")
//   .pointColor("color")

//   // Globe.position.set(10, 10,-10)
//   Globe.scale.set(0.1 , 0.1, 0.1)

// setTimeout(() => {
//   gData.forEach((d) => (d.size = Math.random()))
//   Globe.pointsData(gData)
// }, 4000)

// @ts-ignore
// const myGlobe = new ThreeGlobe().globeImageUrl(myImageUrl).pointsData(myData)
// const scene = new THREE.Scene()
// scene.add(myGlobe)


export function init(props: InitMessage) {
  const { canvas, injectedFunctions, statem, scene, width, height } = props
  let oldWidth = 0
  let oldHeight = 0

  const renderer = createRenderer(canvas)
  const clock = new THREE.Clock()

  const camera = new THREE.PerspectiveCamera(90)
  // console.log("camera")
  camera.position.fromArray([1, 1, 1])
  camera.lookAt(0, 0, 0)

  function canvasResizer() {
    if (width === oldWidth || height === oldHeight) return
    oldWidth = width
    oldHeight = height
    camera.aspect = width / height
    camera.updateProjectionMatrix()
    renderer.setSize(width, height, false)
  }

  canvasResizer()

  function clearContext() {
    injectedFunctions.singleFns = []
    injectedFunctions.loopFns = []
    scene.clear()
    renderer.clear()
  }

  let fpsInterval: number
  let prenow = performance.now()
  let elapsed: number
  let now: number
  let deltaTime = 0
  let fps = Number.POSITIVE_INFINITY
  // scene.add(Globe)

  async function render(time: number) {

    renderer.render(scene, camera)
    requestAnimationFrame(render)
    deltaTime += clock.getDelta()

    if (fps !== Number.POSITIVE_INFINITY) {
      now = performance.now()
      elapsed = now - prenow
      fpsInterval = 1000 / fps
    }

    if (fps === Number.POSITIVE_INFINITY || elapsed > fpsInterval) {
      if (fps !== Number.POSITIVE_INFINITY) {
        prenow = now - (elapsed % fpsInterval)
      }

      if (injectedFunctions.singleFns.length > 0 || injectedFunctions.loopFns.length > 0) {
        // const props = { scene, renderer, clock, deltaTime, time, camera, width, height }
        // @ts-ignore
        props.deltaTime = deltaTime

        await Promise.all([
          ...injectedFunctions.singleFns.map((fn: any) => fn(props)),
          ...injectedFunctions.loopFns.map((fn: any) => fn(props)),
        ])
        injectedFunctions.singleFns = []
      }
      deltaTime = 0
    }

    canvasResizer()
  }

  requestAnimationFrame(render)
}
