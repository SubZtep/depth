// import { init, state } from "./renderer"
import { init } from "./renderer"

let state: any

function size({ width, height }: SizeMessage) {
  state.width = width
  state.height = height
}

function stop() {
  state.running = false
}

function exec3D(fn: any) {
  // console.log("VERGER")
  state.singleEvals.push(fn.fn)
}

function loop3D(fn: any) {
  state.loopEvals.push(fn.fn)
}

const handlers: Record<string, any> = {
  init,
  size,
  stop,
  exec3D,
  loop3D,
}

function handleMessage(ev: MessageEvent<CanvasMessage>) {
  const fn = handlers[ev.data.type] as CanvasCallback<typeof ev.data.type>
  // if (typeof fn !== "function") {
  //   throw new TypeError("Unknows message type: " + ev.data.type)
  // }
  // console.log("XXX", ev.data)
  const ret = fn(ev.data)
  if (ev.data.type === "init") {
    handlers.stopLooping = ret
    state = ev.data.state
    // console.log("QQQ", state)
  }
}

self.addEventListener("message", handleMessage)

export {}
