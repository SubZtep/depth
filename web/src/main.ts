import Loop from "@depth-lib/loop"
import { loopState } from "./state"
import "./styles/main.css"
import "@depth-wc/css3d-cube"
import "@depth-wc/statem-debug"
import "@depth-wc/svg-icon"

let cx = 0
const root = document.documentElement

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
