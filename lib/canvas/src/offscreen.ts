import { init } from "./renderer"

// @ts-ignore
const statem: CanvasStatem = {}
let injectedFunctions: any

function updateStatem(s: { statem: string }) {
  Object.assign(statem, JSON.parse(s.statem))
  if (statem.fps === null) {
    statem.fps = Number.POSITIVE_INFINITY // FIXME: null isn't infinity
  }
}

function exec3D(fn: any) {
  injectedFunctions.singleEvals.push(fn.fn)
}

function loop3D(fn: any) {
  injectedFunctions.loopEvals.push(fn.fn)
}

const handlers: Record<string, any> = {
  init,
  updateStatem,
  exec3D,
  loop3D,
}

function handleMessage(ev: MessageEvent<CanvasMessage>) {
  const fn = handlers[ev.data.type] as CanvasCallback<typeof ev.data.type>
  if (ev.data.type === "init") {
    injectedFunctions = ev.data.injectedFunctions
    ev.data.statem = statem
    handlers.stopLooping = fn(ev.data)
    return
  }
  fn(ev.data)
}

self.addEventListener("message", handleMessage)

export {}
