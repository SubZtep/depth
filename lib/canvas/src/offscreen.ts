import { init } from "./renderer"
import * as THREE from "three"

// @ts-ignore
const statem: CanvasStatem = {}
let injectedFunctions: InjectedFunctions

function updateStatem({ statem: newStatem }: StatemMessage) {
  Object.assign(statem, JSON.parse(newStatem))
  if (statem.fps === null) {
    statem.fps = Number.POSITIVE_INFINITY // FIXME: null isn't infinity
  }
}

function exec3D({ fn }: Exec3DMessage) {
  injectedFunctions?.singleFns.push(fn)
}

function loop3D({ fn }: Loop3DMessage) {
  injectedFunctions?.loopFns.push(fn)
}

const handlers: Record<string, any> = {
  init,
  updateStatem,
  exec3D,
  loop3D,
}

function handleMessage({ data }: MessageEvent<CanvasMessage>) {
  const fn = handlers[data.type] as CanvasCallback<typeof data.type>
  if (data.type === "init") {
    injectedFunctions = data.injectedFunctions
    data.statem = statem
    // data.scene = JSON.parse(data.scene)
    data.scene = new THREE.ObjectLoader().parse(data.scene)
  }
  fn(data)
}

self.addEventListener("message", handleMessage)

export {}
