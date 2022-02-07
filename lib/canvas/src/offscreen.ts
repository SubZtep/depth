import { init, state } from "./renderer"
// import { singleState } from "@depth/statem"
// import { effect } from "@vue/reactivity"

function size({ width, height }: SizeMessage) {
  state.width = width
  state.height = height
}

const handlers = {
  init,
  size,
}

// let ss: any = null

function handleMessage(ev: MessageEvent<CanvasMessage>) {
  // console.log("Offscreen statem", singleState.find("three").precision)
  // console.log("Offscreen statem", singleState)
  // ss = singleState.xxx
  // singleState.xxx.value = 666
  // console.log("Offscreen statem", singleState.xxx.value)
  // singleState.poke("three", "precision", "mediump")
  // console.log("Offscreen statem", singleState.find("three").precision)
  // singleState.melt("three", { precision: "mediump" })
  // setTimeout(() => {
  //   // @ts-ignore
  //   effect(() => singleState.poke("three", "precision", "mediump"))
  //   // @ts-ignore
  //   console.log("SSSSSSSSSS", ss)
  //   // singleState.melt("three", { precision: "lowp" })
  // }, 4000)
  // singleState.precision

  // console.log("Offscreen handleMessage", ev)
  const fn = handlers[ev.data.type] as CanvasCallback<typeof ev.data.type>
  if (typeof fn !== "function") {
    throw new TypeError("Unknows message type: " + ev.data.type)
  }
  fn(ev.data)
}

self.addEventListener("message", handleMessage)
