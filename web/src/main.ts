import basicCube from "./canvas3ds/basic-cube"
import testScene from "./canvas3ds/test-scene"
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

// @ts-ignore
document.querySelector("#blue")?.addEventListener("start", basicCube)
// @ts-ignore
document.querySelector("#rend")?.addEventListener("start", testScene)

export {}
