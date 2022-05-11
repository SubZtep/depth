import { Loop } from "@depth/core"
import { loopState } from "./state"
import "./styles/main.css"
import "@depth/wc"

let cx = 0
let root = document.documentElement

new Loop({
  autoStart: true,
  statem: loopState,
  cb: (delta) => {
    root.style.setProperty("--rotate3d", `${(cx += 0.1 * delta)}deg`)
  },
})

const template = document.querySelector<HTMLTemplateElement>("#tpl")
const container = document.querySelector<HTMLElement>("#app")
container && template && container.replaceWith(template.content.cloneNode(true))
