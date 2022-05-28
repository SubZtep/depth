import { setCssVar, appendTemplateToContainer } from "@depth/template"
import Loop from "@depth/loop"
import { setInitCb, createWorld, tickWorld, createGround, createPlayer, toCssMatrix } from "@depth/physics"
// import { sleep } from "./misc"
import { loopState } from "./state"
import "./styles/main.css"

await import("@depth/wc")

// await sleep(2000)

appendTemplateToContainer("#app-template", "#app-container")
document.querySelector<HTMLDivElement>(".scene")?.classList.add(`sky-gradient-${new Date().getHours()}`)

let cx = 0
// const setRotation = setCssVar()("--rotation")
// const setMatrix = setCssVar(".player")("--transform")
// const setMatrix = setCssVar()("--transform")
// const setTranslation = setCssVar()("--transform")
const setPlayerX = setCssVar()("--player-x")
const setPlayerY = setCssVar()("--player-y")

createWorld()
const { rigidBody: groundBody } = createGround()
const { rigidBody: playerBody } = createPlayer()

const groundTranslate = groundBody.translation()
setCssVar()("--ground-x")(String(groundTranslate.x))
setCssVar()("--ground-y")(String(groundTranslate.y))

const loop = new Loop({
  autoStart: true,
  statem: loopState,
  callback: (delta) => {
    if (loopState.dark) delta *= -1
    // setRotation(`${(cx += 0.1 * delta)}deg`)
    tickWorld()
    // console.log(body.translation())
    // // console.log(toCssMatrix(body))
    // const matrix = toCssMatrix(body)
    // // console.log(matrix)
    // // console.log(body.transform)``
    // // setMatrix(`matrix(${"1"})`)
    // console.log(body.rotation())
    const translate = playerBody.translation()
    setPlayerX(String(translate.x))
    setPlayerY(String(translate.y))
    // setPlayerY(String(480 - translate.y))
    // console.log(translate)
    // setTranslation(`translate(${Math.floor(translate.x)}px, ${Math.floor(translate.y)}px)`)
    // // setMatrix(`translate(${~~translate.x}px, ${~~translate.y}px)`)
    // setMatrix(`matrix(${matrix})`)
  },
})

Object.assign(globalThis, {
  loop,
})

// setInitCb(() => {
//   console.log("STARTSTARTSTART")
//   // loop?.start()
// })
