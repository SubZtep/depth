import { setCssVar, appendTemplateToContainer } from "@depth/template"
import Loop from "@depth/loop"
import { setInitCb, createWorld, tickWorld, createRigidBody, toCssMatrix } from "@depth/physics"
import { sleep } from "./misc"
import { loopState } from "./state"
import "./styles/main.css"
// import "@depth-wc/css3d-cube"
// import "@depth-wc/statem-debug"
// import "@depth-wc/svg-icon"
// import "@depth-wc/input"

appendTemplateToContainer("#app-template", "#app-container")
document.querySelector<HTMLDivElement>(".scene")?.classList.add(`sky-gradient-${new Date().getHours()}`)

let cx = 0
const setRotation = setCssVar()("--rotation")
// const setMatrix = setCssVar(".player")("--transform")
const setMatrix = setCssVar()("--transform")

await createWorld()
// await sleep(2000)
const body = createRigidBody()

const loop = new Loop({
  autoStart: false,
  statem: loopState,
  callback: (delta) => {
    if (loopState.dark) delta *= -1
    setRotation(`${(cx += 0.1 * delta)}deg`)
    tickWorld()
    // console.log(toCssMatrix(body))
    const matrix = toCssMatrix(body)
    // console.log(matrix)
    // console.log(body.rotation)
    // console.log(body.transform)
    // setMatrix(`matrix(${"1"})`)
    const translate = body.translation()
    // setMatrix(`translate(${~~translate.x}px, ${~~translate.y}px)`)
    setMatrix(`matrix(${matrix})`)
  },
})

Object.assign(globalThis, {
  loop,
})

setInitCb(() => {
  console.log("STARTSTARTSTART")
  // loop?.start()
})
