// import * as THREE from "three"
// import Stats from "stats.js"
// import { OffscreenCanvas } from "three"
import { init, state } from "./sharender"

// const canvas = document.querySelector("#scene") as HTMLCanvasElement
// console.log(canvas.getContext("webgl"))

// let worker: Worker

// const state: Dimensions = {
//   width: 300, // canvas default
//   height: 150, // canvas default
// }

function startWorker(canvas: HTMLCanvasElement) {
  const offscreen = canvas.transferControlToOffscreen()
  const worker = new Worker("/offscreen.js", { type: "module" })
  worker.postMessage({ type: "init", canvas: offscreen }, [offscreen])

  function sendSize() {
    worker.postMessage({
      type: "size",
      width: canvas.clientWidth,
      height: canvas.clientHeight,
    })
  }

  window.addEventListener("resize", sendSize)
  sendSize()

  console.log("using OffscreenCanvas") /* eslint-disable-line no-console */
}

function startMainPage(canvas: HTMLCanvasElement) {
  init({ canvas })

  function sendSize() {
    state.width = canvas.clientWidth
    state.height = canvas.clientHeight
  }
  window.addEventListener("resize", sendSize)
  sendSize()

  console.log("using regular canvas") /* eslint-disable-line no-console */
}

export function startLooping(canvas: HTMLCanvasElement) {
  // resizeRendererToDisplaySize(renderer)
  // requestAnimationFrame(render)
  // const canvas = document.querySelector("#c")

  // @ts-ignore
  if (canvas.transferControlToOffscreen) {
    startWorker(canvas)
  } else {
    startMainPage(canvas)
  }
}

// function main() {  /* eslint consistent-return: 0 */
//   // const canvas = document.querySelector('#c');
//   if (canvas.transferControlToOffscreen) {
//     startWorker(canvas);
//   } else {
//     startMainPage(canvas);
//   }
// }

// main();
// function size(data: Dimensions) {
//   state.width = data.width
//   state.height = data.height
// }

// let stats: Stats

// let renderer: THREE.WebGLRenderer
// let camera: THREE.PerspectiveCamera
// let scene: THREE.Scene

// let offscreen: OffscreenCanvas

// const cubes: THREE.Mesh[] = []

// const num = 50

// function startWorker(canvas: HTMLCanvasElement) {
//   const offscreen = canvas.transferControlToOffscreen()
//   const worker = new Worker("offscreencanvas-worker-cubes.js", { type: "module" })
//   worker.postMessage({ type: "init", canvas: offscreen }, [offscreen])

//   function sendSize() {
//     worker.postMessage({
//       type: "size",
//       width: canvas.clientWidth,
//       height: canvas.clientHeight,
//     })
//   }

//   window.addEventListener("resize", sendSize)
//   sendSize()

//   console.log("using OffscreenCanvas") /* eslint-disable-line no-console */
// }

// function startMainPage(canvas: HTMLCanvasElement) {
//   init({ canvas })

//   function sendSize() {
//     state.width = canvas.clientWidth
//     state.height = canvas.clientHeight
//   }
//   window.addEventListener("resize", sendSize)
//   sendSize()

//   console.log("using regular canvas") /* eslint-disable-line no-console */
// }

// export function init(wrapper = document.body) {
//   // renderer = new THREE.WebGLRenderer({
//   //   antialias: true,
//   //   powerPreference: "high-performance",
//   //   logarithmicDepthBuffer: true,
//   // })
//   // renderer.physicallyCorrectLights = true
//   // renderer.outputEncoding = THREE.sRGBEncoding
//   // renderer.shadowMap.enabled = true
//   // renderer.shadowMap.type = THREE.PCFSoftShadowMap

//   // camera = new THREE.PerspectiveCamera(90, window.innerWidth / window.innerHeight, 1, 2000)
//   // camera.position.z = 690
//   scene = new THREE.Scene()
//   scene.background = new THREE.Color(0x666600)

//   // const light = new THREE.DirectionalLight(0xff0000, 0.2)
//   // light.position.set(0, 10, 0)
//   // light.target.position.set(-5, 0, 0)
//   // for (let i = 0; i < num; i++) cubes.push(createCube(i))
//   // scene.add(light, light.target, ...cubes)

//   stats = new Stats()
//   stats.showPanel(0)

//   wrapper.append(renderer.domElement, stats.dom)

//   offscreen = renderer.domElement.transferControlToOffscreen()
//   worker = new Worker("./worker.ts", { type: "module" })
//   worker.postMessage({ type: "main", canvas: offscreen }, [offscreen])

//   window.addEventListener("resize", sendSize)
//   sendSize()
// }

// function sendSize() {
//   worker.postMessage({
//     type: "size",
//     width: renderer.domElement.clientWidth,
//     height: renderer.domElement.clientHeight,
//   })
// }

// function resizeRendererToDisplaySize(renderer: THREE.WebGLRenderer) {
//   const canvas = renderer.domElement
//   const pixelRatio = window.devicePixelRatio
//   const width = Math.trunc(state.width * pixelRatio)
//   const height = Math.trunc(state.height * pixelRatio)
//   const needResize = canvas.width !== width || canvas.height !== height
//   if (needResize) {
//     renderer.setSize(width, height, false)
//   }
//   return needResize
// }

// function rotateObject(cube: THREE.Mesh, time: number, speed = 0.05) {
//   const rot = time * speed
//   cube.rotation.x = rot
//   cube.rotation.y = rot
// }

// function render(time: number) {
//   stats.begin()

//   time *= 0.001

//   if (resizeRendererToDisplaySize(renderer)) {
//     const canvas = renderer.domElement
//     camera.aspect = canvas.clientWidth / canvas.clientHeight
//     camera.updateProjectionMatrix()
//   }

//   for (const [index, cube] of cubes.entries()) rotateObject(cube, time, (cubes.length - index) * 0.1)

//   renderer.render(scene, camera)

//   stats.end()

//   requestAnimationFrame(render)
// }

// export function startLooping() {
//   resizeRendererToDisplaySize(renderer)
//   requestAnimationFrame(render)
// }
