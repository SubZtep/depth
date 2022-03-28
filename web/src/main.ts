import testScene from "./canvas3ds/test-scene"
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
document.querySelector("#rend")?.addEventListener("start", testScene, { once: true, passive: true })
