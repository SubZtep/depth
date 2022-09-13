import { setCssVar, appendTemplateToContainer } from "./misc"
import Loop from "@depth/loop"
import { World } from "./world"
import { applyRealtimeSkyGradient, sleep } from "./misc"
import { loopState } from "./state"
import "./styles/main.css"

await import("@depth/wc")
// await sleep(2000)

appendTemplateToContainer("#app-template", "#app-container")
const container = document.querySelector(".scene") as HTMLElement
applyRealtimeSkyGradient(container)

const world = new World(container)
// const setPlayerTransform = setCssVar()("--player-transform")
// setCssVar()("--ground-transform")(world.cssMatrix2D("ground", true))

const smokingText = document.querySelector("smoking-text")!
const css3dCube = document.querySelector<HTMLElement>("css3d-cube")
if (!css3dCube) throw "no css3d-cube"
console.log(css3dCube)

const faceRadio = document.querySelector<HTMLElement>(".face-radio")!
faceRadio.addEventListener("change", ({ target }) => {
  // @ts-ignore
  css3dCube.setAttribute("face", target.value)
})

let smokeFrames = 1

const loop = new Loop({
  autoStart: true,
  statem: loopState,
  callback: (delta) => {
    smokeFrames += 0.2 * delta

    smokingText?.setAttribute("frames", String(smokeFrames))

    // if (loopState.dark) delta *= -1
    // world.step()
  },
})

Object.assign(globalThis, {
  loop,
})

document.querySelector(".scene")?.addEventListener("click", () => {
  console.log("click")
  // world.player.rigidBody.applyImpulse({ x: 0, y: -1000000 }, true)
})
