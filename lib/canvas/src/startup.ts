// import { useSingleton } from "@depth/misc"
import { init, state } from "./renderer"
// @ts-ignore
import OffscreenWorker from "./offscreen?worker&inline"
// import Statem from "@depth/statem"

// const statem = new Statem()


// const { singleton } = useSingleton()
// setTimeout(() => {
//   const store = singleton.get("rendererState")
//   store.subscribe(state => {
//     console.log("state changed", state)
//   })
// }, 1000)


function startWorker(canvas: HTMLCanvasElement) {
  const offscreen = canvas.transferControlToOffscreen!()
  const worker: Worker = new OffscreenWorker()

  worker.postMessage({ type: "init", canvas: offscreen }, [offscreen])

  return () => {
    const msg = {
      type: "size",
      width: canvas.clientWidth,
      height: canvas.clientHeight,
    }
    worker.postMessage(msg)
  }
}

function startMainPage(canvas: HTMLCanvasElement) {
  init({ canvas, type: "init" })

  return () => {
    state.width = canvas.clientWidth
    state.height = canvas.clientHeight
  }
}

interface LoopProps {
  canvas: HTMLCanvasElement
  preferOffscreen?: boolean
  state: RendererState
}

export function startLooping({ canvas, preferOffscreen = true, state }: LoopProps) {
  const hasWorker = preferOffscreen && "transferControlToOffscreen" in canvas
  const sendSize = hasWorker ? startWorker(canvas) : startMainPage(canvas)
  console.log("ENV", hasWorker ? "Worker" : "Main thread")

  Object.assign(state, { useOffscreen: hasWorker }) // hack to mutate readonly property

  // sendSize.call(canvas)
  window.addEventListener("resize", sendSize, true)
  const stop = sendSize()
  // return stop
}
