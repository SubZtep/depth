import { setCssVar, appendTemplateToContainer } from "./misc"
import Loop from "@depth/loop"
import { World2D } from "./world2d"
import { applyRealtimeSkyGradient, sleep } from "./misc"
import { loopState } from "./state"
import "./styles/main.css"

await import("@depth/wc")
// await sleep(2000)

appendTemplateToContainer("#app-template", "#app-container")
const container = document.querySelector(".scene") as HTMLElement
applyRealtimeSkyGradient(container)

const world = await new World2D(container)
// const setPlayerTransform = setCssVar()("--player-transform")
// setCssVar()("--ground-transform")(world.cssMatrix2D("ground", true))

const loop = new Loop({
  autoStart: true,
  statem: loopState,
  callback: (delta) => {
    // if (loopState.dark) delta *= -1
    world.step()
  },
})

Object.assign(globalThis, {
  loop,
})

document.querySelector(".scene")?.addEventListener("click", () => {
  console.log("click")
  world.player.rigidBody.applyImpulse({ x: 0, y: -1000000 }, true)
})
