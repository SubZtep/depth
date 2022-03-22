import { init } from "./renderer"

let statem: any
let injectedFunctions: any

function size({ width, height }: SizeMessage) {
  statem.width = width
  statem.height = height
}

function stop() {
  statem.running = false
}

function exec3D(fn: any) {
  injectedFunctions.singleEvals.push(fn.fn)
}

function loop3D(fn: any) {
  injectedFunctions.loopEvals.push(fn.fn)
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
  if (ev.data.type === "init") {
    injectedFunctions = ev.data.injectedFunctions
    statem = ev.data.statem
    handlers.stopLooping = fn(ev.data)
    return
  }
  fn(ev.data)
}

self.addEventListener("message", handleMessage)

export {}
