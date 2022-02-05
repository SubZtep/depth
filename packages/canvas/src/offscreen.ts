import { init, state } from "./sharender.js"

function size({ width, height }: SizeMessage) {
  state.width = width
  state.height = height
}

const handlers = {
  init,
  size,
}

function handleMessage(ev: MessageEvent<CanvasMessage>) {
  console.log("WIIWIIW", ev)
  const fn = handlers[ev.data.type] as CanvasCallback<typeof ev.data.type>
  if (typeof fn !== "function") {
    throw new TypeError("Unknows message type: " + ev.data.type)
  }
  fn(ev.data)
}

self.addEventListener("message", handleMessage)
