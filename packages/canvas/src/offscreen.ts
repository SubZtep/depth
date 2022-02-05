import { init, state } from "./sharender.js"

function size({ width, height }: SizeMessage) {
  state.width = width
  state.height = height
}

const handlers = {
  init,
  size,
}

// self.addEventListener("message", function (ev: MessageEvent<CanvasMessage>) {

//   )

// ;(self as unknown as Worker).onmessage = function (ev: MessageEvent<CanvasMessage>) {
//   // @ts-ignore
//   const fn: CanvasCallback = handlers[ev.data.type]
//   if (typeof fn !== "function") {
//     throw new TypeError("Unknows message type: " + ev.data.type)
//   }
//   fn(ev.data)
// }

function handleMessage(ev: MessageEvent<CanvasMessage>) {
  // @ts-ignore
  const fn: CanvasCallback = handlers[ev.data.type]
  if (typeof fn !== "function") {
    throw new TypeError("Unknows message type: " + ev.data.type)
  }
  fn(ev.data)
}

self.addEventListener("message", handleMessage)
