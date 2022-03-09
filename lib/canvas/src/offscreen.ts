import { init, state, stopLooping } from "./renderer"

function size({ width, height }: SizeMessage) {
  state.width = width
  state.height = height
}

const handlers = {
  init,
  size,
  stopLooping,
}

function handleMessage(ev: MessageEvent<CanvasMessage>) {
  console.log("Offscreen handleMessage", ev)
  const fn = handlers[ev.data.type] as CanvasCallback<typeof ev.data.type>
  if (typeof fn !== "function") {
    throw new TypeError("Unknows message type: " + ev.data.type)
  }
  fn(ev.data)
}

self.addEventListener("message", handleMessage)
