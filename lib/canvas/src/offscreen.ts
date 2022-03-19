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
  // const ret = fn(ev.data)
  if (ev.data.type === "init") {
    state = ev.data.state
    // handlers.stopLooping = ret
    handlers.stopLooping = fn(ev.data)
    return
  }
  fn(ev.data)
}

self.addEventListener("message", handleMessage)

export {}
