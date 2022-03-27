import basicCube from "./canvas3ds/basic-cube"
import testScene from "./canvas3ds/test-scene"
import cameraView from "./canvas3ds/camera-view"
import blue from "./canvas3ds/blue"
import { stateMake } from "@depth/statem"
import "./styles/main.css"
import "@depth/ui"

stateMake(
  {
    bodybg: "",
  },
  "myState"
)

document.querySelector("#blue")?.addEventListener("start", blue)
document.querySelector("#red")?.addEventListener("start", basicCube)
document.querySelector("#rend")?.addEventListener("start", testScene)
document.querySelector("#rend")?.addEventListener("start", cameraView)

// globalThis.canvasgen = (sid: string = "666") => {
//   const el = document.createElement("d-canvas")
//   el.setAttribute("sid", sid)
//   el.setAttribute("offscreen", String("transferControlToOffscreen" in el))
//   document.querySelector(".holes")?.append(el)
//   el.addEventListener("start", basicCube as any)
//   setTimeout(() => {
//     el.setAttribute("autoplay", "true")
//     el.classList.add("zoom")
//   }, 1000)

// }

// Array.from({ length: 9 }, () => globalThis.canvasgen())
// alert(el.setAttribute("autoplay", "true"))
export {}
